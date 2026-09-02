// ==========================================
// 💒 CASAMENTO DA OLÍVIA & LUIS
// APP V8
// ==========================================


// 🔗 URL DO GOOGLE APPS SCRIPT

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzc9EsYuQ0MQF6GoR6iGAJwVDH7XdJQAyVsKawOuoXiyzo1_CDDecAg5PtLGY-ey2ie/exec";


// 🔐 Apenas usado como verificação visual.
//
// A segurança REAL também está no Apps Script.

const EVENT_CODE = "OLIVIA2026";

// ==========================================
// 🎥 TAMANHO MÁXIMO DOS VÍDEOS
// ==========================================
const MAX_VIDEO_SIZE =
  30 * 1024 * 1024;
// ==========================================
// ELEMENTOS
// ==========================================

const loginScreen =
  document.getElementById("loginScreen");

const appScreen =
  document.getElementById("appScreen");

const eventCode =
  document.getElementById("eventCode");

const enterButton =
  document.getElementById("enterButton");

const loginError =
  document.getElementById("loginError");


const uploadTab =
  document.getElementById("uploadTab");

const galleryTab =
  document.getElementById("galleryTab");

const uploadSection =
  document.getElementById("uploadSection");

const gallerySection =
  document.getElementById("gallerySection");


const participantName =
  document.getElementById("participantName");

const photoInput =
  document.getElementById("photoInput");

const selectedInfo =
  document.getElementById("selectedInfo");

const previewGrid =
  document.getElementById("previewGrid");

const uploadButton =
  document.getElementById("uploadButton");

const uploadStatus =
  document.getElementById("uploadStatus");


const galleryGrid =
  document.getElementById("galleryGrid");

const galleryLoading =
  document.getElementById("galleryLoading");

const galleryError =
  document.getElementById("galleryError");

const photoCount =
  document.getElementById("photoCount");


const refreshGallery =
  document.getElementById("refreshGallery");

const refreshGalleryMenu =
  document.getElementById("refreshGalleryMenu");

// ==========================================
// FILTRO POR PASTA
// ==========================================
const folderFilter =
  document.getElementById("folderFilter");

const clearFolderFilter =
  document.getElementById("clearFolderFilter");

const showAllPhotos =
  document.getElementById("showAllPhotos");
// ==========================================
const lightbox =
  document.getElementById("lightbox");

const lightboxImage =
  document.getElementById("lightboxImage");

const lightboxVideo =
  document.getElementById("lightboxVideo");

const lightboxVideoFrame =
  document.getElementById("lightboxVideoFrame");

const lightboxCounter =
  document.getElementById("lightboxCounter");

const closeLightbox =
  document.getElementById("closeLightbox");

const previousPhoto =
  document.getElementById("previousPhoto");

const nextPhoto =
  document.getElementById("nextPhoto");


const menuButton =
  document.getElementById("menuButton");

const closeMenu =
  document.getElementById("closeMenu");

const sideMenu =
  document.getElementById("sideMenu");

const menuOverlay =
  document.getElementById("menuOverlay");

const changeCodeButton =
  document.getElementById("changeCodeButton");

// ==========================================
// 📤 ELEMENTOS DE PROGRESSO
// ==========================================

const uploadProgress =
  document.getElementById("uploadProgress");

const uploadProgressText =
  document.getElementById("uploadProgressText");

const uploadProgressBar =
  document.getElementById("uploadProgressBar");

const uploadProgressPercent =
  document.getElementById("uploadProgressPercent");

const uploadProgressList =
  document.getElementById("uploadProgressList");

// ==========================================
// ESTADO
// ==========================================

let selectedFiles = [];
let galleryPhotos = [];
let filteredGalleryPhotos = [];
let currentPhotoIndex = 0;

// ==========================================
// CACHE DA GALERIA
// ==========================================

const GALLERY_CACHE_KEY = "weddingGalleryCache";
const GALLERY_CACHE_TIME = "weddingGalleryCacheTime";

// ==========================================
// LOGIN
// ==========================================

function enterApp() {

  const code =
    eventCode.value.trim().toUpperCase();


  if (code !== EVENT_CODE) {

    loginError.textContent =
      "O código não está correto.";

    return;

  }
  
const accessUntil = Date.now() + (24 * 60 * 60 * 1000);

localStorage.setItem(
  "weddingAccessUntil",
  accessUntil.toString()
);

  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  openUpload();
}


