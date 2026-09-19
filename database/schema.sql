--Proyecto UVMove (DB) By: Carlos Jesús Méndez Coria--

-- Limpieza Previa --
DROP TABLE Prestamo;
DROP TABLE Alumno;
DROP TABLE Maestro;
DROP TABLE Vehiculo;
DROP TABLE Usuario;

--E N T I D A D E S  F U E R T E S--
CREATE TABLE Usuario(
    correo VARCHAR(50) NOT NULL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,

    CHECK (correo LIKE '%@%')
);

CREATE TABLE Alumno(
    correo VARCHAR(50) NOT NULL PRIMARY KEY,
    carrera VARCHAR(50) NOT NULL,
    semestre SMALLINT NOT NULL,
    promedio FLOAT NOT NULL,
    matricula VARCHAR(10) UNIQUE NOT NULL,

    FOREIGN KEY (correo) REFERENCES Usuario(correo) ON DELETE CASCADE,

    CHECK (matricula LIKE 's%'),
    CHECK (carrera IN ('ISW', 'LTIO', 'CON', 'GES'))
);

CREATE TABLE Maestro(
    correo VARCHAR(50) NOT NULL PRIMARY KEY,
    gradoAcademico VARCHAR(10) NOT NULL,
    cubiculo VARCHAR(20) NOT NULL,
    Departamento VARCHAR(30) NOT NULL,
    matricula VARCHAR(8) UNIQUE NOT NULL,

    FOREIGN KEY (correo) REFERENCES Usuario(correo) ON DELETE CASCADE,

    CHECK (gradoAcademico IN ('Maestria', 'Doctorado'))
);

CREATE TABLE Vehiculo(
    idVehiculo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    estado VARCHAR(15) NOT NULL,
    marca VARCHAR(40) NOT NULL,
    color VARCHAR(20) NOT NULL,
    

    tipo VARCHAR(10) NOT NULL,

    --Atributos para Bicicleta
    kilometraje INTEGER,
    capacidad_Bateria INTEGER,

    --Atributos para scooter--
    carga INTEGER,

    CHECK (estado IN ('Libre', 'En uso', 'Fuera de servicio', 'Mantenimiento')),
    CHECK (tipo IN ('Bicicleta', 'Scooter'))
);

CREATE TABLE PRESTAMO(
    idPrestamo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha_hora_salida TIMESTAMP NOT NULL,
    fecha_hora_devolucion TIMESTAMP ,
    estatus VARCHAR(15) NOT NULL,

    correoUsuario VARCHAR(50) NOT NULL,
    idVehiculo INTEGER NOT NULL,

    FOREIGN KEY (correoUsuario) REFERENCES Usuario(correo),
    FOREIGN KEY (idVehiculo) REFERENCES Vehiculo(idVehiculo),

    CHECK (estatus IN ('Pagado', 'En espera', 'En viaje'))
);
--S E M I L L A S--

-- 1. Usuarios Base
INSERT INTO Usuario (correo, nombre) VALUES 
('s24003973@estudiantes.uv.mx', 'Carlos Jesús Méndez Coria'),
('carlos.front@estudiantes.uv.mx', 'Compañero Frontend'),
('dr.brown@uv.mx', 'Emmett Brown');

-- 2. Alumnos (Heredan de Usuario)
INSERT INTO Alumno (correo, carrera, semestre, promedio, matricula) VALUES 
('s24003973@estudiantes.uv.mx', 'ISW', 3, 9.5, 's24003973'),
('carlos.front@estudiantes.uv.mx', 'ISW', 3, 8.8, 's24003974');

-- 3. Maestros (Heredan de Usuario)
INSERT INTO Maestro (correo, gradoAcademico, cubiculo, Departamento, matricula) VALUES 
('dr.brown@uv.mx', 'Doctorado', 'C-101', 'Sistemas', 'm0012345');

-- 4. Vehículos
INSERT INTO Vehiculo (estado, marca, color, tipo, kilometraje, capacidad_Bateria, carga) VALUES 
('Libre', 'Xiaomi', 'Negro', 'Scooter', NULL, NULL, 100),
('En uso', 'Segway', 'Blanco', 'Scooter', NULL, NULL, 45),
('Libre', 'Benotto', 'Azul', 'Bicicleta', 120, 0, NULL),
('Mantenimiento', 'Benotto', 'Rojo', 'Bicicleta', 350, 0, NULL);

-- 5. Préstamos (Ejemplo de un viaje activo y uno terminado)
INSERT INTO PRESTAMO (fecha_hora_salida, fecha_hora_devolucion, estatus, correoUsuario, idVehiculo) VALUES 
(CURRENT_TIMESTAMP - 2 HOURS, CURRENT_TIMESTAMP - 1 HOUR, 'Pagado', 's24003973@estudiantes.uv.mx', 1),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + 1 HOUR, 'En viaje', 'carlos.front@estudiantes.uv.mx', 2);