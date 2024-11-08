import connectDB from './database/db.js';
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crearJWT from './crearJWT.js'; // Importa las rutas de autenticación
import userRoutes from './routes/userRoutes.js';  // Otras rutas protegidas
import tipoMultasRoutes from './routes/tipoMultaRoutes.js'; 
import multasRoutes from './routes/multasRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();
const PORT1 = process.env.PORT1 || 4000;

const JWT_SECRET = process.env.JWT_SECRET;

// Verificar el token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        req.user = decoded;  // Decodificar el usuario del JWT
        next();
    });
};

// Rutas
app.use('/auth', crearJWT);  // Ruta de login
app.use('/user', verifyToken, userRoutes);  // Ruta protegida
app.use('/tipoMulta', verifyToken, tipoMultasRoutes);  // Ruta protegida
app.use('/multa', verifyToken, multasRoutes);  // Ruta protegida

app.listen(PORT1, () => {
    console.log(`Servidor corriendo en el puerto ${PORT1}`);
});