// ENTER NO TECLADO

eventCode.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {
      enterApp();
    }

  }
);


enterButton.addEventListener(
  "click",
  enterApp
);


// ==========================================
// MANTER SESSÃO
// ==========================================

const accessUntil = Number(
  localStorage.getItem("weddingAccessUntil")
);

if (accessUntil && Date.now() < accessUntil) {
  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");

} else {
  localStorage.removeItem("weddingAccessUntil");
}


// ==========================================
// TABS
// ==========================================

function openUpload() {

  uploadTab.classList.add("active");

  galleryTab.classList.remove("active");

  uploadSection.classList.remove("hidden");

  gallerySection.classList.add("hidden");

}


function openGallery() {

  galleryTab.classList.add("active");

  uploadTab.classList.remove("active");

  gallerySection.classList.remove("hidden");

  uploadSection.classList.add("hidden");

  loadGallery();

}


uploadTab.addEventListener(
  "click",
  openUpload
);


galleryTab.addEventListener(
  "click",
  openGallery
);


// ==========================================
// SELECIONAR FOTOS E VÍDEOS
// ==========================================

photoInput.addEventListener(
  "change",
  () => {
    selectedFiles =
      Array.from(photoInput.files);
    previewGrid.innerHTML = "";

    if (!selectedFiles.length) {
      selectedInfo.textContent = "";
      return;
    }

    const totalPhotos =
      selectedFiles.filter(
        file => file.type.startsWith("image/")
      ).length;

    const totalVideos =
      selectedFiles.filter(
        file => file.type.startsWith("video/")
      ).length;

    const parts = [];

    if (totalPhotos) {
      parts.push(
        `${totalPhotos} foto${totalPhotos !== 1 ? "s" : ""}`
      );
    }

    if (totalVideos) {
      parts.push(
        `${totalVideos} vídeo${totalVideos !== 1 ? "s" : ""}`
      );
    }

    selectedInfo.textContent =
      `Selecionaste ${parts.join(" e ")} 💗`;

    selectedFiles.forEach(
      file => {

        const previewItem =
          document.createElement("div");

        previewItem.className =
          "preview-item";

        const objectUrl =
          URL.createObjectURL(file);

        // ==============================
        // 📸 FOTOGRAFIA
        // ==============================

        if (file.type.startsWith("image/")) {
          const image =
            document.createElement("img");
          image.src =
            objectUrl;
          image.alt =
            file.name;
          previewItem.appendChild(image);
        }

        // ==============================
        // 🎥 VÍDEO
        // ==============================

        else if (file.type.startsWith("video/")) {
          const video =
            document.createElement("video");
          video.src =
            objectUrl;
          video.muted =
            true;
          video.playsInline =
            true;
          video.preload =
            "metadata";
          previewItem.appendChild(video);

          const badge =
            document.createElement("div");
          badge.className =
            "video-badge";
          badge.textContent =
            "▶";
          previewItem.appendChild(badge);
        }

        previewGrid.appendChild(
          previewItem
        );
      }
    );
  }
);

// ==========================================
// 📸 OTIMIZAR FOTO — MÁXIMA QUALIDADE
// ==========================================

async function compressImage(file) {
  // Fotos até 8 MB seguem no formato original
  const MAX_ORIGINAL_BYTES =
    8 * 1024 * 1024;

  if (file.size <= MAX_ORIGINAL_BYTES) {
    return file;
  }

  // Fotos maiores são otimizadas
  const image =
    await createImageBitmap(file);

  const maxSize = 4000;

  let width = image.width;
  let height = image.height;

  if (width > height && width > maxSize) {
    height =
      Math.round(
        height * maxSize / width
      );
    width = maxSize;
  }

  if (height > width && height > maxSize) {
    width =
      Math.round(
        width * maxSize / height
      );
    height = maxSize;
  }

  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context =
    canvas.getContext(
      "2d",
      { alpha: false }
    );

  context.drawImage(
    image,
    0,
    0,
    width,
    height
  );

  const blob =
    await new Promise(
      (resolve, reject) => {
        canvas.toBlob(
          blob => {
            if (blob) {
              resolve(blob);
            } else {
              reject(
                new Error(
                  "Não foi possível processar esta fotografia."
                )
              );
            }
          },
          "image/jpeg",
          0.95
        );

      }
    );

  image.close();

  return blob;
}

