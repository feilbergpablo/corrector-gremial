const corregirBtn = document.getElementById("corregirBtn");
const copiarBtn = document.getElementById("copiarBtn");
const borrarBtn = document.getElementById("borrarBtn");
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

corregirBtn.addEventListener("click", async () => {
  const texto = inputText.value.trim();

  if (texto === "") {
    alert("Escribí un mensaje primero.");
    return;
  }

  outputText.value = "Corrigiendo...";

  try {
    const respuesta = await fetch("http://localhost:3000/corregir", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ texto: texto }),
    });

    const data = await respuesta.json();

    if (data.corregido) {
      outputText.value = data.corregido;
    } else {
      outputText.value = "No se pudo corregir el mensaje.";
    }
  } catch (error) {
    outputText.value = "Error: no se pudo conectar con el servidor.";
  }
});

copiarBtn.addEventListener("click", () => {
  outputText.select();
  document.execCommand("copy");
  alert("Mensaje copiado");
});

borrarBtn.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
  inputText.focus();
});