require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/corregir", async (req, res) => {
  try {
    const texto = req.body.texto;

    if (!texto || texto.trim() === "") {
      return res.status(400).json({
        error: "No se recibió ningún texto.",
      });
    }

    const respuesta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Sos un corrector de mensajes de WhatsApp para un delegado gremial. Corregís ortografía, tildes, puntuación y redacción. Mantenés un tono claro, cercano y firme. No agregás información nueva. Devolvés solo el mensaje corregido.",
        },
        {
          role: "user",
          content: texto,
        },
      ],
      temperature: 0.3,
    });

    const corregido = respuesta.choices[0].message.content.trim();

    res.json({ corregido });
  } catch (error) {
    console.error("Error OpenAI:", error);
    res.status(500).json({
      error: "No se pudo corregir el mensaje.",
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});