// ==========================================
// BLOB → BASE64
// ==========================================

function blobToBase64(blob) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload =
        () => {
          const result =
            String(reader.result);

          resolve(
            result.split(",")[1]
          );
        };

      reader.onerror = reject;

      reader.readAsDataURL(blob);
    }
  );
}

// ==========================================
// 🔎 CONSULTAR RESULTADO DO UPLOAD
// ==========================================

function checkUploadStatus(uploadId) {

  return new Promise(
    (resolve) => {

      const callbackName =
        "uploadStatus_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .slice(2);

      const script =
        document.createElement("script");

      let finished = false;


      function finish(result) {

        if (finished) return;

        finished = true;

        if (script.parentNode) {
          script.remove();
        }

        delete window[callbackName];

        resolve(result);
      }

      window[callbackName] =
        function (response) {
          finish(response);
        };

      script.onerror =
        function () {
          finish({
            ok: false,
            status: "connection-error",
            error:
              "Não foi possível confirmar o envio."
          });
        };

      const url =
        `${SCRIPT_URL}` +
        `?action=uploadStatus` +
        `&code=${encodeURIComponent(EVENT_CODE)}` +
        `&uploadId=${encodeURIComponent(uploadId)}` +
        `&callback=${callbackName}` +
        `&_=${Date.now()}`;

      script.src = url;

      document.body.appendChild(script);

      // Segurança: não ficar eternamente à espera
      setTimeout(
        () => {
          finish({
            ok: false,
            status: "timeout",
            error:
              "O servidor demorou demasiado tempo a responder."
          });
        },
        15000
      );
    }
  );
}

// ==========================================
// 💬 TRADUZIR ERROS PARA O UTILIZADOR
// ==========================================

function getFriendlyUploadError(error) {

  const message =
    String(
      error?.message ||
      error ||
      ""
    );


  if (
    message.toLowerCase().includes("network")
  ) {

    return (
      "Problema de ligação à internet."
    );

  }

  if (
    message.toLowerCase().includes("too large") ||
    message.toLowerCase().includes("grande")
  ) {

    return (
      "A fotografia é demasiado grande."
    );
  }

  if (
    message.toLowerCase().includes("timeout")
  ) {
    return (
      "O envio demorou demasiado tempo."
    );
  }

  return (
    "Ocorreu um problema durante o envio."
  );
}

// ==========================================
// 📊 INICIAR PROGRESSO
// ==========================================

function startUploadProgress(files) {

  uploadProgress.classList.remove("hidden");

uploadProgressText.textContent =
  `A preparar ${files.length} ficheiro(s)...`;

  uploadProgressBar.style.width = "0%";

  uploadProgressPercent.textContent = "0%";

  uploadProgressList.innerHTML = "";


  files.forEach((file, index) => {

    const item =
      document.createElement("div");

    item.className =
      "upload-progress-item waiting";

    item.id =
      `upload-item-${index}`;


    const icon =
      document.createElement("span");

    icon.className =
      "upload-progress-icon";

    icon.textContent = "⬜";


    const name =
      document.createElement("span");

    name.className =
      "upload-progress-name";

    name.textContent =
      file.name;


    const status =
      document.createElement("span");

    status.className =
      "upload-progress-status";

    status.textContent =
      "A aguardar";


    item.appendChild(icon);
    item.appendChild(name);
    item.appendChild(status);

    uploadProgressList.appendChild(item);

  });

}


// ==========================================
// 📊 ATUALIZAR UMA FOTO
// ==========================================

function updateUploadItem(
  index,
  state,
  message
) {

  const item =
    document.getElementById(
      `upload-item-${index}`
    );


  if (!item) return;


  item.className =
    `upload-progress-item ${state}`;


  const icon =
    item.querySelector(
      ".upload-progress-icon"
    );


  const status =
    item.querySelector(
      ".upload-progress-status"
    );


  const icons = {

    waiting: "⬜",
    preparing: "⚙️",
    uploading: "📤",
    checking: "🔎",
    success: "✅",
    error: "❌"

  };


  icon.textContent =
    icons[state] || "⬜";


  status.textContent =
    message;

}


