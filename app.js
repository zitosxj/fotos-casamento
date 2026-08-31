const CONFIG = {
  // Cole aqui o URL da Web App do Google Apps Script.
  API_URL: "https://script.google.com/macros/s/AKfycbzc9EsYuQ0MQF6GoR6iGAJwVDH7XdJQAyVsKawOuoXiyzo1_CDDecAg5PtLGY-ey2ie/exec"
};

const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const nameInput = document.getElementById("nameInput");
const statusEl = document.getElementById("status");

let selectedFiles = [];

fileInput.addEventListener("change", () => {
  selectedFiles = Array.from(fileInput.files || []).filter(f => f.type.startsWith("image/"));
  renderPreview();
});

function renderPreview() {
  preview.innerHTML = "";
  preview.classList.toggle("hidden", selectedFiles.length === 0);
  selectedFiles.forEach(file => {
    const img = document.createElement("img");
    img.className = "thumb";
    img.alt = "";
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);
  });
  uploadBtn.disabled = selectedFiles.length === 0 || !CONFIG.API_URL.startsWith("http");
  statusEl.textContent = selectedFiles.length
    ? `${selectedFiles.length} fotografia(s) selecionada(s).`
    : "";
  statusEl.className = "status";
}

uploadBtn.addEventListener("click", async () => {
  if (!selectedFiles.length) return;
  uploadBtn.disabled = true;
  statusEl.textContent = "A preparar as fotografias…";
  statusEl.className = "status";

  try {
    let done = 0;
    for (const file of selectedFiles) {
      const compressed = await resizeImage(file, 2200, 0.88);
      const base64 = await fileToBase64(compressed);
      const payload = {
        filename: file.name,
        mimeType: compressed.type || "image/jpeg",
        data: base64,
        participant: nameInput.value.trim()
      };

      await fetch(CONFIG.API_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload)
      });
      done++;
      statusEl.textContent = `A enviar… ${done}/${selectedFiles.length}`;
    }

    selectedFiles = [];
    fileInput.value = "";
    preview.innerHTML = "";
    preview.classList.add("hidden");
    uploadBtn.disabled = true;
    statusEl.textContent = "✅ Fotografias enviadas. Obrigado!";
    statusEl.className = "status success";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Não foi possível concluir o envio. Tenta novamente.";
    statusEl.className = "status error";
    uploadBtn.disabled = false;
  }
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImage(file, maxDimension, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (!blob) return reject(new Error("Compression failed"));
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {type:"image/jpeg"}));
      }, "image/jpeg", quality);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(console.error));
}