// ==========================================
// 💒 CASAMENTO DA OLÍVIA & LUIS
// APP V3
// ==========================================


// 🔗 URL DO GOOGLE APPS SCRIPT

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzc9EsYuQ0MQF6GoR6iGAJwVDH7XdJQAyVsKawOuoXiyzo1_CDDecAg5PtLGY-ey2ie/exec";


// 🔐 Apenas usado como verificação visual.
//
// A segurança REAL também está no Apps Script.

const EVENT_CODE = "OLIVIA2026";


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
// SELECIONAR FOTOS
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


    selectedInfo.textContent =
      `${selectedFiles.length} fotografia(s) selecionada(s)`;


    selectedFiles.forEach(
      (file) => {

        const image =
          document.createElement("img");


        image.src =
          URL.createObjectURL(file);


        previewGrid.appendChild(image);

      }
    );

  }
);


// ==========================================
// REDIMENSIONAR FOTO
// ==========================================

async function compressImage(file) {

  const image =
    await createImageBitmap(file);


  const maxSize = 2200;


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
    canvas.getContext("2d");

  context.drawImage(
    image,
    0,
    0,
    width,
    height
  );

  const blob =
    await new Promise(
      resolve => {

        canvas.toBlob(
          resolve,
          "image/jpeg",
          0.88
        );
      }
    );

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
// 📤 ENVIAR FOTOS COM CONFIRMAÇÃO
// ==========================================

uploadButton.addEventListener(
  "click",
  async () => {


    // ======================================
    // VALIDAR
    // ======================================

    if (!selectedFiles.length) {

      uploadStatus.textContent =
        "Escolhe pelo menos uma fotografia 📸";

      return;

    }


    // ======================================
    // BLOQUEAR BOTÃO
    // ======================================

    uploadButton.disabled = true;


    let sent = 0;

    let failed = 0;


    const failedFiles = [];


    // ======================================
    // ENVIAR UMA A UMA
    // ======================================

    for (
      let index = 0;
      index < selectedFiles.length;
      index++
    ) {


      const file =
        selectedFiles[index];


      try {


        // ==================================
        // PREPARAR
        // ==================================

        uploadStatus.innerHTML =
          `⏳ <strong>${index + 1} de ${selectedFiles.length}</strong><br>` +
          `A preparar:<br>` +
          `📸 ${escapeHtml_(file.name)}`;


        const compressed =
          await compressImage(file);


        const base64 =
          await blobToBase64(compressed);


        // ==================================
        // ID ÚNICO DESTE ENVIO
        // ==================================

        const uploadId =
          crypto.randomUUID ?
            crypto.randomUUID() :
            (
              Date.now().toString(36) +
              Math.random()
                .toString(36)
                .slice(2)
            );


        // ==================================
        // ENVIAR
        // ==================================

        uploadStatus.innerHTML =
          `📤 <strong>${index + 1} de ${selectedFiles.length}</strong><br>` +
          `A enviar:<br>` +
          `📸 ${escapeHtml_(file.name)}`;


        const payload = {

          code: EVENT_CODE,

          uploadId: uploadId,

          participant:
            participantName.value.trim(),

          filename:
            file.name,

          mimeType:
            "image/jpeg",

          data:
            base64

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


        // ==================================
        // AGUARDAR PROCESSAMENTO
        // ==================================

        uploadStatus.innerHTML =
          `🔎 <strong>${index + 1} de ${selectedFiles.length}</strong><br>` +
          `A confirmar o envio:<br>` +
          `📸 ${escapeHtml_(file.name)}`;


        let result = null;


        // Tentar confirmar durante alguns segundos

        for (
          let attempt = 0;
          attempt < 10;
          attempt++
        ) {


          await new Promise(
            resolve =>
              setTimeout(resolve, 1000)
          );


          result =
            await checkUploadStatus(uploadId);


          if (
            result.status !== "processing"
          ) {

            break;

          }

        }


        // ==================================
        // SUCESSO
        // ==================================

        if (
          result &&
          result.ok &&
          result.status === "success"
        ) {

          sent++;

          uploadStatus.innerHTML =
            `✅ <strong>${sent} fotografia(s) enviada(s)</strong><br>` +
            `Última fotografia:<br>` +
            `📸 ${escapeHtml_(file.name)}`;


          continue;

        }


        // ==================================
        // FALHA CONFIRMADA
        // ==================================

        failed++;


        const errorMessage =
          result?.error ||
          "Não foi possível confirmar o envio.";


        failedFiles.push({
          name: file.name,
          error: errorMessage
        });


      } catch (error) {


        console.error(
          "Erro ao enviar:",
          file.name,
          error
        );


        failed++;


        failedFiles.push({
          name: file.name,
          error:
            getFriendlyUploadError(error)
        });

      }

    }


    // ======================================
    // RESULTADO FINAL
    // ======================================

    if (!failed) {


      uploadStatus.innerHTML =
        `💗 <strong>Tudo pronto!</strong><br><br>` +
        `✅ ${sent} fotografia(s) enviada(s) com sucesso! 📸🦆`;


      // Limpar seleção apenas se tudo correu bem

      selectedFiles = [];

      photoInput.value = "";

      previewGrid.innerHTML = "";

      selectedInfo.textContent = "";


    } else {


      let message =
        `<strong>Resultado do envio:</strong><br><br>` +
        `✅ Enviadas: ${sent}<br>` +
        `❌ Com problema: ${failed}`;


      message +=
        `<br><br><strong>Fotografias com problema:</strong><br>`;


      failedFiles.forEach(
        item => {

          message +=
            `<br>❌ 📸 ${escapeHtml_(item.name)}` +
            `<br><small>${escapeHtml_(item.error)}</small>`;

        }
      );


      uploadStatus.innerHTML =
        message;

    }


    // ======================================
    // REATIVAR BOTÃO
    // ======================================

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


      const newPhotos =
        response.photos || [];


      // ==========================================
      // 3️⃣ VERIFICAR SE EXISTEM FOTOS NOVAS
      // ==========================================

      const currentIds =
        new Set(
          galleryPhotos.map(photo => photo.id)
        );


      const photosToAdd =
        newPhotos.filter(
          photo => !currentIds.has(photo.id)
        );


      // Se ainda não havia galeria
      if (!galleryPhotos.length) {

        galleryPhotos = newPhotos;

        applyFolderFilter();

      }


      // Se existem fotos novas
      else if (photosToAdd.length) {

        // O servidor já envia as mais recentes primeiro
        galleryPhotos =
          [
            ...photosToAdd,
            ...galleryPhotos
          ];


        applyFolderFilter();

      }


      // Atualizar contador
      photoCount.textContent =
        galleryPhotos.length;


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
// LIGHTBOX
// ==========================================

function openLightbox(index) {

  currentPhotoIndex = index;


  showCurrentPhoto();


  lightbox.classList.remove("hidden");

}


function showCurrentPhoto() {

const photo =
  filteredGalleryPhotos[currentPhotoIndex];


  if (!photo) return;


  lightboxImage.src =
    photo.url;


  lightboxCounter.textContent =
    `${currentPhotoIndex + 1} / ${filteredGalleryPhotos.length}`;

}


function closeLightboxFunction() {

  lightbox.classList.add("hidden");

  lightboxImage.src = "";

}


function nextPhotoFunction() {

  currentPhotoIndex++;

  if (
    currentPhotoIndex >= filteredGalleryPhotos.length
  ) {

    currentPhotoIndex = 0;

  }

  showCurrentPhoto();

}


function previousPhotoFunction() {

  currentPhotoIndex--;


  if (currentPhotoIndex < 0) {

currentPhotoIndex =
  filteredGalleryPhotos.length - 1;

  }


  showCurrentPhoto();

}


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

    sessionStorage.removeItem(
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