// ==========================================
// 📊 ATUALIZAR BARRA
// ==========================================

function updateUploadProgress(
  completed,
  total
) {
  const percent =
    total
      ? Math.round(
          (completed / total) * 100
        )
      : 0;

  uploadProgressBar.style.width =
    `${percent}%`;

  uploadProgressPercent.textContent =
    `${percent}%`;

uploadProgressText.textContent =
  `${completed} de ${total} ficheiro(s) processado(s)`;
}

// ==========================================
// 📤 ENVIAR FOTOS COM PROGRESSO
// ==========================================

uploadButton.addEventListener(
  "click",
  async () => {

    if (!selectedFiles.length) {
uploadStatus.textContent = "Escolhe pelo menos uma fotografia ou vídeo 📸🎥";
      return;
    }

    // Bloquear botão durante o envio
    uploadButton.disabled = true;

    // Limpar mensagem anterior
    uploadStatus.textContent = "";

    // Criar lista de progresso
    startUploadProgress(selectedFiles);

    let sent = 0;
    let failed = 0;

    const failedFiles = [];

    // ======================================
    // ENVIAR UMA FOTO DE CADA VEZ
    // ======================================

    for (
      let index = 0;
      index < selectedFiles.length;
      index++
    ) {

      const file = selectedFiles[index];


      try {

        // ======================================
        // 🎥 VERIFICAR TAMANHO DO VÍDEO
        // ======================================
        
        if (file.type.startsWith("video/") && file.size > MAX_VIDEO_SIZE)
        {
          throw new Error("O vídeo é demasiado grande. O máximo permitido é 30 MB.");    
        }
        
        // -------------------------------
        // PREPARAR
        // -------------------------------
        updateUploadItem(
          index,
          "preparing",
          "A preparar..."
        );

      let processedFile;
      
      // ======================================
      // 📸 FOTOGRAFIA
      // ======================================
      
      if (file.type.startsWith("image/")) {      
        processedFile =
          await compressImage(file);      
      }
            
      // ======================================
      // 🎥 VÍDEO
      // ======================================
      
      else if (file.type.startsWith("video/")) {
        // Não alterar nem comprimir o vídeo
        processedFile = file;
      }      
      
      // ======================================
      // ❌ TIPO NÃO SUPORTADO
      // ======================================
      
      else {      
        throw new Error(
          "Este tipo de ficheiro não é suportado."
        );      
      }

        // -------------------------------
        // CONVERTER
        // -------------------------------

        const base64 =
          await blobToBase64(processedFile);


        // -------------------------------
        // ENVIAR
        // -------------------------------

        updateUploadItem(
          index,
          "uploading",
          "A enviar..."
        );

        const uploadId = crypto.randomUUID();

        const payload = {
          code: EVENT_CODE,
          uploadId: uploadId,
          participant: participantName.value.trim(),
          filename: file.name,

          mimeType:
            processedFile.type ||
            file.type ||
            "application/octet-stream",

          data: base64

        };

        await fetch(
          SCRIPT_URL,
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },
            body:
              JSON.stringify(payload)
          }
        );

        // -------------------------------
        // CONFIRMAR ENVIO
        // -------------------------------
        
        updateUploadItem(
          index,
          "checking",
          "A confirmar..."
        );
        
        
let result;
let attempts = 0;
const maxAttempts = 20;

do {
  result =
    await checkUploadStatus(uploadId);

  // Se ainda estiver a processar,
  // esperar e tentar novamente
  if (
    result.status === "processing"
  ) {
    await new Promise(
      resolve =>
        setTimeout(resolve, 1000)
    );
    attempts++;
  }

} while (
  result.status === "processing" &&
  attempts < maxAttempts
);

// Se deu erro
if (!result.ok) {
  throw new Error(
    result.error ||
    "O servidor não confirmou o envio."
  );
}
        
        
        // -------------------------------
        // SUCESSO
        // -------------------------------
        
        sent++;
        
        
        const typeLabel =
          file.type.startsWith("video/")
            ? "Vídeo enviado"
            : "Fotografia enviada";
        
        
        updateUploadItem(
          index,
          "success",
          typeLabel
        );
      } catch (error) {

        console.error(
          "Erro ao enviar:",
          file.name,
          error
        );

        failed++;

        updateUploadItem(
          index,
          "error",
          "Não foi possível enviar"
        );

        failedFiles.push({
          index: index,
          name: file.name,
          error: error
        });
      }

      // Atualizar barra depois de cada foto

      updateUploadProgress(
        index + 1,
        selectedFiles.length
      );

    }


    // ======================================
    // RESULTADO FINAL
    // ======================================

    if (failed === 0) {

    const sentPhotos =
      selectedFiles.filter(
        file =>
          file.type.startsWith("image/")
      ).length;
    
    const sentVideos =
      selectedFiles.filter(
        file =>
          file.type.startsWith("video/")
      ).length;
    
    uploadStatus.innerHTML =
      `💗 <strong>Tudo pronto!</strong><br>` +
      `✅ ${sent} ficheiro(s) enviado(s) com sucesso! 📸🎥`;


      // Limpar seleção

      selectedFiles = [];

      photoInput.value = "";

      previewGrid.innerHTML = "";

      selectedInfo.textContent = "";


    } else {


      uploadStatus.innerHTML =
        `<strong>Resultado:</strong><br>` +
        `✅ ${sent} enviada(s)<br>` +
        `❌ ${failed} com problema`;


    }


    // Reativar botão

    uploadButton.disabled = false;


    // ======================================
    // ATUALIZAR GALERIA
    // ======================================

    if (sent > 0) {

      setTimeout(
        () => {

          if (
            !gallerySection.classList.contains("hidden")
          ) {

            loadGallery();

          }

        },
        3000
      );

    }

  }
);

