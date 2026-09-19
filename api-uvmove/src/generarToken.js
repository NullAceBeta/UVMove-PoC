import 'dotenv/config';
import jwt from 'jsonwebtoken';

const token = jwt.sign(
    { correoUsuario: 's24003973@estudiantes.uv.mx' }, 
    process.env.SUPABASE_JWT_SECRET
);

console.log("Copia este token para Thunder Client:\n");
console.log(token);