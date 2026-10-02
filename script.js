/* =====================================================
   YORMAYN SIERRA INMOBILIARIA
   JAVASCRIPT PRINCIPAL — CON CARGA DESDE JSON
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     CONFIGURACIÓN
  ===================================================== */

  const WHATSAPP_NUMBER = "573176006453";
  const RUTA_FOTOS = "assets/";

  /* Extensiones que probará el script (en orden) */
  const EXTENSIONES = ["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"];


  /* =====================================================
     UTILIDADES
  ===================================================== */

  function formatearPrecio(valor) {
    if (!valor) return "";
    return "$ " + valor.toLocaleString("es-CO");
  }

  function codificarMensajeWhatsApp(texto) {
    return encodeURIComponent(texto);
  }

  function construirMensajeWhatsApp(propiedad) {
    return `Hola, me interesa ${propiedad.titulo} en ${propiedad.ubicacion}. ¿Me puedes dar más información?`;
  }


  /* =====================================================
     GENERAR CARD DE PROPIEDAD
  ===================================================== */

  function crearCardPropiedad(propiedad, indice) {

    /* Artículo principal */
    const article = document.createElement("article");
    article.className = "property-card";
    article.dataset.operation = propiedad.operacion;
    article.dataset.type = propiedad.tipo;
    article.dataset.location = propiedad.ubicacion;

    /* ==================== GALERÍA ==================== */
    const galleryDiv = document.createElement("div");
    galleryDiv.className = "property-image gallery";
    galleryDiv.setAttribute("data-gallery", "");

    /* Generar N fotos con detección automática de extensión */
    for (let i = 1; i <= propiedad.totalFotos; i++) {
      const img = document.createElement("img");
      img.className = "gallery-img";
      img.alt = `${propiedad.titulo} — foto ${i}`;
      img.dataset.numero = i;
      img.dataset.carpeta = propiedad.carpeta;
      img.dataset.extActual = 0;

      /* La primera foto se asigna directo */
      if (i === 1) {
        img.src = `${RUTA_FOTOS}${propiedad.carpeta}/1.jpg`;
        img.dataset.triedExtensions = "true";
      }

      galleryDiv.appendChild(img);
    }

    /* Botones prev/next */
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "gallery-btn gallery-prev";
    prevBtn.setAttribute("data-prev", "");
    prevBtn.setAttribute("aria-label", "Fotografía anterior");
    prevBtn.textContent = "❮";
    galleryDiv.appendChild(prevBtn);

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "gallery-btn gallery-next";
    nextBtn.setAttribute("data-next", "");
    nextBtn.setAttribute("aria-label", "Fotografía siguiente");
    nextBtn.textContent = "❯";
    galleryDiv.appendChild(nextBtn);

    /* Contador */
    const counter = document.createElement("div");
    counter.className = "gallery-counter";
    counter.innerHTML = `<span data-current>1</span> / <span data-total>${propiedad.totalFotos}</span>`;
    galleryDiv.appendChild(counter);

    article.appendChild(galleryDiv);


    /* ==================== INFORMACIÓN ==================== */
    const body = document.createElement("div");
    body.className = "property-body";

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = "Venta";
    body.appendChild(tag);

    const h3 = document.createElement("h3");
    h3.textContent = propiedad.titulo;
    body.appendChild(h3);

    const location = document.createElement("p");
    location.className = "location";
    location.textContent = `📍 ${propiedad.ubicacion}`;
    body.appendChild(location);

    const features = document.createElement("div");
    features.className = "features";
    propiedad.caracteristicas.forEach(c => {
      const span = document.createElement("span");
      span.textContent = c;
      features.appendChild(span);
    });
    body.appendChild(features);


    /* ==================== FOOTER (precio + botones) ==================== */
    const footer = document.createElement("div");
    footer.className = "property-footer";

    const strong = document.createElement("strong");
    strong.textContent = formatearPrecio(propiedad.precio);
    footer.appendChild(strong);

    /* Botones YouTube/Tour */
    const mediaBtns = document.createElement("div");
    mediaBtns.className = "property-media-buttons";

    /* YouTube */
    if (propiedad.youtube) {
      const ytLink = document.createElement("a");
      ytLink.href = propiedad.youtube;
      ytLink.className = "media-btn youtube-btn";
      ytLink.target = "_blank";
      ytLink.rel = "noopener";
      ytLink.title = "Ver video";
      ytLink.innerHTML = `<img src="assets/logo youtube.jpg" alt="YouTube">`;
      mediaBtns.appendChild(ytLink);
    } else {
      const ytSpan = document.createElement("span");
      ytSpan.className = "media-btn youtube-btn video-proximamente";
      ytSpan.title = "Video próximamente";
      ytSpan.innerHTML = `<img src="assets/logo youtube.jpg" alt="Video próximamente">`;
      mediaBtns.appendChild(ytSpan);
    }

    /* Tour 360° */
    if (propiedad.tour360) {
      const tourLink = document.createElement("a");
      tourLink.href = propiedad.tour360;
      tourLink.className = "media-btn tour-btn";
      tourLink.title = "Tour virtual 360°";
      tourLink.innerHTML = `<img src="assets/logotourvirtual.jpg" alt="Tour virtual 360°">`;
      mediaBtns.appendChild(tourLink);
    } else {
      const tourSpan = document.createElement("span");
      tourSpan.className = "media-btn tour-btn video-proximamente";
      tourSpan.title = "Tour próximamente";
      tourSpan.innerHTML = `<img src="assets/logotourvirtual.jpg" alt="Tour virtual 360°">`;
      mediaBtns.appendChild(tourSpan);
    }

    footer.appendChild(mediaBtns);
    body.appendChild(footer);

    /* Botón WhatsApp */
    const mensaje = construirMensajeWhatsApp(propiedad);
    const whatsappLink = document.createElement("a");
    whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${codificarMensajeWhatsApp(mensaje)}`;
    whatsappLink.className = "btn-whatsapp-propiedad";
    whatsappLink.target = "_blank";
    whatsappLink.rel = "noopener";
    whatsappLink.textContent = "💬 Preguntar por WhatsApp";
    whatsappLink.setAttribute("onclick", "if(window.fbq) fbq('track', 'Contact');");
    body.appendChild(whatsappLink);

    article.appendChild(body);

    return article;
  }


  /* =====================================================
     CARGAR PROPIEDADES DESDE JSON
  ===================================================== */

  fetch("propiedades.json")
    .then(res => res.json())
    .then(propiedades => {

      const grid = document.getElementById("propertyGrid");
      if (!grid) return;

      /* Generar todas las tarjetas */
      propiedades.forEach((prop, i) => {
        grid.appendChild(crearCardPropiedad(prop, i));
      });

      /* Inicializar galerías */
      inicializarGaleriaConDeteccion();

      /* Inicializar buscador y contador */
      actualizarContadorInicial();

    })
    .catch(err => {
      console.error("Error al cargar propiedades.json:", err);

      const grid = document.getElementById("propertyGrid");
      if (grid) {
        grid.innerHTML = '<p style="text-align:center;color:#c00;padding:40px;">Error al cargar las propiedades. Verifica la consola.</p>';
      }
    });


  /* =====================================================
     GALERÍA CON DETECCIÓN AUTOMÁTICA DE EXTENSIÓN
  ===================================================== */

  function inicializarGaleriaConDeteccion() {

    const galleries = document.querySelectorAll("[data-gallery]");

    galleries.forEach(gallery => {

      const photos = [...gallery.querySelectorAll(".gallery-img")];
      const prevBtn = gallery.querySelector("[data-prev]");
      const nextBtn = gallery.querySelector("[data-next]");
      const currentNum = gallery.querySelector("[data-current]");
      const totalNum = gallery.querySelector("[data-total]");

      if (!photos.length) return;

      let currentIndex = 0;


      /* Cargar una foto probando extensiones */
      function cargarFoto(img) {

        if (!img) return;
        if (img.dataset.cargada === "true") return;

        const numero = img.dataset.numero;
        const carpeta = img.dataset.carpeta;
        const extActual = parseInt(img.dataset.extActual || 0);

        if (extActual >= EXTENSIONES.length) {
          /* No se encontró ninguna extensión */
          img.dataset.cargada = "true";
          img.src = ""; /* Vacío */
          img.classList.add("image-error");
          return;
        }

        const ext = EXTENSIONES[extActual];
        const url = `${RUTA_FOTOS}${carpeta}/${numero}.${ext}`;

        const testImg = new Image();

        testImg.onload = () => {
          img.src = url;
          img.dataset.cargada = "true";
          img.dataset.extActual = extActual;
          img.classList.remove("image-error");
        };

        testImg.onerror = () => {
          /* Probar la siguiente extensión */
          img.dataset.extActual = extActual + 1;
          cargarFoto(img);
        };

        testImg.src = url;
      }


      function mostrarFoto(index) {

        if (index < 0) index = photos.length - 1;
        if (index >= photos.length) index = 0;

        currentIndex = index;

        photos.forEach(p => p.classList.remove("active"));

        /* Cargar foto actual + vecinas */
        cargarFoto(photos[currentIndex]);
        cargarFoto(photos[(currentIndex + 1) % photos.length]);
        cargarFoto(photos[(currentIndex - 1 + photos.length) % photos.length]);

        photos[currentIndex].classList.add("active");

        if (currentNum) currentNum.textContent = currentIndex + 1;
      }


      if (nextBtn) {
        nextBtn.addEventListener("click", e => {
          e.preventDefault();
          e.stopPropagation();
          mostrarFoto(currentIndex + 1);
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", e => {
          e.preventDefault();
          e.stopPropagation();
          mostrarFoto(currentIndex - 1);
        });
      }

      /* Abrir lightbox */
      photos.forEach((photo, i) => {
        photo.addEventListener("click", () => {
          if (!photo.classList.contains("active")) return;
          if (!photo.src) return;
          if (window.abrirLightbox) {
            window.abrirLightbox(photos, i);
          }
        });
      });

      mostrarFoto(0);
    });
  }


  /* =====================================================
     BUSCADOR DE PROPIEDADES
  ===================================================== */

  const form = document.getElementById("propertySearch");
  const count = document.getElementById("resultCount");
  const noResults = document.getElementById("noResults");
  const propiedadesSec = document.getElementById("propiedades");
  const clearButton = document.getElementById("clearFilters");


  function getPropertyCards() {
    return [...document.querySelectorAll(".property-card")];
  }


  function updatePropertyCount(number) {
    if (!count) return;
    count.textContent = `${number} inmueble${number === 1 ? "" : "s"}`;
  }


  function actualizarContadorInicial() {
    const cards = getPropertyCards();
    updatePropertyCount(cards.length);
  }


  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const cards = getPropertyCards();
      const operation = (document.getElementById("operation")?.value || "").toLowerCase();
      const type = (document.getElementById("type")?.value || "").toLowerCase();
      const location = (document.getElementById("location")?.value || "").toLowerCase();

      let visible = 0;

      cards.forEach(card => {
        const cOp = (card.dataset.operation || "").toLowerCase();
        const cType = (card.dataset.type || "").toLowerCase();
        const cLoc = (card.dataset.location || "").toLowerCase();

        const show =
          (!operation || cOp === operation) &&
          (!type || cType === type) &&
          (!location || cLoc.includes(location));

        card.hidden = !show;
        if (show) visible++;
      });

      updatePropertyCount(visible);
      if (noResults) noResults.hidden = visible !== 0;

      if (propiedadesSec) {
        propiedadesSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }


  if (clearButton && form) {
    clearButton.addEventListener("click", () => {
      const op = document.getElementById("operation");
      const ty = document.getElementById("type");
      const lo = document.getElementById("location");

      if (op) op.value = "";
      if (ty) ty.value = "";
      if (lo) lo.value = "";

      const cards = getPropertyCards();
      cards.forEach(c => c.hidden = false);

      updatePropertyCount(cards.length);
      if (noResults) noResults.hidden = true;

      if (propiedadesSec) {
        propiedadesSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }


  /* =====================================================
     AÑO AUTOMÁTICO
  ===================================================== */

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();


  /* =====================================================
     LIGHTBOX
  ===================================================== */

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox?.querySelector(".lightbox-img");
  const lightboxCurrent = document.getElementById("lightboxCurrent");
  const lightboxTotal = document.getElementById("lightboxTotal");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");
  const lightboxPrev = lightbox?.querySelector(".lightbox-prev");
  const lightboxNext = lightbox?.querySelector(".lightbox-next");

  let lightboxPhotos = [];
  let lightboxIndex = 0;


  function updateLightbox() {
    if (!lightboxImg || !lightboxPhotos.length) return;
    const photo = lightboxPhotos[lightboxIndex];
    lightboxImg.src = photo.src || photo.dataset.src || "";
    lightboxImg.alt = photo.alt || "Foto ampliada";
    if (lightboxCurrent) lightboxCurrent.textContent = lightboxIndex + 1;
    if (lightboxTotal) lightboxTotal.textContent = lightboxPhotos.length;
    lightboxImg.classList.remove("zoomed");
  }


  function openLightbox(photos, index) {
    if (!lightbox || !lightboxImg) return;
    lightboxPhotos = photos;
    lightboxIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }


  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.classList.remove("zoomed");
    document.body.style.overflow = "";
  }


  function nextPhoto() {
    if (!lightboxPhotos.length) return;
    lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length;
    updateLightbox();
  }


  function prevPhoto() {
    if (!lightboxPhotos.length) return;
    lightboxIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
    updateLightbox();
  }


  /* Exponer openLightbox para que la galería lo use */
  window.abrirLightbox = openLightbox;


  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener("click", e => { e.stopPropagation(); nextPhoto(); });
  if (lightboxPrev) lightboxPrev.addEventListener("click", e => { e.stopPropagation(); prevPhoto(); });

  if (lightbox) {
    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxImg) {
    lightboxImg.addEventListener("click", e => {
      e.stopPropagation();
      lightboxImg.classList.toggle("zoomed");
    });
  }

  document.addEventListener("keydown", e => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "ArrowLeft") prevPhoto();
  });

  /* Swipe en móvil */
  if (lightbox) {
    let startX = 0;
    let endX = 0;

    lightbox.addEventListener("touchstart", e => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener("touchend", e => {
      endX = e.changedTouches[0].screenX;
      if (endX < startX - 50) nextPhoto();
      else if (endX > startX + 50) prevPhoto();
    }, { passive: true });
  }

});