// ==========================================
// CARREGAR GALERIA COM JSONP
// ==========================================

function loadGallery() {

  // ==========================================
  // DESATIVAR BOTÃO
  // ==========================================

  refreshGallery.disabled = true;

  refreshGallery.textContent = "⏳ A carregar...";


  // ==========================================
  // 1️⃣ MOSTRAR CACHE IMEDIATAMENTE
  // ==========================================

  const cachedGallery =
    localStorage.getItem(GALLERY_CACHE_KEY);


  if (cachedGallery) {

    try {

      const cachedPhotos =
        JSON.parse(cachedGallery);


      if (
        Array.isArray(cachedPhotos) &&
        cachedPhotos.length
      ) {

        galleryPhotos = cachedPhotos;

        photoCount.textContent =
          galleryPhotos.length;


        applyFolderFilter();


        // Não mostrar o ecrã de loading
        galleryLoading.classList.add("hidden");

      }

    } catch (error) {

      console.error(
        "Erro ao ler cache da galeria:",
        error
      );

    }

  } else {

    // Apenas mostra loading se ainda não houver fotos
    galleryLoading.classList.remove("hidden");

  }


  galleryError.textContent = "";


  // ==========================================
  // 2️⃣ PEDIR ATUALIZAÇÃO AO SERVIDOR
  // ==========================================

  const callbackName =
    "galleryCallback_" +
    Date.now();


  const script =
    document.createElement("script");


  window[callbackName] =
    function (response) {

      // Limpar script
      script.remove();

      delete window[callbackName];


      galleryLoading.classList.add("hidden");


      // Reativar botão
      refreshGallery.disabled = false;

      refreshGallery.textContent =
        "🔄 Atualizar";


      if (!response.ok) {

        galleryError.textContent =
          response.error ||
          "Não foi possível atualizar a galeria.";

        return;

      }


// ==========================================
// 3️⃣ SINCRONIZAR COM O SERVIDOR
// ==========================================

// O servidor contém sempre a lista verdadeira
// e atual das fotografias existentes.

const serverPhotos =
  response.photos || [];


// IDs existentes no servidor

const serverIds =
  new Set(
    serverPhotos.map(photo => photo.id)
  );


// ==========================================
// 🗑️ REMOVER FOTOS QUE JÁ NÃO EXISTEM
// ==========================================

const photosRemoved =
  galleryPhotos.filter(
    photo => !serverIds.has(photo.id)
  );


if (photosRemoved.length) {

  console.log(
    `${photosRemoved.length} fotografia(s) removida(s) da cache.`
  );

}


// ==========================================
// ➕ DETETAR FOTOS NOVAS
// ==========================================

const currentIds =
  new Set(
    galleryPhotos.map(photo => photo.id)
  );


const photosAdded =
  serverPhotos.filter(
    photo => !currentIds.has(photo.id)
  );


if (photosAdded.length) {

  console.log(
    `${photosAdded.length} fotografia(s) nova(s) encontrada(s).`
  );

}


// ==========================================
// 🔄 USAR A LISTA ATUAL DO SERVIDOR
// ==========================================

// Isto resolve também fotografias que foram
// movidas de uma pasta para outra.

galleryPhotos =
  serverPhotos;


// ==========================================
// 🖼️ ATUALIZAR GALERIA
// ==========================================

applyFolderFilter();


// Atualizar contador geral

photoCount.textContent =
  filteredGalleryPhotos.length;


      // ==========================================
      // 4️⃣ GUARDAR CACHE
      // ==========================================

      try {

        localStorage.setItem(
          GALLERY_CACHE_KEY,
          JSON.stringify(galleryPhotos)
        );


        localStorage.setItem(
          GALLERY_CACHE_TIME,
          Date.now().toString()
        );

      } catch (error) {

        console.warn(
          "Não foi possível guardar cache:",
          error
        );

      }

    };


  const url =
    `${SCRIPT_URL}` +
    `?action=gallery` +
    `&code=${encodeURIComponent(EVENT_CODE)}` +
    `&callback=${callbackName}` +
    `&_=${Date.now()}`;


  script.src = url;


  script.onerror =
    function () {
      galleryLoading.classList.add("hidden");

      refreshGallery.disabled = false;
      refreshGallery.textContent =
        "🔄 Atualizar";

      // Só mostra erro se não tivermos cache
      if (!galleryPhotos.length) {

        galleryError.textContent =
          "Não foi possível ligar à galeria.";
      }

      script.remove();
    };

  document.body.appendChild(script);

}

