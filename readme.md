## Guía de trazabilidad
 Requisitos: R6. El usuario puede reservar un Vehículo disponible, R7. Una reservación debe de impedir temporalmente que el vehículo sea asignado a otro usuario
 Reglas de Negocio: RN2. Un usuario no puede tener más de un vehículo en uso simultáneamente y RN3. Un vehículo solo puede reservarse si se encuentra "libre"
 Modulo solicitante: Reservaciones (Gestor encargado de solicitar la retención de una unidad a nombre de un estudiante).
 interfaz/Servicio: API REST Node.js: Endpoint POST/api/prestamos

## Contrato

 Entrada: JSON con correo, idVehiculo, hora_salida y cabecera Authorization: Bearer <Token>

 Condicion: Validación cruzada en Db2; el correo no debe existir en prestamo con estatus 'En espera' o 'En viaje

 Salida: HTTP 200 (Mensaje de éxito) o HTTP 400 Bad Request

 Módulo proveedor: Disponibilidad de vehiculos (Gestor de catalogo general encargado de confirmar estatus y actualizar estados físicos)
 Entidades/Tablas: Usuario (Identidad y FK), Vehiculo (Catálogo y cambio de estado), PRESTAMO (Registro transaccional)
 Escenario exitoso: Un usuario sin viajes activos visualiza el catálogo de unidades filtrando por estatus 'Libre'. Solicita reservar la unidad. El backend valida, inserta el registro en PRESTAMO con estatus 'En espera' y actualiza el Vehiculo a 'En uso'. El frontend redirige a la vista del QR/Temporizador.
 Escenario de rechazo: El usuario, teniendo una reserva activa ('En espera' o 'En viaje'), intenta forzar la solicitud de un segundo vehículo. El endpoint POST /api/prestamos lee Db2, detecta el viaje previo, evalúa la RN2, aborta la transacción (evitando el INSERT y el UPDATE) y devuelve un código 400. La interfaz muestra la vista "Reserva Denegada".
 Resultado esperado: Se mantiene la integridad transaccional en IBM Db2. Es imposible que existan préstamos dobles para un mismo usuario, y el catálogo refleja en tiempo real cuando un vehículo deja de estar disponible para el resto de los estudiantes.

## ¿La implementación confirmó el diseño que propusimos o revelo una inconsistencia que fue necesario corregir?

 Durante el desarrollo de la PoC, el diseño arquitectónico general fue validado con éxito; sin embargo, la integración estricta con IBM Db2 reveló inconsistencias transaccionales que obligaron a refactorizar la lógica del backend.

## Hallazgo principal:
 El modelo de datos y el diseño original no contemplaban que los drivers de IBM Db2 exigen el mapeo estricto de columnas en MAYÚSCULAS al serializar los JSON (IDVEHICULO, ESTADO), lo que rompió el contrato inicial entre el frontend y el backend. Además, fue necesario ajustar las consultas SQL del módulo de Disponibilidad (UPDATE Vehiculo SET estado = 'En uso') para que los endpoints de Reservaciones no solo crearan el PRESTAMO, sino que efectivamente dispararan la actualización en el módulo de vehículos dentro de la misma transacción, evitando que unidades ya reservadas siguieran apareciendo disponibles en los mapas de otros usuarios. Finalmente, se blindó el entorno utilizando validación estricta de identidad mediante Introspection Endpoints con la API de Supabase, sustituyendo la verificación local de algoritmos JWT que generaba conflictos.
