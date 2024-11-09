import express from 'express';
import {insertMulta, getMultas, getMultasByDni,getAnalisisMulta} from '../controller/multasController.js'

const router = express.Router();

router.post('/new', insertMulta)

router.get('/get', getMultas)

router.get('/get/:dni', getMultasByDni);

router.get('/analisis', getAnalisisMulta)

export default router;