// ==========================================
// FILTRO DA GALERIA POR PASTA
// ==========================================

function applyFolderFilter() {

  const filter =
    String(folderFilter.value || "")
      .trim()
      .toLowerCase();


  // Sem filtro = todas as fotos
  if (!filter) {

    filteredGalleryPhotos =
      [...galleryPhotos];

  } else {

    filteredGalleryPhotos =
      galleryPhotos.filter(photo =>

        String(photo.folder || "")
          .toLowerCase()
          .includes(filter)

    );

  }


  // Atualizar contador
  photoCount.textContent =
    filteredGalleryPhotos.length;


  // Mostrar/esconder botão X
  clearFolderFilter.classList.toggle(
    "hidden",
    !filter
  );


  renderGallery();
}

// ==========================================
// LIMPAR FILTRO
// ==========================================

function clearFolderFilterFunction() {
  folderFilter.value = "";
  applyFolderFilter();
}

if (folderFilter) {
  folderFilter.addEventListener(
    "input",
    applyFolderFilter
  );
}

if (clearFolderFilter) {
  clearFolderFilter.addEventListener(
    "click",
    clearFolderFilterFunction
  );
}

if (showAllPhotos) {
  showAllPhotos.addEventListener(
    "click",
    clearFolderFilterFunction
  );
}


