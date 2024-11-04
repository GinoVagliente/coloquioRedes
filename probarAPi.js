// Importa dotenv y GoogleGenerativeAI
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configura dotenv para cargar variables de entorno
dotenv.config();

// Crea una instancia de GoogleGenerativeAI con tu clave API
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const prompt = 'dilo nuevamente';

// Función asincrónica para generar contenido
async function generateContent() {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
}

// Llama a la función
generateContent();
