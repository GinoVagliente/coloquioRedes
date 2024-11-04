import express from 'express';
import { insertUser, getUser,getUserByDni } from '../controller/userController.js';

const router = express.Router();

router.post('/new', insertUser);

router.get('/get', getUser);

router.get('/get/:dni', getUserByDni);

export default router;
