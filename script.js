/* =====================================================
   YORMAYN SIERRA INMOBILIARIA
   JAVASCRIPT PRINCIPAL
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     BUSCADOR DE PROPIEDADES
  ===================================================== */

  const form = document.getElementById("propertySearch");
  const count = document.getElementById("resultCount");
  const noResults = document.getElementById("noResults");
  const propiedades = document.getElementById("propiedades");
  const clearButton = document.getElementById("clearFilters");


  function getPropertyCards() {
    return [...document.querySelectorAll(".property-card")];
  }


  function updatePropertyCount(number) {

    if (!count) return;

    count.textContent =
      `${number} inmueble${number === 1 ? "" : "s"}`;
  }


  function updateInitialCount() {

    const cards = getPropertyCards();

    updatePropertyCount(cards.length);
  }


  /* =====================================================
     BUSCADOR
  ===================================================== */

  if (form) {

    form.addEventListener("submit", function (event) {

      event.preventDefault();

      const cards = getPropertyCards();

      const operationElement = document.getElementById("operation");
      const typeElement = document.getElementById("type");
      const locationElement = document.getElementById("location");


      const operation = operationElement
        ? operationElement.value.trim().toLowerCase()
        : "";

      const type = typeElement
        ? typeElement.value.trim().toLowerCase()
        : "";

      const location = locationElement
        ? locationElement.value.trim().toLowerCase()
        : "";


      let visible = 0;


      cards.forEach(function (card) {

        const cardOperation =
          (card.dataset.operation || "").trim().toLowerCase();

        const cardType =
          (card.dataset.type || "").trim().toLowerCase();

        const cardLocation =
          (card.dataset.location || "").trim().toLowerCase();


        const matchesOperation =
          !operation || cardOperation === operation;

        const matchesType =
          !type || cardType === type;

        const matchesLocation =
          !location || cardLocation.includes(location);


        const show =
          matchesOperation && matchesType && matchesLocation;


        card.hidden = !show;

        if (show) visible++;

      });


      updatePropertyCount(visible);

      if (noResults) {
        noResults.hidden = visible !== 0;
      }

      if (propiedades) {
        propiedades.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    });

  }


  /* =====================================================
     LIMPIAR FILTROS
  ===================================================== */

  if (clearButton && form) {

    clearButton.addEventListener("click", function () {

      const operationElement = document.getElementById("operation");
      const typeElement = document.getElementById("type");
      const locationElement = document.getElementById("location");

      if (operationElement) operationElement.value = "";
      if (typeElement) typeElement.value = "";
      if (locationElement) locationElement.value = "";


      const cards = getPropertyCards();

      cards.forEach(function (card) {
        card.hidden = false;
      });


      updatePropertyCount(cards.length);

      if (noResults) {
        noResults.hidden = true;
      }

      if (propiedades) {
        propiedades.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    });

  }


  updateInitialCount();


  /* =====================================================
     AÑO AUTOMÁTICO
  ===================================================== */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* =====================================================
     GALERÍAS (miniaturas dentro de las tarjetas)
  ===================================================== */

  const galleries = document.querySelectorAll("[data-gallery]");


  galleries.forEach(function (gallery) {

    const photos = [...gallery.querySelectorAll(".gallery-img")];

    const previousButton = gallery.querySelector("[data-prev]");
    const nextButton = gallery.querySelector("[data-next]");
    const currentNumber = gallery.querySelector("[data-current]");
    const totalNumber = gallery.querySelector("[data-total]");


    if (!photos.length) return;


    let currentIndex = 0;


    function loadPhoto(photo) {

      if (!photo) return;

      if (photo.dataset.loaded === "true") return;

      const source = photo.dataset.src;

      if (!source) {
        photo.dataset.loaded = "true";
        return;
      }


      const testImage = new Image();

      testImage.onload = function () {
        photo.src = source;
        photo.dataset.loaded = "true";
        photo.classList.remove("image-error");
      };

      testImage.onerror = function () {
        photo.dataset.loaded = "true";
        photo.classList.add("image-error");
        console.warn("No se pudo cargar la imagen:", source);
      };

      testImage.src = source;
    }


    if (totalNumber) {
      totalNumber.textContent = photos.length;
    }


    function showPhoto(index) {

      if (index < 0) index = photos.length - 1;
      if (index >= photos.length) index = 0;

      currentIndex = index;


      photos.forEach(function (photo) {
        photo.classList.remove("active");
      });


      loadPhoto(photos[currentIndex]);


      const nextIndex = (currentIndex + 1) % photos.length;
      const previousIndex = (currentIndex - 1 + photos.length) % photos.length;

      loadPhoto(photos[nextIndex]);
      loadPhoto(photos[previousIndex]);


      photos[currentIndex].classList.add("active");


      if (currentNumber) {
        currentNumber.textContent = currentIndex + 1;
      }

    }


    if (nextButton) {
      nextButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        showPhoto(currentIndex + 1);
      });
    }


    if (previousButton) {
      previousButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        showPhoto(currentIndex - 1);
      });
    }


    /* =====================================================
       ABRIR LIGHTBOX AL HACER CLIC EN LA FOTO
    ===================================================== */

    photos.forEach(function (photo, index) {

      photo.addEventListener("click", function () {

        /* Solo abrir si la foto está activa (visible) */

        if (!photo.classList.contains("active")) return;

        openLightbox(photos, index);

      });

    });


    showPhoto(0);

  });


  /* =====================================================
     LIGHTBOX — FUNCIONALIDAD
  ===================================================== */

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector(".lightbox-img") : null;
  const lightboxCurrent = document.getElementById("lightboxCurrent");
  const lightboxTotal = document.getElementById("lightboxTotal");
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
  const lightboxPrev = lightbox ? lightbox.querySelector(".lightbox-prev") : null;
  const lightboxNext = lightbox ? lightbox.querySelector(".lightbox-next") : null;


  let lightboxPhotos = [];
  let lightboxIndex = 0;


  /* =================================================
     ABRIR LIGHTBOX
  ================================================= */

  function openLightbox(photos, index) {

    if (!lightbox || !lightboxImg) return;

    lightboxPhotos = photos;
    lightboxIndex = index;

    updateLightbox();

    lightbox.hidden = false;

    /* Bloquear el scroll del body cuando el lightbox está abierto */

    document.body.style.overflow = "hidden";
  }


  /* =================================================
     CERRAR LIGHTBOX
  ================================================= */

  function closeLightbox() {

    if (!lightbox) return;

    lightbox.hidden = true;

    /* Quitar el zoom si estaba activo */

    if (lightboxImg) {
      lightboxImg.classList.remove("zoomed");
    }

    /* Restaurar el scroll del body */

    document.body.style.overflow = "";
  }


  /* =================================================
     ACTUALIZAR CONTENIDO DEL LIGHTBOX
  ================================================= */

  function updateLightbox() {

    if (!lightboxImg || !lightboxPhotos.length) return;

    const photo = lightboxPhotos[lightboxIndex];

    /* Usar el src real; si la foto tiene data-src, cargarla primero */

    const realSrc = photo.src || photo.dataset.src;

    lightboxImg.src = realSrc;

    lightboxImg.alt = photo.alt || "Foto ampliada";


    if (lightboxCurrent) {
      lightboxCurrent.textContent = lightboxIndex + 1;
    }

    if (lightboxTotal) {
      lightboxTotal.textContent = lightboxPhotos.length;
    }


    /* Quitar el zoom al cambiar de foto */

    lightboxImg.classList.remove("zoomed");
  }


  /* =================================================
     SIGUIENTE / ANTERIOR EN EL LIGHTBOX
  ================================================= */

  function lightboxNextPhoto() {

    if (!lightboxPhotos.length) return;

    lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length;

    updateLightbox();
  }


  function lightboxPrevPhoto() {

    if (!lightboxPhotos.length) return;

    lightboxIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;

    updateLightbox();
  }


  /* =================================================
     EVENTOS DEL LIGHTBOX
  ================================================= */

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", function (event) {
      event.stopPropagation();
      lightboxNextPhoto();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function (event) {
      event.stopPropagation();
      lightboxPrevPhoto();
    });
  }


  /* Clic fuera de la imagen → cerrar */

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {

      /* Si el clic es directamente sobre el fondo (no sobre la imagen ni botones) */

      if (event.target === lightbox) {
        closeLightbox();
      }

    });
  }


  /* Clic sobre la imagen → zoom toggle */

  if (lightboxImg) {
    lightboxImg.addEventListener("click", function (event) {
      event.stopPropagation();
      lightboxImg.classList.toggle("zoomed");
    });
  }


  /* =================================================
     TECLADO: ESC, ←, →
  ================================================= */

  document.addEventListener("keydown", function (event) {

    if (!lightbox || lightbox.hidden) return;

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowRight") {
      lightboxNextPhoto();
    } else if (event.key === "ArrowLeft") {
      lightboxPrevPhoto();
    }

  });


  /* =================================================
     SWIPE EN MÓVIL (deslizar dedo)
  ================================================= */

  if (lightbox) {

    let touchStartX = 0;
    let touchEndX = 0;


    lightbox.addEventListener("touchstart", function (event) {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });


    lightbox.addEventListener("touchend", function (event) {
      touchEndX = event.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });


    function handleSwipe() {

      const threshold = 50; /* pixeles mínimos para considerar swipe */

      if (touchEndX < touchStartX - threshold) {
        /* Swipe hacia la izquierda → siguiente */
        lightboxNextPhoto();
      } else if (touchEndX > touchStartX + threshold) {
        /* Swipe hacia la derecha → anterior */
        lightboxPrevPhoto();
      }
    }

  }

});
