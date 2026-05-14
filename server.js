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
    const { mensaje } = req.body;

    if (!mensaje) {
      return res.status(400).json({
        error: "No se recibió ningún mensaje.",
      });
    }

    const completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `Corregí ortografía, puntuación, tildes, gramática y claridad del siguiente mensaje en español. 
No cambies el sentido, solo mejoralo para que quede prolijo, natural y bien escrito.
Mensaje: "${mensaje}"`,
    });

    const corregido = completion.output_text;

    res.json({
      corregido,
    });
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