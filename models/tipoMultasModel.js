import mongoose from 'mongoose';

const tipoMultaSchema = new mongoose.Schema({
    alerta: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const TipoMulta = mongoose.model('TipoMulta', tipoMultaSchema);

export default TipoMulta;
