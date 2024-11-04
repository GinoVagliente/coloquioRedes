import mongoose from 'mongoose';

const multaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    tipoMulta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoMulta',
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    fechaMult: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Multa = mongoose.model('Multa', multaSchema);

export default Multa;
