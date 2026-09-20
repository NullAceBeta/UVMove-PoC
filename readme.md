# UV Move - Prueba de Concepto (PoC) 


## Descripción del Proyecto
Prueba de Concepto (PoC) para el sistema de movilidad universitaria "UV Move". Este proyecto demuestra la viabilidad técnica de la arquitectura propuesta, conectando una interfaz web interactiva con una API REST y una base de datos relacional para gestionar la disponibilidad y reserva de vehículos dentro del campus.

## Tecnologías Utilizadas
* **Frontend:** React.js, Vite, CSS (Maquetación responsiva).
* **Backend:** Node.js, Express.js.
* **Base de Datos:** IBM Db2 (Desplegada en contenedores Docker).
* **Seguridad y Autenticación:** Supabase Auth.

## Instrucciones de Ejecución Local
1. Levantar el contenedor de IBM Db2 mediante Docker y ejecutar los scripts SQL de la carpeta `database`.
2. En la carpeta del backend (`api-uvmove`), ejecutar `npm install` y levantar la API con `node src/index.js` (Puerto 3000).
3. En la carpeta del frontend (`frontend-uvmove`), instalar dependencias con `pnpm install` y ejecutar `pnpm run dev` (Puerto 5173).
---

## Guía de Trazabilidad y Contratos

**Requisitos Atendidos:** 
* **R6.** El usuario puede reservar un Vehículo disponible.
* **R7.** Una reservación debe impedir temporalmente que el vehículo sea asignado a otro usuario.

**Reglas de Negocio:** 
* **RN2.** Un usuario no puede tener más de un vehículo en uso simultáneamente.
* **RN3.** Un vehículo solo puede reservarse si se encuentra "libre".

**Módulo Solicitante:** Reservaciones (Gestor encargado de solicitar la retención de una unidad a nombre de un estudiante).
**Interfaz / Servicio:** API REST Node.js -> Endpoint `POST /api/prestamos`

### Contrato del Endpoint
* **Entrada:** JSON con `correo`, `idVehiculo`, `hora_salida` y cabecera `Authorization: Bearer`.
* **Condición:** Validación cruzada en Db2; el correo no debe existir en préstamo con estatus 'En espera' o 'En viaje'.
* **Salida:** HTTP 200 (Mensaje de éxito) o HTTP 400 (Bad Request).
* **Módulo proveedor:** Disponibilidad de vehículos.
* **Entidades / Tablas:** `Usuario` (Identidad y FK), `Vehiculo` (Catálogo y cambio de estado), `PRESTAMO` (Registro transaccional).

### Escenarios de Prueba End-to-End
* **Escenario Exitoso (Happy Path):** Un usuario sin viajes activos visualiza el catálogo de unidades filtrando por estatus 'Libre'. Solicita reservar la unidad. El backend valida, inserta el registro en `PRESTAMO` con estatus 'En espera' y actualiza el `Vehiculo` a 'En uso'. El frontend redirige a la vista del QR/Temporizador.
* **Escenario de Rechazo (RN2):** El usuario, teniendo una reserva activa, intenta forzar la solicitud de un segundo vehículo. El endpoint `POST /api/prestamos` lee Db2, detecta el viaje previo, evalúa la RN2, aborta la transacción (evitando el `INSERT` y el `UPDATE`) y devuelve un código HTTP 400. La interfaz captura el error y muestra la vista "Reserva Denegada".
* **Resultado Esperado:** Se mantiene la integridad transaccional en IBM Db2. Es imposible que existan préstamos dobles para un mismo usuario, y el catálogo refleja en tiempo real cuando un vehículo deja de estar disponible.   
---

## ¿La implementación confirmó el diseño que propusimos o revelo una inconsistencia que fue necesario corregir?

 Durante el desarrollo de la PoC, el diseño arquitectónico general fue validado con éxito; sin embargo, la integración estricta con IBM Db2 reveló inconsistencias transaccionales que obligaron a refactorizar la lógica del backend.

**Hallazgos Principales:**
1. **Serialización de Datos:** El modelo de datos original no contemplaba que los drivers de IBM Db2 exigen el mapeo estricto de columnas en **MAYÚSCULAS** al serializar los JSON (`IDVEHICULO`, `ESTADO`), lo que rompió el contrato inicial entre el frontend y el backend en la primera iteración.
2. **Integridad Transaccional:** Fue necesario ajustar las consultas SQL del módulo de Disponibilidad (`UPDATE Vehiculo SET estado = 'En uso'`) para que los endpoints de Reservaciones no solo crearan el `PRESTAMO`, sino que efectivamente dispararan la actualización en el módulo de vehículos dentro de la misma transacción.
3. **Seguridad:** Se blindó el entorno utilizando validación estricta de identidad mediante *Introspection Endpoints* con la API de Supabase, sustituyendo la verificación local de algoritmos JWT que generaba conflictos.
