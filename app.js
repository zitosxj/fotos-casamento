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

let currentPhotoIndex = 0;


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


  sessionStorage.setItem(
    "weddingAccess",
    "true"
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

if (
  sessionStorage.getItem("weddingAccess") === "true"
) {

  loginScreen.classList.add("hidden");

  appScreen.classList.remove("hidden");

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
// ENVIAR FOTOS
// ==========================================

uploadButton.addEventListener(
  "click",
  async () => {

    if (!selectedFiles.length) {

      uploadStatus.textContent =
        "Escolhe pelo menos uma fotografia 📸";

      return;

    }


    uploadButton.disabled = true;

    uploadStatus.textContent =
      "A preparar as fotografias...";


    let sent = 0;


    try {

      for (const file of selectedFiles) {

        uploadStatus.textContent =
          `A enviar ${sent + 1} de ${selectedFiles.length}... 📤`;


        const compressed =
          await compressImage(file);


        const base64 =
          await blobToBase64(compressed);


        const payload = {

          code: EVENT_CODE,

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


        sent++;

      }


      uploadStatus.innerHTML =
        `💗 ${sent} fotografia(s) enviada(s) com sucesso!`;


      selectedFiles = [];

      photoInput.value = "";

      previewGrid.innerHTML = "";

      selectedInfo.textContent = "";


      // Atualizar a galeria depois de alguns segundos

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


    } catch (error) {

      console.error(error);


      uploadStatus.textContent =
        "Ocorreu um problema ao enviar as fotografias.";

    }


    uploadButton.disabled = false;

  }
);


// ==========================================
// CARREGAR GALERIA COM JSONP
// ==========================================

function loadGallery() {
  refreshGallery.disabled = true;
  galleryLoading.classList.remove("hidden");

  galleryError.textContent = "";

  galleryGrid.innerHTML = "";


  const callbackName =
    "galleryCallback_" +
    Date.now();


  const script =
    document.createElement("script");


  window[callbackName] =
    function (response) {

      script.remove();


      delete window[callbackName];


      galleryLoading.classList.add("hidden");
      refreshGallery.disabled = false;
      refreshGallery.textContent = "🔄 Atualizar";

      if (!response.ok) {

        galleryError.textContent =
          response.error ||
          "Não foi possível carregar a galeria.";

        return;

      }


      galleryPhotos =
        response.photos || [];


      photoCount.textContent =
        galleryPhotos.length;


      renderGallery();

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
      refreshGallery.textContent = "🔄 Atualizar";

      galleryError.textContent =
        "Não foi possível ligar à galeria.";

    };


  document.body.appendChild(script);

}


// ==========================================
// MOSTRAR GALERIA
// ==========================================

function renderGallery() {

  if (!galleryPhotos.length) {

    galleryGrid.innerHTML = `
      <div class="gallery-message">
        Ainda não existem fotografias na galeria 📸
      </div>
    `;

    return;

  }


  galleryPhotos.forEach(
    (photo, index) => {

      const item =
        document.createElement("div");


      item.className =
        "gallery-item";


      const image =
        document.createElement("img");


      image.src =
        photo.thumbnail;


      image.alt =
        photo.name;


      image.loading =
        "lazy";


      item.appendChild(image);


      item.addEventListener(
        "click",
        () => openLightbox(index)
      );


      galleryGrid.appendChild(item);

    }
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
    galleryPhotos[currentPhotoIndex];


  if (!photo) return;


  lightboxImage.src =
    photo.url;


  lightboxCounter.textContent =
    `${currentPhotoIndex + 1} / ${galleryPhotos.length}`;

}


function closeLightboxFunction() {

  lightbox.classList.add("hidden");

  lightboxImage.src = "";

}


function nextPhotoFunction() {

  currentPhotoIndex++;


  if (
    currentPhotoIndex >= galleryPhotos.length
  ) {

    currentPhotoIndex = 0;

  }


  showCurrentPhoto();

}


function previousPhotoFunction() {

  currentPhotoIndex--;


  if (currentPhotoIndex < 0) {

    currentPhotoIndex =
      galleryPhotos.length - 1;

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
      "weddingAccess"
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
