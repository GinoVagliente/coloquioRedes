import multasModel from '../models/multasModel.js';
import User from '../models/userModel.js';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const PORT1 = process.env.PORT1 || 4000;
const url = process.env.URL;


export const insertMulta = async (req, res) => {
    try {
        const { usuario, tipoMulta, descripcion, fechaMult } = req.body;

        const multaData = new multasModel({
            usuario,
            tipoMulta,
            descripcion,
            fechaMult: fechaMult || Date.now(),
        });

        await multaData.save();

        return res.status(201).json({ message: 'Multa creada exitosamente', multa: multaData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear la multa', error: error.message });
    }
};

export const getMultas = async (req, res) => {
    try {
        const multas = await multasModel.find()
            .populate('usuario', 'nombre apellido')
            .populate('tipoMulta', 'alerta');

        return res.status(200).json(multas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener las multas', error: error.message });
    }
};

export const getMultasByDni = async (req, res) => {
    const { dni } = req.params;

    try {
        const usuario = await User.findOne({ dni });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const multas = await multasModel.find({ usuario: usuario._id })
            .populate('usuario', 'nombre apellido')
            .populate('tipoMulta', 'alerta');

        return res.status(200).json(multas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener las multas', error: error.message });
    }
};

export const getAnalisisMulta = async (req, res) => {
    const { dni } = req.body;

    try {
        const response = await axios.get(`${url}multa/get/${dni}`, {
            headers: {
                Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`
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
        const razon = puedeRenovar ? '0' : '1';

        const prompt = `Dado que el usuario tiene ${altas} multas altas, ${medias} multas medias y ${bajas} multas bajas, ${razon} Las razones de las multas son: ${razones.join(', ')}. Haz un análisis del patrón de multas y dime qué tendencias tiene el conductor y si puede o no tener carnet de conducir. Si solo tiene multas de alerta baja puede recibirlo, si tiene más de 2 multas de nivel medio NO puede y si tiene 1 o más multas graves NO puede.`;

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
};

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