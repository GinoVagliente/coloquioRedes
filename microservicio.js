import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT2 = process.env.PORT2;
const PORT1 = process.env.PORT1;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.get('/api/multas/:dni', async (req, res) => {
    const { dni } = req.params;

    try {
        const response = await axios.get(`http://localhost:${PORT1}/multa/get/${dni}`, {
            headers: {
                Authorization: `Bearer `
            }
        });

        const multas = response.data;

        if (multas.length === 0) {
            return res.json({ message: 'No se encontraron multas para este usuario. Puede obtener su carnet.' });
        }

        let altas = 0, medias = 0, bajas = 0, razones = [];

        multas.forEach(multa => {
            razones.push(multa.descripcion);
            switch (multa.tipoMulta.alerta) {
                case 'Alta':
                    altas++;
                    break;
                case 'Media':
                    medias++;
                    break;
                case 'Baja':
                    bajas++;
                    break;
            }
        });

        const puedeRenovar = evaluarRenovacion(altas, medias);
        const razon = puedeRenovar
            ? '0'
            : '1';

        const prompt = `Dado que el usuario tiene ${altas} multas altas, ${medias} multas medias y ${bajas} multas bajas, ${razon} Las razones de las multas son: ${razones.join(', ')}. Haz un análisis del patrón de multas y dime qué tendencias tiene el conductor y si puede o no tener carnet de conducir. 
        Si solo tiene multas de alerta baja puede recibirlo, si tiene más de 2 multas de nivel medio NO puede y si tiene 1 o más multas graves NO puede.`;

        const exp = await generarExplicacion(prompt);

        // Formatear la respuesta
        const responseBody = {
            estado: razon,
            analisis: {
                multas: {
                    alta: altas,
                    media: medias,
                    baja: bajas,
                },
                razones: razones,
            },
            explicacion: exp,
        };

        return res.json(responseBody);
    } catch (error) {
        console.error('Error al obtener las multas:', error);
        res.status(500).json({ message: 'Error al obtener las multas' });
    }
});

const evaluarRenovacion = (altas, medias) => {
    if (altas > 0) return false;
    if (medias > 2) return false;
    return true;
};

// Función para generar contenido explicativo
const generarExplicacion = async (prompt) => {
    const result = await model.generateContent(prompt);
    return result.response.text();
};

// Iniciar el servidor
app.listen(PORT2, () => {
    console.log(`Servidor corriendo en el puerto ${PORT2}`);
});