function escapeHtml_(text) {

  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

// ==========================================
// MOSTRAR GALERIA
// ==========================================

function renderGallery() {

  galleryGrid.innerHTML = "";


  // ==========================================
  // NENHUMA FOTO
  // ==========================================

  if (!filteredGalleryPhotos.length) {

    galleryGrid.innerHTML = `
      <div class="gallery-message">
        Nenhuma fotografia encontrada 📸
      </div>
    `;

    return;

  }


  // ==========================================
  // AGRUPAR FOTOS POR PASTA
  // ==========================================

  const folders = {};


  filteredGalleryPhotos.forEach(photo => {

    const folderName =
      photo.folder || "Sem pasta";


    if (!folders[folderName]) {
      folders[folderName] = [];
    }


    folders[folderName].push(photo);

  });


  // ==========================================
  // CRIAR CADA SECÇÃO
  // ==========================================

  Object.keys(folders)

    .sort((a, b) =>
      a.localeCompare(b, "pt")
    )

    .forEach(folderName => {


      // ======================================
      // SECÇÃO COMPLETA DA PASTA
      // ======================================

      const section =
        document.createElement("section");


      section.className =
        "gallery-folder-section";


      // ======================================
      // NOME DA PASTA
      // ======================================

      const divider =
        document.createElement("div");


      divider.className =
        "gallery-folder-divider";


      const icon =
        document.createElement("span");

      icon.className =
        "folder-icon";

      icon.textContent = "📁";


      const name =
        document.createElement("span");

      name.className =
        "folder-name";

      name.textContent =
        folderName;


      const count =
        document.createElement("span");

      count.className =
        "folder-count";

      count.textContent =
        folders[folderName].length;


      divider.appendChild(icon);
      divider.appendChild(name);
      divider.appendChild(count);


      section.appendChild(divider);


      // ======================================
      // GRELHA DAS FOTOS
      // ======================================

      const folderGrid =
        document.createElement("div");


      folderGrid.className =
        "gallery-folder-grid";


      folders[folderName].forEach(photo => {


        // Índice correto para o lightbox
        const realIndex =
          filteredGalleryPhotos.findIndex(
            p => p.id === photo.id
          );


const item =
  document.createElement("div");


item.className =
  "gallery-item";


// ==========================================
// 🎥 VÍDEO
// ==========================================

if (photo.type === "video") {

  const image =
    document.createElement("img");

  image.src =
    photo.thumbnail ||
    `https://drive.google.com/thumbnail?id=${photo.id}&sz=w600`;

  image.alt =
    photo.name || "Vídeo do casamento";

  image.loading = "lazy";

  image.decoding = "async";

  image.onerror = () => {

    console.warn(
      "Não foi possível carregar thumbnail:",
      photo.name
    );

  };

  item.appendChild(image);


  // ▶️ SÍMBOLO DE VÍDEO

  const badge =
    document.createElement("div");

  badge.className =
    "video-badge";

  badge.innerHTML =
    "▶";

  item.appendChild(badge);

}

// ==========================================
// 📸 FOTOGRAFIA
// ==========================================

else {
  const image =
    document.createElement("img");

  image.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  image.dataset.src =
    photo.thumbnail;

  image.alt =
    photo.name;


  image.loading = "lazy";

  image.decoding = "async";


  item.appendChild(image);

}

        item.addEventListener(
          "click",
          () => openLightbox(realIndex)
        );


        folderGrid.appendChild(item);

      });


      // Colocar a grelha imediatamente
      // abaixo do nome da pasta

      section.appendChild(folderGrid);


      // Colocar toda a secção na galeria

      galleryGrid.appendChild(section);

    });


  // ==========================================
  // LAZY LOAD
  // ==========================================

  lazyLoadGalleryImages();

}

// ==========================================
// LAZY LOAD DAS MINIATURAS
// ==========================================

function lazyLoadGalleryImages() {

  const images =
    document.querySelectorAll(
      ".gallery-item img[data-src]"
    );


  // Se o browser não suportar IntersectionObserver
  if (!("IntersectionObserver" in window)) {

    images.forEach(image => {

      image.src =
        image.dataset.src;

      image.removeAttribute("data-src");

    });

    return;

  }


  const observer =
    new IntersectionObserver(

      (entries) => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;


          const image =
            entry.target;


          image.src =
            image.dataset.src;


          image.removeAttribute("data-src");


          observer.unobserve(image);

        });

      },

      {

        // Começa a carregar um pouco antes
        // de a imagem aparecer no ecrã
        rootMargin: "300px"

      }

    );


  images.forEach(image =>
    observer.observe(image)
  );

}

// ==========================================
// 🎥 URL DE REPRODUÇÃO DO VÍDEO
// ==========================================

function getVideoUrl(photo) {

  return (
    `https://drive.google.com/uc?export=download&id=${photo.id}`
  );

}

// ==========================================
// 🖼️ LIGHTBOX
// ==========================================

function openLightbox(index) {
  currentPhotoIndex = index;
  lightbox.classList.remove("hidden");
  showCurrentPhoto();
}

