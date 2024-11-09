
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Usuario hardcodeado
const user = { id: 1, username: 'test', password: 'password123' };

// Variable para el secreto JWT
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validar las credenciales (sin base de datos)
    if (username === user.username && password === user.password) {
        // Generar el token JWT
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        // Enviar el token al cliente
        return res.json({ token });
    }

    // Si las credenciales no coinciden
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
});

export default router;
