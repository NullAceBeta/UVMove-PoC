### Guía de trazabilidad
## Requisitos: R6. El usuario puede reservar un Vehículo disponible, R7. Una reservación debe de impedir temporalmente que el vehículo sea asignado a otro usuario
## Reglas de Negocio: RN2. Un usuario no puede tener más de un vehículo en uso simultáneamente y RN3. Un vehículo solo puede reservarse si se encuentra "libre"
## Modulo solicitante: Reservaciones (Gestor encargado de solicitar la retención de una unidad a nombre de un estudiante).
## interfaz/Servicio: API REST Node.js: Endpoint POST/api/prestamos

## Contrato

## Entrada: JSON con correo, idVehiculo, hora_salida y cabecera Authorization: Bearer <Token>

## Condicion: Validación cruzada en Db2; el correo no debe existir en prestamo con estatus 'En espera' o 'En viaje

## Salida: HTTP 200 (Mensaje de éxito) o HTTP 400 Bad Request

## Módulo proveedor: Disponibilidad de vehiculos (Gestor de catalogo general encargado de confirmar estatus y actualizar estados físicos)
## Entidades/Tablas: Usuario (Identidad y FK), Vehiculo (Catálogo y cambio de estado), PRESTAMO (Registro transaccional)
## Escenario exitoso: Un usuario sin viajes activos visualiza el catálogo de unidades filtrando por estatus 'Libre'. Solicita reservar la unidad. El backend valida, inserta el registro en PRESTAMO con estatus 'En espera' y actualiza el Vehiculo a 'En uso'. El frontend redirige a la vista del QR/Temporizador.
## Escenario de rechazo: El usuario, teniendo una reserva activa ('En espera' o 'En viaje'), intenta forzar la solicitud de un segundo vehículo. El endpoint POST /api/prestamos lee Db2, detecta el viaje previo, evalúa la RN2, aborta la transacción (evitando el INSERT y el UPDATE) y devuelve un código 400. La interfaz muestra la vista "Reserva Denegada".
## Resultado esperado: Se mantiene la integridad transaccional en IBM Db2. Es imposible que existan préstamos dobles para un mismo usuario, y el catálogo refleja en tiempo real cuando un vehículo deja de estar disponible para el resto de los estudiantes.
