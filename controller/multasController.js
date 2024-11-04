import multasModel from '../models/multasModel.js';
import User from '../models/userModel.js';

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