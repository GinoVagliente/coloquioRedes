import express from 'express';
import { insertTipoMulta, getTipoMulta } from '../controller/tipoMultasController.js'

const router = express.Router();

router.post('/new', insertTipoMulta)

router.get('/get', getTipoMulta)

export default router;