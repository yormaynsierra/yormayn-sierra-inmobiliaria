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


  /*
     OBTENER TODAS LAS PROPIEDADES

     De esta manera, cada vez que agregues una nueva
     .property-card al HTML, el contador la reconocerá
     automáticamente.
  */

  function getPropertyCards() {
    return [...document.querySelectorAll(".property-card")];
  }


  /* =====================================================
     ACTUALIZAR CONTADOR
  ===================================================== */

  function updatePropertyCount(number) {

    if (!count) return;

    count.textContent =
      `${number} inmueble${number === 1 ? "" : "s"}`;
  }


  /*
     MOSTRAR CANTIDAD TOTAL AL CARGAR LA PÁGINA

     Ejemplo:

     1 propiedad  → 1 inmueble
     2 propiedades → 2 inmuebles
     5 propiedades → 5 inmuebles
     10 propiedades → 10 inmuebles
  */

  function updateInitialCount() {

    const cards = getPropertyCards();

    updatePropertyCount(cards.length);
  }


  /* =====================================================
     BUSCAR PROPIEDADES
  ===================================================== */

  if (form) {

    form.addEventListener("submit", function (event) {

      event.preventDefault();


      /* OBTENER PROPIEDADES ACTUALES */

      const cards = getPropertyCards();


      /* OBTENER FILTROS */

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


      /* =================================================
         REVISAR CADA PROPIEDAD
      ================================================= */

      cards.forEach(function (card) {


        const cardOperation =
          (card.dataset.operation || "").trim().toLowerCase();


        const cardType =
          (card.dataset.type || "").trim().toLowerCase();


        const cardLocation =
          (card.dataset.location || "").trim().toLowerCase();


        /* COINCIDENCIA OPERACIÓN */

        const matchesOperation =
          !operation ||
          cardOperation === operation;


        /* COINCIDENCIA TIPO */

        const matchesType =
          !type ||
          cardType === type;


        /* COINCIDENCIA UBICACIÓN */

        const matchesLocation =
          !location ||
          cardLocation.includes(location);


        /* RESULTADO FINAL */

        const show =
          matchesOperation &&
          matchesType &&
          matchesLocation;


        card.hidden = !show;


        if (show) {
          visible++;
        }

      });


      /* =================================================
         ACTUALIZAR CONTADOR
      ================================================= */

      updatePropertyCount(visible);


      /* =================================================
         MOSTRAR / OCULTAR MENSAJE SIN RESULTADOS
      ================================================= */

      if (noResults) {
        noResults.hidden = visible !== 0;
      }


      /* =================================================
         BAJAR HASTA LAS PROPIEDADES
      ================================================= */

      if (propiedades) {

        propiedades.scrollIntoView({
          behavior: "smooth"
        });

      }

    });

  }


  /* =====================================================
     CONTADOR INICIAL DE INMUEBLES
  ===================================================== */

  updateInitialCount();


  /* =====================================================
     AÑO AUTOMÁTICO DEL FOOTER
  ===================================================== */

  const year = document.getElementById("year");

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* =====================================================
     GALERÍAS DE FOTOS
  ===================================================== */

  const galleries =
    document.querySelectorAll("[data-gallery]");


  galleries.forEach(function (gallery) {


    const photos =
      gallery.querySelectorAll(".gallery-img");


    const previousButton =
      gallery.querySelector("[data-prev]");


    const nextButton =
      gallery.querySelector("[data-next]");


    const currentNumber =
      gallery.querySelector("[data-current]");


    const totalNumber =
      gallery.querySelector("[data-total]");


    /* SI NO HAY FOTOS, NO CONTINUAR */

    if (!photos.length) {
      return;
    }


    let currentIndex = 0;


    /* =================================================
       TOTAL DE FOTOS
    ================================================= */

    if (totalNumber) {

      totalNumber.textContent =
        photos.length;

    }


    /* =================================================
       MOSTRAR FOTO
    ================================================= */

    function showPhoto(index) {


      /* ASEGURAR QUE EL ÍNDICE SEA VÁLIDO */

      if (index < 0) {
        index = photos.length - 1;
      }


      if (index >= photos.length) {
        index = 0;
      }


      currentIndex = index;


      /* OCULTAR TODAS */

      photos.forEach(function (photo) {

        photo.classList.remove("active");

      });


      /* MOSTRAR FOTO ACTUAL */

      photos[currentIndex].classList.add("active");


      /* ACTUALIZAR CONTADOR */

      if (currentNumber) {

        currentNumber.textContent =
          currentIndex + 1;

      }

    }


    /* =================================================
       BOTÓN SIGUIENTE
    ================================================= */

    if (nextButton) {

      nextButton.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();


        currentIndex++;


        if (currentIndex >= photos.length) {

          currentIndex = 0;

        }


        showPhoto(currentIndex);

      });

    }


    /* =================================================
       BOTÓN ANTERIOR
    ================================================= */

    if (previousButton) {

      previousButton.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();


        currentIndex--;


        if (currentIndex < 0) {

          currentIndex =
            photos.length - 1;

        }


        showPhoto(currentIndex);

      });

    }


    /* =================================================
       MOSTRAR PRIMERA FOTO
    ================================================= */

    showPhoto(0);

  });


});