require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post("/corregir", async (req, res) => {
  try {
    const texto = req.body.texto;

    if (!texto || texto.trim() === "") {
      return res.status(400).json({ error: "No hay texto para corregir." });
    }

    const respuesta = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sos un corrector de mensajes de WhatsApp para un delegado gremial. Corregís ortografía, tildes, puntuación y redacción. Mantenés un tono claro, cercano y firme. No agregás información nueva. Devolvés solo el mensaje corregido."
        },
        {
          role: "user",
          content: texto
        }
      ],
      temperature: 0.3
    });

    const corregido = respuesta.choices[0].message.content.trim();

    res.json({ corregido });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al corregir el mensaje." });
  }
});

app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});