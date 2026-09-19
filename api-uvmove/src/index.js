import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import ibmdb from 'ibm_db';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3000;
const connStr = `DATABASE=${process.env.DB_DATABASE};HOSTNAME=${process.env.DB_HOST};PORT=${process.env.DB_PORT};PROTOCOL=TCPIP;UID=${process.env.DB_USER};PWD=${process.env.DB_PASSWORD};`;
app.use(cors());
app.use(express.json());

const verificarToken = (req, res, next) => {

    const autHeader = req.headers.authorization;

    if(!autHeader || !autHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Acceso denegado. No se envió el token de autorización'});
    }
    const token = autHeader.split(' ')[1];

    try{
        const payload = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

        req.usuarioAutenticado = payload;

        next();
    } catch(error) {
        return res.status(403).json({error: 'Token invalido o expirado'});
    }
};



app.get('/api/status', (req, res) => {
    res.json({
        sistema: 'UV Move API',
        estado: 'en linea',
        version: '1.0.0'
    });
});

app.listen(PORT, () => {
    console.log(`servidor de UvMove corriendo en http://localhost:${PORT}`);
});

//endpoint para validar si un usuario tiene viajes activos
app.get('/api/Usuarios/:correo/viaje-activo', async (req, res) => {
    const correo = req.params.correo;

    const query = `
    SELECT idPrestamo, fecha_hora_salida, idVehiculo, estatus
    FROM Prestamo
    WHERE correoUsuario = ? AND estatus = 'En viaje'
    `;
    
    try {
        const conn = await ibmdb.open(connStr);
        const data = await conn.query(query, [correo]);

        await conn.close();

        if(data.length > 0) {
            res.json({tieneViaje: true, viaje: data[0]});
        } else {
            res.json({tieneViaje: false, mensaje: 'No hay viajes activos.'});
        }

    }catch(error) {
    console.error("Error en la BD", error);
    res.status(500).json({error: 'error interno del servidor'});
    }

});

//endpoint para crear un prestamo
app.post('/api/prestamos', verificarToken, async (req, res) => {
    const{correo, idVehiculo, hora_salida} = req.body;

    const queryValidacion = `
    SELECT idPrestamo, fecha_hora_salida, idVehiculo, estatus
    FROM Prestamo
    WHERE correoUsuario = ? AND estatus = 'En viaje'
    `;

    const queryInsercion = `INSERT INTO PRESTAMO(fecha_hora_salida, estatus, correoUsuario, idVehiculo) VALUES
    (?, 'En espera', ?, ?)
    `;

    try {
    const conn = await ibmdb.open(connStr);
    const validacion = await conn.query(queryValidacion, [correo]);
    
    if(validacion.length>0) {
        await conn.close();
        res.status(400).json({error: 'el usuario ya tiene un viaje activo', viaje: validacion[0]});
    } else {
        await conn.query(queryInsercion, [hora_salida, correo, idVehiculo ]);
        await conn.close();
        res.json({mensaje: `Viaje asignado con éxito para las ${hora_salida} hrs`});
    }
    } catch(error) {
        console.error("Error en la BD", error);
        res.status(500).json({error: 'error interno del servidor'});
    }
});

//endpoint para finalizar viaje
app.post('/api/prestamos/finalizar', verificarToken, async (req, res) => {
    const {correo, hora_llegada} = req.body;

    const actualizacion = `
        UPDATE Prestamo
        SET Fecha_Hora_Devolucion =  ?, estatus = 'Pagado'
        WHERE correoUsuario = ? AND estatus = 'En viaje'
    `;

    const selecccion = `
    SELECT idPrestamo, Fecha_hora_salida, Fecha_Hora_devolucion, Estatus from Prestamo
    WHERE correoUsuario = ?
    ORDER BY fecha_hora_devolucion DESC
    FETCH FIRST 1 ROW ONLY
    `;

    try {
        const conn = await ibmdb.open(connStr);
        await conn.query(actualizacion, [hora_llegada, correo]);
        const ejecucionSeleccion = await conn.query(selecccion, [correo]);
        await conn.close();
        
        if(ejecucionSeleccion.length > 0) {
            const resultado = ejecucionSeleccion[0];
            res.json({resultado});
        } else {
            res.status(404).json({error : 'No se encontro un viaje activo para finalizar'});
        }
    } catch(error) {
        console.error('error en la BD', error);
        res.status(500).json({error: 'error interno del servidor'});
    }
});

//endpoint que registra un usuario en la base de datos
app.post('/api/usuarios/sync', verificarToken, async (req, res) => {
    const {correoUsuario, nombre} = req.body;

    const queryBusqueda = `
    SELECT correo from Usuario 
    WHERE correo = ? 
    `;

    const queryInsercion = `
    INSERT INTO Usuario(correo, nombre) VALUES
    (?, ?)
    `;

    try {
        const conn = await ibmdb.open(connStr);
        const resultado = await conn.query(queryBusqueda, [correoUsuario]);

        if(resultado.length === 0) {
            await conn.query(queryInsercion, [correoUsuario, nombre]);
            console.log('Usuario almacenado con éxito');
            await conn.close();
            res.json({mensaje: 'usuario almacenado con éxito'});
            
        } else {
            console.log('El usuario ya existe en la BD');
            res.json({mensaje: 'el usuario ya existe en la BD'});   
            await conn.close();
        }
        
    } catch(error) {
        console.error(error, 'Ocurrio un error en la BD');
        res.status(500).json({mensaje: 'ocurrio un error inesperado'});
    }
});