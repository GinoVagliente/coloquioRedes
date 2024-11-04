import userModel from '../models/userModel.js'

export const insertUser = async (req, res) => {
    try {
        const { nombre, apellido, dni, telefono, domicilio } = req.body;

        const userData = new userModel({
            nombre,
            apellido,
            dni,
            telefono,
            domicilio,
        });

        await userData.save();

        return res.status(201).json({ message: 'Usuario creado exitosamente', user: userData });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
};


export const getUser = async (req, res) => {
    try {
        const data = await userModel.find();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener los datos de los Usuarios:', error);
        return res.status(500).json({ message: 'Error al obtener los datos de los Usuarios' });
    }
};

export const getUserByDni = async (req, res) => {
    const { dni } = req.params; // Obtener el DNI de los parámetros de la URL

    try {
        const user = await userModel.findOne({ dni });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el usuario por DNI:', error);
        return res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
};