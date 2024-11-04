import connectDB from './database/db.js';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import userRoutes from './routes/userRoutes.js';
import tipoMultasRoutes from './routes/tipoMultaRoutes.js';
import multasRoutes from './routes/multasRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT1 = process.env.PORT1 || 4000;

connectDB();

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
        req.user = decoded;
        next();
    });
};

const generateToken = (user) => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};

const user = { id: 1, username: 'test' };
const token = generateToken(user);
console.log(`Token generado: ${token}`);

app.use('/user', verifyToken, userRoutes);
app.use('/tipoMulta', verifyToken, tipoMultasRoutes);
app.use('/multa', verifyToken, multasRoutes);

app.listen(PORT1, () => {
    console.log(`Servidor corriendo en el puerto ${PORT1}`);
});
