import TipoMultasModel from '../models/TipoMultasModel.js'


export const insertTipoMulta = async (req, res) => {

    try {
        const { alerta } = req.body;

        const tipoMultaData = new TipoMultasModel({
            alerta
        })
        await tipoMultaData.save();


        return res.status(201).json({ message: 'Tipo de Multa creado exitosamente', tipo: tipoMultaData });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear el Tipo de Multa', error: error.message });
    }

}

export const getTipoMulta = async (req, res) => {
    try {
        const data = await TipoMultasModel.find();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener los tipos de multa', error);
        return res.status(500).json({ message: 'Error al obtener los tipos de multa' });
    }
}