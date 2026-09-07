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

      const operationElement =
        document.getElementById("operation");

      const typeElement =
        document.getElementById("type");

      const locationElement =
        document.getElementById("location");


      const operation =
        operationElement
          ? operationElement.value.trim().toLowerCase()
          : "";


      const type =
        typeElement
          ? typeElement.value.trim().toLowerCase()
          : "";


      const location =
        locationElement
          ? locationElement.value.trim().toLowerCase()
          : "";


      let visible = 0;


      cards.forEach(function (card) {

        const cardOperation =
          (card.dataset.operation || "")
            .trim()
            .toLowerCase();


        const cardType =
          (card.dataset.type || "")
            .trim()
            .toLowerCase();


        const cardLocation =
          (card.dataset.location || "")
            .trim()
            .toLowerCase();


        const matchesOperation =
          !operation ||
          cardOperation === operation;


        const matchesType =
          !type ||
          cardType === type;


        const matchesLocation =
          !location ||
          cardLocation.includes(location);


        const show =
          matchesOperation &&
          matchesType &&
          matchesLocation;


        card.hidden = !show;


        if (show) {
          visible++;
        }

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


  updateInitialCount();


  /* =====================================================
     AÑO AUTOMÁTICO
  ===================================================== */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* =====================================================
     GALERÍAS
  ===================================================== */

  const galleries =
    document.querySelectorAll("[data-gallery]");


  galleries.forEach(function (gallery) {

    const photos =
      [...gallery.querySelectorAll(".gallery-img")];


    const previousButton =
      gallery.querySelector("[data-prev]");


    const nextButton =
      gallery.querySelector("[data-next]");


    const currentNumber =
      gallery.querySelector("[data-current]");


    const totalNumber =
      gallery.querySelector("[data-total]");


    if (!photos.length) {
      return;
    }


    let currentIndex = 0;


    /* =================================================
       CARGAR IMAGEN
    ================================================= */

    function loadPhoto(photo) {

      if (!photo) return;


      /*
         Si ya tiene src real, no hacemos nada.
      */

      if (photo.dataset.loaded === "true") {
        return;
      }


      const source =
        photo.dataset.src;


      if (!source) {

        photo.dataset.loaded = "true";

        return;

      }


      /*
         Crear una nueva imagen para comprobar
         que realmente existe antes de mostrarla.
      */

      const testImage = new Image();


      testImage.onload = function () {

        photo.src = source;

        photo.dataset.loaded = "true";

        photo.classList.remove("image-error");

      };


      testImage.onerror = function () {

        photo.dataset.loaded = "true";

        photo.classList.add("image-error");

        console.warn(
          "No se pudo cargar la imagen:",
          source
        );

      };


      testImage.src = source;

    }


    /* =================================================
       TOTAL AUTOMÁTICO
    ================================================= */

    if (totalNumber) {

      totalNumber.textContent =
        photos.length;

    }


    /* =================================================
       MOSTRAR FOTO
    ================================================= */

    function showPhoto(index) {

      if (index < 0) {
        index = photos.length - 1;
      }


      if (index >= photos.length) {
        index = 0;
      }


      currentIndex = index;


      /*
         Ocultar todas las imágenes.
      */

      photos.forEach(function (photo) {

        photo.classList.remove("active");

      });


      /*
         Cargar la foto actual.
      */

      loadPhoto(photos[currentIndex]);


      /*
         También precargar la siguiente
         y la anterior para que el cambio
         sea mucho más rápido.
      */

      const nextIndex =
        (currentIndex + 1) % photos.length;


      const previousIndex =
        (currentIndex - 1 + photos.length) %
        photos.length;


      loadPhoto(photos[nextIndex]);

      loadPhoto(photos[previousIndex]);


      /*
         Mostrar imagen actual.
      */

      photos[currentIndex].classList.add("active");


      /*
         Actualizar contador.
      */

      if (currentNumber) {

        currentNumber.textContent =
          currentIndex + 1;

      }

    }


    /* =================================================
       SIGUIENTE
    ================================================= */

    if (nextButton) {

      nextButton.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        showPhoto(currentIndex + 1);

      });

    }


    /* =================================================
       ANTERIOR
    ================================================= */

    if (previousButton) {

      previousButton.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        showPhoto(currentIndex - 1);

      });

    }


    /* =================================================
       INICIALIZAR
    ================================================= */

    showPhoto(0);

  });


});