// ==========================================
// MOSTRAR FOTO OU VÍDEO ATUAL
// ==========================================
function showCurrentPhoto() {

  const photo =
    filteredGalleryPhotos[currentPhotoIndex];

  if (!photo) return;


  // ==========================================
  // CONTADOR
  // ==========================================

  lightboxCounter.textContent =
    `${currentPhotoIndex + 1} / ${filteredGalleryPhotos.length}`;


  // ==========================================
  // ESCONDER TUDO
  // ==========================================

  lightboxImage.classList.add("hidden");

  lightboxVideo.classList.add("hidden");

  lightboxVideoFrame.classList.add("hidden");


  // ==========================================
  // PARAR VÍDEO ANTERIOR
  // ==========================================

  if (lightboxVideo) {

    lightboxVideo.pause();

    lightboxVideo.removeAttribute("src");

    lightboxVideo.load();

  }


  // Limpar iframe anterior

  if (lightboxVideoFrame) {

    lightboxVideoFrame.src = "";

  }


  // ==========================================
  // 🎥 VÍDEO
  // ==========================================
  
if (photo.type === "video") {

  const videoUrl = getVideoUrl(photo);

  // Fechar visualização da aplicação
  lightbox.classList.add("hidden");

  // Tentar abrir o vídeo diretamente
  window.open(
    videoUrl,
    "_blank"
  );

  return;
}


  // ==========================================
  // 📸 FOTOGRAFIA
  // ==========================================

  lightboxImage.src =
    photo.url;


  lightboxImage.alt =
    photo.name ||
    "Fotografia do casamento";


  lightboxImage.classList.remove(
    "hidden"
  );

}

// ==========================================
// FECHAR LIGHTBOX
// ==========================================

function closeLightboxFunction() {

  lightbox.classList.add("hidden");


  // Limpar fotografia

  lightboxImage.src = "";


  // Parar vídeo

  if (lightboxVideo) {

    lightboxVideo.pause();

    lightboxVideo.removeAttribute("src");

    lightboxVideo.load();

  }


  // Limpar iframe

  if (lightboxVideoFrame) {

    lightboxVideoFrame.src = "";

    lightboxVideoFrame.classList.add(
      "hidden"
    );

  }

}

// ==========================================
// PRÓXIMO
// ==========================================

function nextPhotoFunction() {
  currentPhotoIndex++;
  if (
    currentPhotoIndex >= filteredGalleryPhotos.length
  ) {
    currentPhotoIndex = 0;
  }
  showCurrentPhoto();
}

// ==========================================
// ANTERIOR
// ==========================================

function previousPhotoFunction() {

  currentPhotoIndex--;
  if (
    currentPhotoIndex < 0
  ) {
    currentPhotoIndex =
      filteredGalleryPhotos.length - 1;
  }
  showCurrentPhoto();
}

// ==========================================
// BOTÕES
// ==========================================

closeLightbox.addEventListener(
  "click",
  closeLightboxFunction
);

nextPhoto.addEventListener(
  "click",
  nextPhotoFunction
);

previousPhoto.addEventListener(
  "click",
  previousPhotoFunction
);

// ==========================================
// TECLADO
// ==========================================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      lightbox.classList.contains("hidden")
    ) return;

    if (event.key === "Escape") {
      closeLightboxFunction();
    }

    if (event.key === "ArrowRight") {
      nextPhotoFunction();
    }

    if (event.key === "ArrowLeft") {
      previousPhotoFunction();
    }
  }
);

// ==========================================
// ATUALIZAR GALERIA
// ==========================================

refreshGallery.addEventListener(
  "click",
  loadGallery
);


refreshGalleryMenu.addEventListener(
  "click",
  () => {

    closeMenuFunction();

    openGallery();

  }
);


// ==========================================
// MENU
// ==========================================

function openMenuFunction() {

  sideMenu.classList.add("open");

  menuOverlay.classList.add("open");

}


function closeMenuFunction() {

  sideMenu.classList.remove("open");

  menuOverlay.classList.remove("open");

}


menuButton.addEventListener(
  "click",
  openMenuFunction
);


closeMenu.addEventListener(
  "click",
  closeMenuFunction
);


menuOverlay.addEventListener(
  "click",
  closeMenuFunction
);


// ==========================================
// ALTERAR CÓDIGO / SAIR
// ==========================================

changeCodeButton.addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      "weddingAccessUntil"
    );


    appScreen.classList.add("hidden");

    loginScreen.classList.remove("hidden");


    eventCode.value = "";


    closeMenuFunction();

  }
);


// ==========================================
// SERVICE WORKER
// ==========================================

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker.register(
        "sw.js"
      );

    }
  );

}
