/* =========================================================
   TODOS CON HERNÁN · GRAND TOUR DE SUIZA
   SCRIPT PRINCIPAL
   ========================================================= */


/* =========================================================
   DATOS
   ========================================================= */

const spots = window.SPOTS;

/*
 * Información editorial adicional de cada Photo Spot.
 * Se mantiene spots.js como fuente principal de los datos
 * del mapa y photo-spots-info.js como fuente de información.
 */
const photoSpotsInfo =
  Array.isArray(window.PHOTO_SPOTS_INFO)
    ? window.PHOTO_SPOTS_INFO
    : [];



/* =========================================================
   COMPROBACIÓN DE DATOS
   ========================================================= */

if (!Array.isArray(spots) || spots.length === 0) {

  console.error(
    'ERROR: No se han encontrado los Photo Spots.'
  );

}


/* =========================================================
   MAPA LEAFLET · EUROPA PRO
   ========================================================= */

const map = L.map('map', {

  zoomControl: false,

  preferCanvas: true,

  minZoom: 4,

  maxZoom: 18

}).setView(

  [46.50, 8.25],

  8

);


/* =========================================================
   CONTROL DE ZOOM
   ========================================================= */

L.control.zoom({

  position: 'topright'

}).addTo(map);


/* =========================================================
   MAPA SATÉLITE
   ========================================================= */

const satelliteLayer =
  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles © Esri',
      maxNativeZoom: 18,
      maxZoom: 18
    }
  );


/* =========================================================
   FRONTERAS
   ========================================================= */

const WORLD_BORDERS_URL =
  'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';

let worldBordersLayer = null;


fetch(WORLD_BORDERS_URL)

  .then(response => {

    if (!response.ok) {

      throw new Error(
        'No se pudieron cargar las fronteras.'
      );

    }

    return response.json();

  })

  .then(data => {

    worldBordersLayer =
      L.geoJSON(

        data,

        {

          style: {

            color:
              '#ffffff',

            weight:
              1.2,

            opacity:
              0.65,

            fill:
              false,

            fillOpacity:
              0

          },

          interactive:
            false

        }

      ).addTo(map);


    worldBordersLayer.bringToBack();

  })

  .catch(error => {

    console.error(
      'Error cargando fronteras:',
      error
    );

  });


/* =========================================================
   CIUDADES
   ========================================================= */

const cities = [

  {
    name: 'Ginebra',
    lat: 46.2044,
    lng: 6.1432
  },

  {
    name: 'Lausana',
    lat: 46.5197,
    lng: 6.6323
  },

  {
    name: 'Berna',
    lat: 46.9480,
    lng: 7.4474
  },

  {
    name: 'Basilea',
    lat: 47.5596,
    lng: 7.5886
  },

  {
    name: 'Zúrich',
    lat: 47.3769,
    lng: 8.5417
  },

  {
    name: 'Lucerna',
    lat: 47.0502,
    lng: 8.3093
  },

  {
    name: 'Interlaken',
    lat: 46.6863,
    lng: 7.8632
  },

  {
    name: 'Chur',
    lat: 46.8508,
    lng: 9.5320
  },

  {
    name: 'Lugano',
    lat: 46.0037,
    lng: 8.9511
  },

  {
    name: 'St. Gallen',
    lat: 47.4245,
    lng: 9.3767
  }

];


cities.forEach(city => {

  L.marker(

    [
      city.lat,
      city.lng
    ],

    {

      interactive:
        false,

      icon:

        L.divIcon({

          className:
            'city-marker',

          html: `

            <div class="city-dot"></div>

            <div class="city-label">
              ${city.name}
            </div>

          `,

          iconSize:
            [130, 25],

          iconAnchor:
            [4, 4]

        })

    }

  ).addTo(map);

});


/* =========================================================
   HERNÁN
   ========================================================= */

const hernanIcon =
  L.divIcon({

    className:
      'herny',

    html: `

      <img
        src="img/H1.png"
        alt="Hernán"
      >

    `,

    iconSize:
      [45, 45],

    iconAnchor:
      [22, 42]

  });


let hernan =
  L.marker(

    [
      spots[0].lat,
      spots[0].lng
    ],

    {

      icon:
        hernanIcon,

      zIndexOffset:
        1500,

      interactive:
        false

    }

  ).addTo(map);


/* =========================================================
   ICONOS DE PHOTO SPOTS
   ========================================================= */

function markerIcon(
  id,
  active = false
) {

  return L.divIcon({

    className:
      'custom',

    html: `

      <div class="marker ${active ? 'active' : ''}">

        <span>
          ${String(id).padStart(2, '0')}
        </span>

      </div>

    `,

    iconSize:
      [28, 28],

    iconAnchor:
      [8, 27]

  });

}


/* =========================================================
   RUTA DE IMÁGENES
   ========================================================= */

function spotImagePath(
  id
) {

  return (
    `img/spots/${String(id).padStart(2, '0')}.jpg`
  );

}


/* =========================================================
   MARCADORES DE LOS 92 SPOTS
   ========================================================= */

const markers = [];


spots.forEach(spot => {

  const marker =
    L.marker(

      [
        spot.lat,
        spot.lng
      ],

      {

        icon:
          markerIcon(
            spot.id
          )

      }

    ).addTo(map);


  marker.bindTooltip(

    `${String(spot.id).padStart(2, '0')} · ${spot.name}`,

    {

      direction:
        'top',

      offset:
        [0, -18]

    }

  );


  marker.on(
    'click',
    () => {

      selectSpot(
        spot.id,
        true
      );

    }
  );


  markers.push(
    marker
  );

});


/* =========================================================
   ESTADO
   ========================================================= */

let currentSpotIndex = 0;

let currentPhotoIndex = 0;


/* =========================================================
   GPS · ESTADO
   ========================================================= */

let userLocation = null;

let userLocationMarker = null;

let userAccuracyCircle = null;

let selectedSpotForGPS = null;

let gpsWatchId = null;


/* =========================================================
   ELEMENTOS GPS
   ========================================================= */

const locateMeBtn =
  document.getElementById(
    'locateMeBtn'
  );


const locationStatus =
  document.getElementById(
    'locationStatus'
  );


const locationText =
  document.getElementById(
    'locationText'
  );


const distanceBox =
  document.getElementById(
    'distanceBox'
  );


const distanceValue =
  document.getElementById(
    'distanceValue'
  );


const navigationBtn =
  document.getElementById(
    'navigationBtn'
  );


const nearbySpots =
  document.getElementById(
    'nearbySpots'
  );


const nearbySpotsList =
  document.getElementById(
    'nearbySpotsList'
  );


/* =========================================================
   ELEMENTOS DE INFORMACIÓN
   ========================================================= */

const infoNum =
  document.getElementById(
    'infoNum'
  );


const infoCount =
  document.getElementById(
    'infoCount'
  );


const infoName =
  document.getElementById(
    'infoName'
  );


const infoLocation =
  document.getElementById(
    'infoLocation'
  );


const infoDescription =
  document.getElementById(
    'infoDescription'
  );


const image =
  document.getElementById(
    'spotImg'
  );

/* =========================================================
   VÍDEO + COMUNIDAD · PHOTO SPOT
   ========================================================= */

const spotVideoBtn =
  document.getElementById('spotVideoBtn');

const videoModal =
  document.getElementById('videoModal');

const closeVideoModal =
  document.getElementById('closeVideoModal');

const spotVideoFrame =
  document.getElementById('spotVideoFrame');

const videoModalTitle =
  document.getElementById('videoModalTitle');

const communityForm =
  document.getElementById('communityForm');

const communityName =
  document.getElementById('communityName');

const communityComment =
  document.getElementById('communityComment');

const communityPhoto =
  document.getElementById('communityPhoto');

const communityPhotoName =
  document.getElementById('communityPhotoName');

const communityStatus =
  document.getElementById('communityStatus');

const communityPosts =
  document.getElementById('communityPosts');

const communityPostCount =
  document.getElementById('communityPostCount');

const ratingStars =
  document.querySelectorAll('#ratingStars button');

const ratingSummary =
  document.getElementById('ratingSummary');

let pendingCommunityPhoto = '';

let currentCommunityRating = 0;


/* ---------------------------------------------------------
   SEGURIDAD
   --------------------------------------------------------- */

function escapeCommunityHTML(value) {

  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


/* ---------------------------------------------------------
   YOUTUBE
   --------------------------------------------------------- */

function getYoutubeEmbedUrl(url) {

  if (!url) {
    return '';
  }

  try {

    const parsed =
      new URL(url);

    let id = '';

    if (
      parsed.hostname.includes('youtu.be')
    ) {

      id =
        parsed.pathname.replace('/', '');

    }

    else if (
      parsed.searchParams.get('v')
    ) {

      id =
        parsed.searchParams.get('v');

    }

    else if (
      parsed.pathname.includes('/embed/')
    ) {

      id =
        parsed.pathname.split('/embed/')[1];

    }

    if (!id) {
      return '';
    }

    return `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;

  }

  catch (error) {

    return '';

  }

}


/* ---------------------------------------------------------
   ABRIR / CERRAR VÍDEO
   --------------------------------------------------------- */

function openSpotVideo() {

  const spot =
    spots[currentSpotIndex];

  if (!spot) {
    return;
  }

  const embedUrl =
    getYoutubeEmbedUrl(
      spot.youtubeUrl
    );

  if (!embedUrl) {

    if (communityStatus) {

      communityStatus.textContent =
        'ℹ️ Este Photo Spot todavía no tiene vídeo asociado.';

    }

    return;

  }

  if (spotVideoFrame) {

    spotVideoFrame.src =
      embedUrl;

  }

  if (videoModalTitle) {

    videoModalTitle.textContent =
      `${String(spot.id).padStart(2, '0')} · ${spot.name}`;

  }

  if (videoModal) {

    videoModal.hidden =
      false;

  }

}


function closeSpotVideo() {

  if (spotVideoFrame) {

    spotVideoFrame.src =
      '';

  }

  if (videoModal) {

    videoModal.hidden =
      true;

  }

}


if (spotVideoBtn) {

  spotVideoBtn.addEventListener(
    'click',
    openSpotVideo
  );

}


if (closeVideoModal) {

  closeVideoModal.addEventListener(
    'click',
    closeSpotVideo
  );

}


document
  .querySelectorAll('[data-close-video]')
  .forEach(
    element => {

      element.addEventListener(
        'click',
        closeSpotVideo
      );

    }
  );


document.addEventListener(
  'keydown',
  event => {

    if (
      event.key === 'Escape' &&
      videoModal &&
      !videoModal.hidden
    ) {

      closeSpotVideo();

    }

  }
);


/* ---------------------------------------------------------
   COMUNIDAD · ALMACENAMIENTO LOCAL
   --------------------------------------------------------- */

function communityStorageKey(spotId) {

  return `grandtour_suiza_community_${spotId}`;

}


function readCommunityData(spotId) {

  try {

    const raw =
      localStorage.getItem(
        communityStorageKey(spotId)
      );

    if (!raw) {

      return {
        ratings: [],
        posts: []
      };

    }

    const data =
      JSON.parse(raw);

    return {

      ratings:
        Array.isArray(data.ratings)
          ? data.ratings
          : [],

      posts:
        Array.isArray(data.posts)
          ? data.posts
          : []

    };

  }

  catch (error) {

    return {
      ratings: [],
      posts: []
    };

  }

}


function saveCommunityData(
  spotId,
  data
) {

  localStorage.setItem(

    communityStorageKey(
      spotId
    ),

    JSON.stringify(data)

  );

}


/* ---------------------------------------------------------
   VALORACIÓN
   --------------------------------------------------------- */

function renderRating(
  data
) {

  const ratings =
    data.ratings || [];

  const average =
    ratings.length
      ? ratings.reduce(
          (sum, value) =>
            sum + Number(value),
          0
        ) / ratings.length
      : 0;

  ratingStars.forEach(
    button => {

      const value =
        Number(
          button.dataset.rating
        );

      button.classList.toggle(
        'active',
        value <= currentCommunityRating
      );

    }
  );

  if (!ratingSummary) {
    return;
  }

  if (!ratings.length) {

    ratingSummary.textContent =
      'Sé el primero en valorar este lugar.';

    return;

  }

  ratingSummary.textContent =
    `⭐ ${average.toFixed(1)}/5 · ${ratings.length} valoración${ratings.length === 1 ? '' : 'es'}`;

}


ratingStars.forEach(
  button => {

    button.addEventListener(
      'click',
      () => {

        const spot =
          spots[currentSpotIndex];

        if (!spot) {
          return;
        }

        const value =
          Number(
            button.dataset.rating
          );

        const data =
          readCommunityData(
            spot.id
          );

        data.ratings.push(
          value
        );

        currentCommunityRating =
          value;

        saveCommunityData(
          spot.id,
          data
        );

        renderRating(
          data
        );

      }
    );

  }
);


/* ---------------------------------------------------------
   FOTO SELECCIONADA
   --------------------------------------------------------- */

if (communityPhoto) {

  communityPhoto.addEventListener(
    'change',
    event => {

      const file =
        event.target.files &&
        event.target.files[0];

      pendingCommunityPhoto =
        '';

      if (!file) {

        if (communityPhotoName) {

          communityPhotoName.textContent =
            'Ninguna foto seleccionada';

        }

        return;

      }

      if (
        !file.type.startsWith('image/')
      ) {

        event.target.value =
          '';

        if (communityPhotoName) {

          communityPhotoName.textContent =
            'Selecciona una imagen válida.';

        }

        return;

      }

      if (file.size > 2 * 1024 * 1024) {

        event.target.value =
          '';

        if (communityPhotoName) {

          communityPhotoName.textContent =
            'La foto debe pesar menos de 2 MB.';

        }

        return;

      }

      if (communityPhotoName) {

        communityPhotoName.textContent =
          file.name;

      }

      const reader =
        new FileReader();

      reader.onload =
        () => {

          pendingCommunityPhoto =
            reader.result;

        };

      reader.readAsDataURL(
        file
      );

    }
  );

}


/* ---------------------------------------------------------
   RENDERIZAR EXPERIENCIAS
   --------------------------------------------------------- */

function renderCommunityPosts(
  data
) {

  if (!communityPosts) {
    return;
  }

  const posts =
    data.posts || [];

  if (communityPostCount) {

    communityPostCount.textContent =
      posts.length;

  }

  if (!posts.length) {

    communityPosts.innerHTML = `

      <div class="communityEmpty">

        Todavía no hay experiencias.
        ¡Sé la primera persona en compartir
        una foto y un comentario!

      </div>

    `;

    return;

  }

  communityPosts.innerHTML =
    posts
      .slice()
      .reverse()
      .map(
        post => {

          const safeName =
            escapeCommunityHTML(
              post.name ||
              'Viajero/a'
            );

          const safeText =
            escapeCommunityHTML(
              post.text
            );

          const stars =
            '★'.repeat(
              Math.max(
                0,
                Math.min(
                  5,
                  Number(post.rating) || 0
                )
              )
            );

          const date =
            escapeCommunityHTML(
              post.date ||
              ''
            );

          return `

            <article class="communityPost">

              <div class="communityPostTop">

                <span class="communityPostName">
                  ${safeName}
                </span>

                <span class="communityPostStars">
                  ${stars || '—'}
                </span>

              </div>

              <div class="communityPostDate">
                ${date}
              </div>

              <p class="communityPostText">
                ${safeText}
              </p>

              ${
                post.image
                  ? `
                    <img
                      class="communityPostImage"
                      src="${post.image}"
                      alt="Foto compartida por ${safeName}"
                      loading="lazy"
                    >
                  `
                  : ''
              }

              <button
                type="button"
                class="communityPostDelete"
                data-community-delete="${escapeCommunityHTML(post.id)}"
                aria-label="Eliminar experiencia"
              >🗑️ ELIMINAR</button>

            </article>

          `;

        }
      )
      .join('');


}


/* ---------------------------------------------------------
   VISOR GRANDE DE FOTOS DE LA COMUNIDAD
   --------------------------------------------------------- */

let communityImageModal = null;
let communityImageModalImage = null;

function ensureCommunityImageModal() {

  if (communityImageModal) {
    return;
  }

  communityImageModal =
    document.createElement('div');

  communityImageModal.className =
    'communityImageModal';

  communityImageModal.hidden =
    true;

  communityImageModal.setAttribute(
    'role',
    'dialog'
  );

  communityImageModal.setAttribute(
    'aria-modal',
    'true'
  );

  communityImageModal.setAttribute(
    'aria-label',
    'Foto ampliada'
  );

  communityImageModal.innerHTML = `
    <div class="communityImageModalContent">
      <button
        type="button"
        class="communityImageModalClose"
        aria-label="Cerrar foto"
      >×</button>

      <img
        src=""
        alt="Foto ampliada"
      >
    </div>
  `;

  document.body.appendChild(
    communityImageModal
  );

  communityImageModalImage =
    communityImageModal.querySelector(
      'img'
    );

  const closeButton =
    communityImageModal.querySelector(
      '.communityImageModalClose'
    );

  closeButton.addEventListener(
    'click',
    closeCommunityImageModal
  );

  communityImageModal.addEventListener(
    'click',
    event => {

      if (
        event.target ===
        communityImageModal
      ) {

        closeCommunityImageModal();

      }

    }
  );

}


function openCommunityImageModal(
  image
) {

  if (!image) {
    return;
  }

  ensureCommunityImageModal();

  communityImageModalImage.src =
    image.currentSrc ||
    image.src;

  communityImageModalImage.alt =
    image.alt ||
    'Foto ampliada';

  communityImageModal.hidden =
    false;

  document.body.style.overflow =
    'hidden';

}


function closeCommunityImageModal() {

  if (!communityImageModal) {
    return;
  }

  communityImageModal.hidden =
    true;

  if (communityImageModalImage) {

    communityImageModalImage.src =
      '';

  }

  document.body.style.overflow =
    '';

}


if (communityPosts) {

  communityPosts.addEventListener(
    'click',
    event => {

      const image =
        event.target.closest(
          '.communityPostImage'
        );

      if (!image) {
        return;
      }

      openCommunityImageModal(
        image
      );

    }
  );

}


document.addEventListener(
  'keydown',
  event => {

    if (
      event.key === 'Escape' &&
      communityImageModal &&
      !communityImageModal.hidden
    ) {

      closeCommunityImageModal();

    }

  }
);


/* ---------------------------------------------------------
   ELIMINAR EXPERIENCIA
   --------------------------------------------------------- */

if (communityPosts) {

  communityPosts.addEventListener(
    'click',
    event => {

      const deleteButton =
        event.target.closest(
          '.communityPostDelete'
        );

      if (!deleteButton) {
        return;
      }

      const postId =
        deleteButton.dataset.communityDelete;

      if (!postId) {
        return;
      }

      const confirmed =
        window.confirm(
          '¿Seguro que quieres eliminar esta experiencia?'
        );

      if (!confirmed) {
        return;
      }

      const spot =
        spots[currentSpotIndex];

      if (!spot) {
        return;
      }

      const data =
        readCommunityData(
          spot.id
        );

      data.posts =
        (data.posts || [])
          .filter(
            post =>
              String(post.id) !==
              String(postId)
          );

      saveCommunityData(
        spot.id,
        data
      );

      renderRating(
        data
      );

      renderCommunityPosts(
        data
      );

      if (communityStatus) {
        communityStatus.textContent =
          '✅ La experiencia se ha eliminado en este navegador.';
      }

    }
  );

}


/* ---------------------------------------------------------
   CAMBIAR DE PHOTO SPOT
   --------------------------------------------------------- */

function updateCommunityForSpot(
  spot
) {

  if (!spot) {
    return;
  }

  const data =
    readCommunityData(
      spot.id
    );

  currentCommunityRating =
    0;

  if (communityForm) {
    communityForm.reset();
  }

  pendingCommunityPhoto =
    '';

  if (communityPhotoName) {

    communityPhotoName.textContent =
      'Ninguna foto seleccionada';

  }

  if (communityStatus) {

    communityStatus.textContent =
      '';

  }

  renderRating(
    data
  );

  renderCommunityPosts(
    data
  );

  if (spotVideoBtn) {

    const hasVideo =
      Boolean(
        getYoutubeEmbedUrl(
          spot.youtubeUrl
        )
      );

    spotVideoBtn.disabled =
      !hasVideo;

    spotVideoBtn.textContent =
      hasVideo
        ? '▶️ VER VÍDEO DEL GRAND TOUR DE SUIZA'
        : '▶️ VÍDEO NO DISPONIBLE';

  }

}


if (communityForm) {

  communityForm.addEventListener(
    'submit',
    event => {

      event.preventDefault();

      const spot =
        spots[currentSpotIndex];

      if (!spot) {
        return;
      }

      const text =
        communityComment
          ? communityComment.value.trim()
          : '';

      if (!text) {

        if (communityStatus) {

          communityStatus.textContent =
            'Escribe tu experiencia antes de publicar.';

        }

        return;

      }

      const name =
        communityName &&
        communityName.value.trim()
          ? communityName.value.trim()
          : 'Viajero/a';

      const data =
        readCommunityData(
          spot.id
        );

      data.posts.push({

        id:
          `${Date.now()}_${Math.random().toString(36).slice(2)}`,

        name:
          name.slice(0, 40),

        text:
          text.slice(0, 500),

        rating:
          currentCommunityRating,

        image:
          pendingCommunityPhoto || '',

        date:
          new Date().toLocaleDateString(
            'es-ES'
          )

      });

      saveCommunityData(
        spot.id,
        data
      );

      renderRating(
        data
      );

      renderCommunityPosts(
        data
      );

      if (communityForm) {
        communityForm.reset();
      }

      pendingCommunityPhoto =
        '';

      if (communityPhotoName) {

        communityPhotoName.textContent =
          'Ninguna foto seleccionada';

      }

      if (communityStatus) {

        communityStatus.textContent =
          '✅ Tu experiencia se ha publicado en este navegador.';

      }

    }
  );

}



/* =========================================================
   MOVIMIENTO DE HERNÁN
   ========================================================= */

function moveHernan(
  to,
  duration = 950
) {

  const from =
    hernan.getLatLng();

  const start =
    performance.now();

  const element =
    hernan.getElement();


  if (element) {

    element.classList.add(
      'moving'
    );

  }


  function frame(now) {

    const progress =
      Math.min(

        1,

        (now - start) /
        duration

      );


    const eased =

      progress < 0.5

        ?

        2 *
        progress *
        progress

        :

        1 -

        Math.pow(

          -2 *
          progress +
          2,

          2

        ) / 2;


    const lat =

      from.lat +

      (
        to[0] -
        from.lat
      ) *

      eased;


    const lng =

      from.lng +

      (
        to[1] -
        from.lng
      ) *

      eased;


    hernan.setLatLng(

      [
        lat,
        lng
      ]

    );


    if (
      progress < 1
    ) {

      requestAnimationFrame(
        frame
      );

    }

    else if (element) {

      element.classList.remove(
        'moving'
      );

    }

  }


  requestAnimationFrame(
    frame
  );

}


/* =========================================================
   SELECCIONAR PHOTO SPOT
   ========================================================= */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function selectSpot(
  id,
  fly = true
) {

  const spot =
    spots.find(
      s =>
        s.id === id
    );


  if (!spot) {

    return;

  }


  const index =
    spots.findIndex(
      s =>
        s.id === id
    );


  currentSpotIndex =
    index;


  selectedSpotForGPS =
    spot;


  /* =======================================================
     MARCADORES
     ======================================================= */

  markers.forEach(

    (marker, markerIndex) => {

      marker.setIcon(

        markerIcon(

          markerIndex + 1,

          markerIndex === index

        )

      );

    }

  );


  /* =======================================================
     HERNÁN
     ======================================================= */

  moveHernan(

    [
      spot.lat,
      spot.lng
    ]

  );


  /* =======================================================
     MAPA
     ======================================================= */

  if (fly) {

    map.flyTo(

      [
        spot.lat,
        spot.lng
      ],

      Math.max(
        map.getZoom(),
        8
      ),

      {

        duration:
          0.85

      }

    );

  }


  /* =======================================================
     INFORMACIÓN
     ======================================================= */

  if (infoNum) {

    infoNum.textContent =
      String(id).padStart(
        2,
        '0'
      );

  }


  if (infoCount) {

    infoCount.textContent =

      `${String(id).padStart(2, '0')}/92`;

  }


  /*
   * INFORMACIÓN DEL PHOTO SPOT
   *
   * spots.js conserva coordenadas, imágenes y funcionamiento.
   * photo-spots-info.js aporta la información editorial
   * manteniendo el orden 01–92 del Grand Tour.
   */
  const spotInfo =
    photoSpotsInfo.find(
      item =>
        Number(item.id) === Number(spot.id)
    );


  if (infoName) {

    infoName.textContent =
      spot.name;

  }


  if (infoLocation) {

    infoLocation.textContent =
      `📍 ${spotInfo?.location || 'Suiza'}`;

  }


  if (infoDescription) {

    infoDescription.textContent =
      spotInfo?.description ||
      `Photo Spot ${String(id).padStart(2, '0')} del Grand Tour de Suiza. Selecciona el marcador para seguir el recorrido y mover a Hernán hasta este lugar.`;

  }

  const practical = document.getElementById('spotPracticalInfo');
  if (practical) {
    const fields = [
      ['📍 DIRECCIÓN', spotInfo?.address],
      ['🅿️ PARKING', spotInfo?.parking],
      ['🚗 CÓMO LLEGAR', spotInfo?.howToGetThere],
      ['🥾 SENDERO / TRAYECTO', spotInfo?.trail],
      ['ℹ️ NOTA', spotInfo?.note]
    ];
    practical.innerHTML = fields.map(([label, value]) => `
      <div class="spotPracticalItem">
        <div class="spotPracticalLabel">${escapeHtml(label)}</div>
        <div class="spotPracticalText">${escapeHtml(value || '')}</div>
      </div>`).join('');
  }


  /* =======================================================
     IMAGEN
     ======================================================= */

  currentPhotoIndex =
    0;


  if (image) {

    image.src =
      spotImagePath(
        spot.id
      );

    image.alt =
      `Photo Spot ${String(id).padStart(2, '0')} · ${spot.name}`;

  }


  /* =======================================================
     VÍDEO
     La imagen ya no abre enlaces externos.
     El vídeo se controla con el botón de nuestra página.
     ======================================================= */

  image.onclick = null;
  image.onkeydown = null;
  image.style.cursor = '';
  image.removeAttribute('title');
  image.removeAttribute('role');
  image.removeAttribute('tabindex');

  updateCommunityForSpot(spot);
  /* =======================================================
     CARRUSEL
     ======================================================= */

  document
    .querySelectorAll(
      '.thumb'
    )
    .forEach(

      (element, j) => {

        element.classList.toggle(

          'sel',

          j === index

        );

      }

    );


  /* =======================================================
     LISTA
     ======================================================= */

  document
    .querySelectorAll(
      '#spotList button'
    )
    .forEach(

      (element, j) => {

        element.classList.toggle(

          'sel',

          j === index

        );

      }

    );


  /* =======================================================
     CENTRAR CARRUSEL
     ======================================================= */

  document
    .querySelector(
      '.thumb.sel'
    )
    ?.scrollIntoView({

      behavior:
        'smooth',

      block:
        'nearest',

      inline:
        'center'

    });


  /* =======================================================
     DISTANCIA GPS
     ======================================================= */

  updateSelectedSpotDistance();

}


/* =========================================================
   GPS · RADIANES
   ========================================================= */

function toRadians(
  degrees
) {

  return (

    degrees *
    Math.PI /
    180

  );

}


/* =========================================================
   GPS · DISTANCIA HAVERSINE
   ========================================================= */

function calculateDistanceKm(

  lat1,
  lng1,
  lat2,
  lng2

) {

  const earthRadius =
    6371;


  const dLat =
    toRadians(
      lat2 - lat1
    );


  const dLng =
    toRadians(
      lng2 - lng1
    );


  const a =

    Math.sin(
      dLat / 2
    ) ** 2

    +

    Math.cos(
      toRadians(
        lat1
      )
    )

    *

    Math.cos(
      toRadians(
        lat2
      )
    )

    *

    Math.sin(
      dLng / 2
    ) ** 2;


  const c =

    2 *

    Math.atan2(

      Math.sqrt(a),

      Math.sqrt(
        1 - a
      )

    );


  return (

    earthRadius *
    c

  );

}


/* =========================================================
   GPS · FORMATO DISTANCIA
   ========================================================= */

function formatGPSDistance(
  distanceKm
) {

  if (
    distanceKm < 1
  ) {

    return (

      Math.round(
        distanceKm * 1000
      )

      +

      ' m'

    );

  }


  return (

    distanceKm.toFixed(1)

    +

    ' km'

  );

}


/* =========================================================
   GPS · MARCADOR DEL USUARIO
   ========================================================= */

function updateUserMarker(

  latitude,
  longitude,
  accuracy

) {

  const position = [

    latitude,
    longitude

  ];


  if (
    userLocationMarker
  ) {

    userLocationMarker.setLatLng(
      position
    );

  }

  else {

    userLocationMarker =

      L.circleMarker(

        position,

        {

          radius:
            8,

          color:
            '#ffffff',

          weight:
            3,

          fillColor:
            '#1976ff',

          fillOpacity:
            1,

          interactive:
            false

        }

      ).addTo(
        map
      );

  }


  if (
    userAccuracyCircle
  ) {

    userAccuracyCircle.setLatLng(
      position
    );

    userAccuracyCircle.setRadius(
      accuracy
    );

  }

  else {

    userAccuracyCircle =

      L.circle(

        position,

        {

          radius:
            accuracy,

          color:
            '#1976ff',

          weight:
            1,

          fillColor:
            '#1976ff',

          fillOpacity:
            0.08,

          interactive:
            false

        }

      ).addTo(
        map
      );

  }

}


/* =========================================================
   GPS · POSICIÓN
   ========================================================= */

function handlePosition(
  position
) {

  const latitude =
    position.coords.latitude;


  const longitude =
    position.coords.longitude;


  const accuracy =
    position.coords.accuracy;


  userLocation = {

    lat:
      latitude,

    lng:
      longitude,

    accuracy:
      accuracy

  };


  updateUserMarker(

    latitude,

    longitude,

    accuracy

  );


  if (
    locationStatus
  ) {

    locationStatus.classList.add(
      'active'
    );

  }


  if (
    locationText
  ) {

    locationText.textContent =
      'Ubicación activada';

  }


  if (
    locateMeBtn
  ) {

    locateMeBtn.textContent =
      '📍 ACTUALIZAR MI UBICACIÓN';

  }


  updateSelectedSpotDistance();

  updateNearbySpots();

}


/* =========================================================
   GPS · ERRORES
   ========================================================= */

function handleLocationError(
  error
) {

  if (
    !locationText
  ) {

    return;

  }


  switch (
    error.code
  ) {

    case 1:

      locationText.textContent =
        'Permiso de ubicación denegado.';

      break;


    case 2:

      locationText.textContent =
        'No se pudo obtener tu ubicación.';

      break;


    case 3:

      locationText.textContent =
        'La búsqueda de ubicación tardó demasiado.';

      break;


    default:

      locationText.textContent =
        'No se pudo obtener tu ubicación.';

  }


  if (
    locationStatus
  ) {

    locationStatus.classList.remove(
      'active'
    );

  }


  if (
    locateMeBtn
  ) {

    locateMeBtn.disabled =
      false;

  }

}


/* =========================================================
   GPS · ACTIVAR
   ========================================================= */

function startGPS() {

  if (
    !navigator.geolocation
  ) {

    if (
      locationText
    ) {

      locationText.textContent =
        'Tu navegador no permite geolocalización.';

    }

    return;

  }


  if (
    locationText
  ) {

    locationText.textContent =
      'Buscando tu ubicación...';

  }


  if (
    locateMeBtn
  ) {

    locateMeBtn.disabled =
      true;

  }


  navigator.geolocation.getCurrentPosition(

    position => {

      handlePosition(
        position
      );


      if (
        locateMeBtn
      ) {

        locateMeBtn.disabled =
          false;

      }

    },

    error => {

      handleLocationError(
        error
      );

    },

    {

      enableHighAccuracy:
        true,

      timeout:
        15000,

      maximumAge:
        5000

    }

  );


  if (
    gpsWatchId !== null
  ) {

    navigator.geolocation.clearWatch(
      gpsWatchId
    );

  }


  gpsWatchId =

    navigator.geolocation.watchPosition(

      position => {

        handlePosition(
          position
        );

      },

      error => {

        console.warn(
          'GPS:',
          error.message
        );

      },

      {

        enableHighAccuracy:
          true,

        maximumAge:
          3000,

        timeout:
          15000

      }

    );

}


/* =========================================================
   GPS · DISTANCIA AL SPOT ACTUAL
   ========================================================= */

function updateSelectedSpotDistance() {

  if (
    !userLocation
  ) {

    return;

  }


  if (
    !selectedSpotForGPS
  ) {

    return;

  }


  const distance =

    calculateDistanceKm(

      userLocation.lat,

      userLocation.lng,

      selectedSpotForGPS.lat,

      selectedSpotForGPS.lng

    );


  if (
    distanceValue
  ) {

    distanceValue.textContent =

      formatGPSDistance(
        distance
      );

  }


  if (
    distanceBox
  ) {

    distanceBox.hidden =
      false;

  }


  if (
    navigationBtn
  ) {

    navigationBtn.hidden =
      false;

  }

}


/* =========================================================
   GPS · PHOTO SPOTS CERCANOS
   ========================================================= */

function updateNearbySpots() {

  if (
    !userLocation
  ) {

    return;

  }


  if (
    !Array.isArray(
      spots
    )
  ) {

    return;

  }


  const nearest =

    spots

      .map(
        spot => {

          const distance =

            calculateDistanceKm(

              userLocation.lat,

              userLocation.lng,

              spot.lat,

              spot.lng

            );


          return {

            spot:
              spot,

            distance:
              distance

          };

        }

      )

      .sort(

        (a, b) =>

          a.distance -
          b.distance

      )

      .slice(
        0,
        5
      );


  if (
    !nearbySpotsList
  ) {

    return;

  }


  nearbySpotsList.innerHTML =
    '';


  nearest.forEach(
    item => {

      const button =
        document.createElement(
          'button'
        );


      button.type =
        'button';


      button.className =
        'nearbySpotItem';


      button.innerHTML = `

        <span
          class="nearbySpotName"
        >

          📸 ${item.spot.name}

        </span>


        <span
          class="nearbySpotDistance"
        >

          ${formatGPSDistance(
            item.distance
          )}

        </span>

      `;


      button.addEventListener(
        'click',
        () => {

          selectSpot(
            item.spot.id,
            true
          );

        }
      );


      nearbySpotsList.appendChild(
        button
      );

    }
  );


  if (
    nearbySpots
  ) {

    nearbySpots.hidden =
      false;

  }

}


/* =========================================================
   GPS · ABRIR CÓMO LLEGAR
   ========================================================= */

function openGPSNavigation() {

  if (
    !selectedSpotForGPS
  ) {

    return;

  }


  const destination =

    `${selectedSpotForGPS.lat},${selectedSpotForGPS.lng}`;


  let url;


  if (
    userLocation
  ) {

    const origin =

      `${userLocation.lat},${userLocation.lng}`;


    url =

      'https://www.google.com/maps/dir/?api=1'

      +

      '&origin='

      +

      encodeURIComponent(
        origin
      )

      +

      '&destination='

      +

      encodeURIComponent(
        destination
      )

      +

      '&travelmode=driving';

  }

  else {

    url =

      'https://www.google.com/maps/dir/?api=1'

      +

      '&destination='

      +

      encodeURIComponent(
        destination
      )

      +

      '&travelmode=driving';

  }


  window.open(
    url,
    '_blank'
  );

}


/* =========================================================
   GPS · BOTÓN UBICACIÓN
   ========================================================= */

if (
  locateMeBtn
) {

  locateMeBtn.addEventListener(
    'click',
    startGPS
  );

}


/* =========================================================
   GPS · BOTÓN CÓMO LLEGAR
   ========================================================= */

if (
  navigationBtn
) {

  navigationBtn.addEventListener(
    'click',
    openGPSNavigation
  );

}


/* =========================================================
   CONSTRUIR LISTA Y CARRUSEL
   ========================================================= */

function buildUI() {

  const list =
    document.getElementById(
      'spotList'
    );


  const carousel =
    document.getElementById(
      'carousel'
    );


  if (
    !list ||
    !carousel
  ) {

    console.error(
      'No se encontró la lista o el carrusel.'
    );

    return;

  }


  list.innerHTML =
    '';


  carousel.innerHTML =
    '';


  spots.forEach(
    spot => {


      /* ===================================================
         LISTA
         =================================================== */

      const button =
        document.createElement(
          'button'
        );


      button.dataset.name =
        spot.name.toLowerCase();


      button.innerHTML = `

        <em>
          ${String(spot.id).padStart(2, '0')}
        </em>

        <span>
          ${spot.name}
        </span>

      `;


      button.onclick =
        () => {

          selectSpot(
            spot.id,
            true
          );

        };


      list.appendChild(
        button
      );


      /* ===================================================
         CARRUSEL
         =================================================== */

      const thumb =
        document.createElement(
          'div'
        );


      thumb.className =
        'thumb';


      thumb.innerHTML = `

        <img
          src="${spotImagePath(spot.id)}"
          alt="${spot.name}"
          loading="lazy"
        >

        <b>
          ${String(spot.id).padStart(2, '0')}
        </b>

        <small>
          ${spot.name}
        </small>

      `;


      thumb.onclick =
        () => {

          selectSpot(
            spot.id,
            true
          );

        };


      carousel.appendChild(
        thumb
      );

    }
  );

}


/* =========================================================
   BUSCADOR
   ========================================================= */

function filterList(
  value
) {

  const query =
    value
      .trim()
      .toLowerCase();


  document
    .querySelectorAll(
      '#spotList button'
    )
    .forEach(
      button => {

        button.style.display =

          button.dataset.name
            .includes(
              query
            )

            ? 'grid'

            : 'none';

      }
    );

}


const search =
  document.getElementById(
    'search'
  );


if (
  search
) {

  search.addEventListener(
    'input',
    event => {

      filterList(
        event.target.value
      );

    }
  );

}


const topSearch =
  document.getElementById(
    'topSearch'
  );


if (
  topSearch
) {

  topSearch.addEventListener(
    'input',
    event => {

      filterList(
        event.target.value
      );

    }
  );

}


/* =========================================================
   PHOTO SPOT ACTUAL
   ========================================================= */

function currentId() {

  const element =
    document.getElementById(
      'infoNum'
    );


  if (
    !element
  ) {

    return 1;

  }


  return Number(
    element.textContent
  ) || 1;

}


/* =========================================================
   SIGUIENTE
   ========================================================= */

function goNext() {

  const id =
    currentId();


  selectSpot(

    id === 92
      ? 1
      : id + 1,

    true

  );

}


/* =========================================================
   ANTERIOR
   ========================================================= */

function goPrevious() {

  const id =
    currentId();


  selectSpot(

    id === 1
      ? 92
      : id - 1,

    true

  );

}


/* =========================================================
   BOTÓN SIGUIENTE
   ========================================================= */

const nextButton =
  document.getElementById(
    'next'
  );


if (
  nextButton
) {

  nextButton.onclick =
    goNext;

}


/* =========================================================
   CARRUSEL SIGUIENTE
   ========================================================= */

const carouselNext =
  document.getElementById(
    'carouselNext'
  );


if (
  carouselNext
) {

  carouselNext.onclick =
    goNext;

}


/* =========================================================
   CARRUSEL ANTERIOR
   ========================================================= */

const carouselPrev =
  document.getElementById(
    'carouselPrev'
  );


if (
  carouselPrev
) {

  carouselPrev.onclick =
    goPrevious;

}


/* =========================================================
   FOTO SIGUIENTE
   ========================================================= */

const photoNext =
  document.getElementById(
    'photoNext'
  );


if (
  photoNext
) {

  photoNext.onclick =
    goNext;

}


/* =========================================================
   FOTO ANTERIOR
   ========================================================= */

const photoPrev =
  document.getElementById(
    'photoPrev'
  );


if (
  photoPrev
) {

  photoPrev.onclick =
    goPrevious;

}


/* =========================================================
   BOTÓN CERRAR
   ========================================================= */

const closeInfo =
  document.querySelector(
    '.closeInfo'
  );


if (
  closeInfo
) {

  closeInfo.onclick =
    () => {

      const infoScroll =
        document.querySelector(
          '.infoScroll'
        );


      if (
        infoScroll
      ) {

        infoScroll.scrollTo({

          top:
            0,

          behavior:
            'smooth'

        });

      }

    };

}


/* =========================================================
   INICIAR INTERFAZ
   ========================================================= */

buildUI();


/* =========================================================
   PHOTO SPOT INICIAL
   ========================================================= */

if (
  spots &&
  spots.length > 0
) {

  selectedSpotForGPS =
    spots[0];


  selectSpot(
    1,
    false
  );

}


/* =========================================================
   SCROLL INICIAL
   ========================================================= */

document.addEventListener(

  'DOMContentLoaded',

  () => {

    const sideScroll =
      document.querySelector(
        '.sideScroll'
      );


    if (
      sideScroll
    ) {

      sideScroll.scrollTop =
        0;

    }

  }

);


/* =========================================================
   FIN
   ========================================================= */

   /* =========================================================
   FASE 2 · RUTAS REALES DENTRO DEL MAPA
   ========================================================= */


/* =========================================================
   VARIABLES DE RUTA
   ========================================================= */

let currentRouteLayer = null;

let routeRequestController = null;

let currentRouteProfile = 'driving';


/* =========================================================
   ELEMENTOS DE LA RUTA
   ========================================================= */

let routeInfoPanel = null;

let routeDistanceElement = null;

let routeDurationElement = null;

let routeStatusElement = null;

let routeClearButton = null;


/* =========================================================
   CREAR PANEL DE RUTA
   Lo añadimos dinámicamente para no tener que modificar
   otra vez el HTML.
   ========================================================= */

function createRoutePanel() {

  if (
    document.getElementById(
      'routePanel'
    )
  ) {

    routeInfoPanel =
      document.getElementById(
        'routePanel'
      );

    routeDistanceElement =
      document.getElementById(
        'routeDistance'
      );

    routeDurationElement =
      document.getElementById(
        'routeDuration'
      );

    routeStatusElement =
      document.getElementById(
        'routeStatus'
      );

    routeClearButton =
      document.getElementById(
        'routeClear'
      );

    return;

  }


  routeInfoPanel =
    document.createElement(
      'div'
    );


  routeInfoPanel.id =
    'routePanel';


  routeInfoPanel.innerHTML = `

    <div class="routePanelHeader">

      <div>

        <small>
          🧭 NAVEGACIÓN
        </small>

        <strong>
          RUTA AL PHOTO SPOT
        </strong>

      </div>

      <button
        id="routeClear"
        type="button"
        aria-label="Cerrar ruta"
      >
        ×
      </button>

    </div>


    <div
      id="routeStatus"
      class="routeStatus"
    >
      Preparando ruta...
    </div>


    <div class="routeStats">

      <div>

        <span>
          📏 DISTANCIA
        </span>

        <strong id="routeDistance">
          —
        </strong>

      </div>


      <div>

        <span>
          ⏱️ TIEMPO
        </span>

        <strong id="routeDuration">
          —
        </strong>

      </div>

    </div>


    <div class="routeMode">

      <button
        type="button"
        class="routeModeButton active"
        data-profile="driving"
      >
        🚗 COCHE
      </button>

    </div>

  `;


  document.body.appendChild(
    routeInfoPanel
  );


  routeDistanceElement =
    document.getElementById(
      'routeDistance'
    );


  routeDurationElement =
    document.getElementById(
      'routeDuration'
    );


  routeStatusElement =
    document.getElementById(
      'routeStatus'
    );


  routeClearButton =
    document.getElementById(
      'routeClear'
    );


  if (
    routeClearButton
  ) {

    routeClearButton.addEventListener(
      'click',
      clearRoute
    );

  }


  document
    .querySelectorAll(
      '.routeModeButton'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          () => {

            document
              .querySelectorAll(
                '.routeModeButton'
              )
              .forEach(
                item => {

                  item.classList.remove(
                    'active'
                  );

                }
              );


            button.classList.add(
              'active'
            );


            currentRouteProfile =
              button.dataset.profile;


            calculateRealRoute();

          }
        );

      }
    );

}


/* =========================================================
   FORMATEAR DISTANCIA REAL
   ========================================================= */

function formatRouteDistance(
  meters
) {

  if (
    meters < 1000
  ) {

    return (

      Math.round(
        meters
      )

      +

      ' m'

    );

  }


  return (

    (
      meters / 1000
    ).toFixed(
      1
    )

    +

    ' km'

  );

}


/* =========================================================
   FORMATEAR TIEMPO
   ========================================================= */

function formatRouteDuration(
  seconds
) {

  const totalMinutes =
    Math.round(
      seconds / 60
    );


  if (
    totalMinutes < 60
  ) {

    return (

      totalMinutes

      +

      ' min'

    );

  }


  const hours =
    Math.floor(
      totalMinutes / 60
    );


  const minutes =
    totalMinutes % 60;


  if (
    minutes === 0
  ) {

    return (

      hours

      +

      ' h'

    );

  }


  return (

    hours

    +

    ' h '

    +

    minutes

    +

    ' min'

  );

}


/* =========================================================
   BORRAR RUTA
   ========================================================= */

function clearRoute() {

  if (
    currentRouteLayer
  ) {

    map.removeLayer(
      currentRouteLayer
    );

    currentRouteLayer =
      null;

  }


  if (
    routeInfoPanel
  ) {

    routeInfoPanel.classList.remove(
      'visible'
    );

  }


  if (
    routeDistanceElement
  ) {

    routeDistanceElement.textContent =
      '—';

  }


  if (
    routeDurationElement
  ) {

    routeDurationElement.textContent =
      '—';

  }


  if (
    routeStatusElement
  ) {

    routeStatusElement.textContent =
      '';

  }

}


/* =========================================================
   MOSTRAR PANEL
   ========================================================= */

function showRoutePanel() {

  createRoutePanel();


  if (
    routeInfoPanel
  ) {

    routeInfoPanel.classList.add(
      'visible'
    );

  }

}


/* =========================================================
   CALCULAR RUTA REAL
   ========================================================= */

async function calculateRealRoute() {

  if (
    !userLocation
  ) {

    showRoutePanel();


    if (
      routeStatusElement
    ) {

      routeStatusElement.textContent =
        '📍 Activa primero tu ubicación.';

    }


    return;

  }


  if (
    !selectedSpotForGPS
  ) {

    showRoutePanel();


    if (
      routeStatusElement
    ) {

      routeStatusElement.textContent =
        'Selecciona un Photo Spot.';

    }


    return;

  }


  showRoutePanel();


  if (
    routeStatusElement
  ) {

    routeStatusElement.textContent =
      '🛰️ Calculando ruta real...';

  }


  if (
    routeDistanceElement
  ) {

    routeDistanceElement.textContent =
      '—';

  }


  if (
    routeDurationElement
  ) {

    routeDurationElement.textContent =
      '—';

  }


  /* =======================================================
     CANCELAR PETICIÓN ANTERIOR
     ======================================================= */

  if (
    routeRequestController
  ) {

    routeRequestController.abort();

  }


  routeRequestController =
    new AbortController();


  /* =======================================================
     COORDENADAS

     OSRM utiliza:
     longitud,latitud
     ======================================================= */

  const origin =

    `${userLocation.lng},${userLocation.lat}`;


  const destination =

    `${selectedSpotForGPS.lng},${selectedSpotForGPS.lat}`;


  /* =======================================================
     PERFIL

     Actualmente:
     driving = coche
     ======================================================= */

  const profile =
    currentRouteProfile;


  /* =======================================================
     URL OSRM
     ======================================================= */

  const url =

    `https://router.project-osrm.org/route/v1/${profile}/`

    +

    `${origin};${destination}`

    +

    `?overview=full`

    +

    `&geometries=geojson`

    +

    `&steps=true`

    +

    `&alternatives=false`;


  try {

    const response =
      await fetch(

        url,

        {

          signal:
            routeRequestController.signal

        }

      );


    if (
      !response.ok
    ) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    const data =
      await response.json();


    /* =====================================================
       COMPROBAR RESPUESTA
       ===================================================== */

    if (
      data.code !== 'Ok'
    ) {

      throw new Error(
        data.message ||
        'No se encontró una ruta.'
      );

    }


    if (
      !data.routes ||
      !data.routes.length
    ) {

      throw new Error(
        'No se encontró ninguna ruta.'
      );

    }


    const route =
      data.routes[0];


    /* =====================================================
       BORRAR RUTA ANTERIOR
       ===================================================== */

    if (
      currentRouteLayer
    ) {

      map.removeLayer(
        currentRouteLayer
      );

      currentRouteLayer =
        null;

    }


    /* =====================================================
       DIBUJAR RUTA
       ===================================================== */

    currentRouteLayer =

      L.geoJSON(

        route.geometry,

        {

          style: {

            color:
              '#ffd000',

            weight:
              7,

            opacity:
              0.35

          }

        }

      ).addTo(map);


    /* =====================================================
       SEGUNDA LÍNEA PARA DAR ASPECTO GPS
       ===================================================== */

    const routeCore =

      L.geoJSON(

        route.geometry,

        {

          style: {

            color:
              '#ffffff',

            weight:
              3,

            opacity:
              0.95

          }

        }

      ).addTo(map);


    /* =====================================================
       AGRUPAR AMBAS CAPAS
       ===================================================== */

    const routeGroup =
      L.layerGroup(

        [

          currentRouteLayer,

          routeCore

        ]

      );


    map.removeLayer(
      currentRouteLayer
    );


    map.removeLayer(
      routeCore
    );


    currentRouteLayer =
      routeGroup;


    currentRouteLayer.addTo(
      map
    );


    /* =====================================================
       INFORMACIÓN
       ===================================================== */

    if (
      routeDistanceElement
    ) {

      routeDistanceElement.textContent =

        formatRouteDistance(
          route.distance
        );

    }


    if (
      routeDurationElement
    ) {

      routeDurationElement.textContent =

        formatRouteDuration(
          route.duration
        );

    }


    if (
      routeStatusElement
    ) {

      routeStatusElement.textContent =

        `Ruta hasta ${selectedSpotForGPS.name}`;

    }


    /* =====================================================
       ENCUADRAR LA RUTA
       ===================================================== */

    const bounds =
      currentRouteLayer.getBounds();


    if (
      bounds.isValid()
    ) {

      map.fitBounds(

        bounds,

        {

          padding:
            [70, 70],

          maxZoom:
            11,

          animate:
            true

        }

      );

    }


    console.log(
      'Ruta calculada:',
      route
    );

  }

  catch (error) {

    if (
      error.name ===
      'AbortError'
    ) {

      return;

    }


    console.error(
      'Error calculando ruta:',
      error
    );


    if (
      routeStatusElement
    ) {

      routeStatusElement.textContent =

        '⚠️ No se pudo calcular la ruta.';

    }

  }

}


/* =========================================================
   MODIFICAR CÓMO LLEGAR
   Ahora dibuja la ruta en nuestro mapa
   ========================================================= */

if (
  navigationBtn
) {

  navigationBtn.removeEventListener(
    'click',
    openGPSNavigation
  );


  navigationBtn.addEventListener(

    'click',

    () => {

      calculateRealRoute();

    }

  );

}


/* =========================================================
   CREAR PANEL AL CARGAR
   ========================================================= */

createRoutePanel();


/* =========================================================
   ACTUALIZAR RUTA AUTOMÁTICAMENTE
   AL CAMBIAR DE PHOTO SPOT
   ========================================================= */

const originalSelectSpotForRoute =
  selectSpot;


selectSpot =
  function(
    id,
    fly = true
  ) {

    originalSelectSpotForRoute(
      id,
      fly
    );


    selectedSpotForGPS =
      spots.find(
        spot =>
          spot.id === id
      );


    /*
       Si el usuario ya tiene GPS activado,
       recalculamos automáticamente la ruta.
    */

    if (
      userLocation
    ) {

      calculateRealRoute();

    }

  };


/* =========================================================
   ACTUALIZAR RUTA CUANDO CAMBIA LA POSICIÓN
   ========================================================= */

const originalHandlePositionForRoute =
  handlePosition;


handlePosition =
  function(
    position
  ) {

    originalHandlePositionForRoute(
      position
    );


    /*
       No recalculamos inmediatamente en cada
       pequeña actualización del GPS para evitar
       demasiadas peticiones al servidor.

       La ruta se actualizará al seleccionar
       otro spot o pulsar "Cómo llegar".
    */

  };


/* =========================================================
   FIN FASE 2
   ========================================================= */

   /* =========================================================
   FASE 3 · NAVEGACIÓN GPS REAL
   TODOS CON HERNÁN · GRAND TOUR DE SUIZA
   ========================================================= */


/* =========================================================
   ESTADO DE NAVEGACIÓN
   ========================================================= */

let navigationActive = false;

let navigationSteps = [];

let navigationStepIndex = 0;

let navigationRouteGeometry = null;

let navigationRouteDistance = 0;

let navigationRouteDuration = 0;

let navigationLastRouteRequest = 0;

let navigationRecalculateTimer = null;

let navigationLastPosition = null;


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const NAVIGATION_OFF_ROUTE_METERS =
  80;


const NAVIGATION_RECALCULATE_DELAY =
  15000;


const NAVIGATION_CENTER_ZOOM =
  16;


/* =========================================================
   ELEMENTOS DE NAVEGACIÓN
   ========================================================= */

let navigationInstructions =
  null;

let navigationInstructionTitle =
  null;

let navigationInstructionDistance =
  null;

let navigationInstructionRoad =
  null;

let navigationRemainingDistance =
  null;

let navigationRemainingTime =
  null;

let navigationStopButton =
  null;


/* =========================================================
   CREAR INTERFAZ DE NAVEGACIÓN
   ========================================================= */

function createNavigationInterface() {

  createRoutePanel();


  if (
    !routeInfoPanel
  ) {

    return;

  }


  if (
    document.getElementById(
      'navigationInstructions'
    )
  ) {

    navigationInstructions =
      document.getElementById(
        'navigationInstructions'
      );

    navigationInstructionTitle =
      document.getElementById(
        'navigationInstructionTitle'
      );

    navigationInstructionDistance =
      document.getElementById(
        'navigationInstructionDistance'
      );

    navigationInstructionRoad =
      document.getElementById(
        'navigationInstructionRoad'
      );

    navigationRemainingDistance =
      document.getElementById(
        'navigationRemainingDistance'
      );

    navigationRemainingTime =
      document.getElementById(
        'navigationRemainingTime'
      );

    navigationStopButton =
      document.getElementById(
        'navigationStopButton'
      );

    return;

  }


  const instructions =
    document.createElement(
      'div'
    );


  instructions.id =
    'navigationInstructions';


  instructions.innerHTML = `

    <div class="navigationMainInstruction">

      <div
        id="navigationInstructionIcon"
        class="navigationInstructionIcon"
      >
        ➡️
      </div>

      <div class="navigationInstructionText">

        <strong
          id="navigationInstructionTitle"
        >
          Preparando navegación...
        </strong>

        <span
          id="navigationInstructionRoad"
        >
          —
        </span>

      </div>

    </div>


    <div class="navigationInstructionDistance">

      <strong
        id="navigationInstructionDistance"
      >
        —
      </strong>

      <span>
        hasta la siguiente indicación
      </span>

    </div>


    <div class="navigationRemaining">

      <div>

        <span>
          📏 RESTANTE
        </span>

        <strong
          id="navigationRemainingDistance"
        >
          —
        </strong>

      </div>


      <div>

        <span>
          ⏱️ TIEMPO
        </span>

        <strong
          id="navigationRemainingTime"
        >
          —
        </strong>

      </div>

    </div>


    <button
      id="navigationStopButton"
      type="button"
      class="navigationStopButton"
    >
      🛑 TERMINAR NAVEGACIÓN
    </button>

  `;


  routeInfoPanel.appendChild(
    instructions
  );


  navigationInstructions =
    document.getElementById(
      'navigationInstructions'
    );


  navigationInstructionTitle =
    document.getElementById(
      'navigationInstructionTitle'
    );


  navigationInstructionDistance =
    document.getElementById(
      'navigationInstructionDistance'
    );


  navigationInstructionRoad =
    document.getElementById(
      'navigationInstructionRoad'
    );


  navigationRemainingDistance =
    document.getElementById(
      'navigationRemainingDistance'
    );


  navigationRemainingTime =
    document.getElementById(
      'navigationRemainingTime'
    );


  navigationStopButton =
    document.getElementById(
      'navigationStopButton'
    );


  if (
    navigationStopButton
  ) {

    navigationStopButton.addEventListener(

      'click',

      stopNavigation

    );

  }

}


/* =========================================================
   ICONO SEGÚN MANIOBRA
   ========================================================= */

function getManeuverIcon(
  step
) {

  if (
    !step ||
    !step.maneuver
  ) {

    return '➡️';

  }


  const type =
    step.maneuver.type || '';


  const modifier =
    step.maneuver.modifier || '';


  if (
    type === 'arrive'
  ) {

    return '🏁';

  }


  if (
    type === 'depart'
  ) {

    return '🚗';

  }


  if (
    type === 'roundabout'
  ) {

    return '🔄';

  }


  if (
    type === 'merge'
  ) {

    return '↗️';

  }


  if (
    type === 'fork'
  ) {

    return '⑂';

  }


  if (
    modifier.includes(
      'left'
    )
  ) {

    return '↖️';

  }


  if (
    modifier.includes(
      'right'
    )
  ) {

    return '↗️';

  }


  if (
    modifier.includes(
      'uturn'
    )
  ) {

    return '↩️';

  }


  return '⬆️';

}


/* =========================================================
   TEXTO DE MANIOBRA
   ========================================================= */

function getManeuverText(
  step
) {

  if (
    !step ||
    !step.maneuver
  ) {

    return 'Continúa';

  }


  const maneuver =
    step.maneuver;


  const type =
    maneuver.type || '';


  const modifier =
    maneuver.modifier || '';


  if (
    type === 'arrive'
  ) {

    return 'Has llegado a tu destino';

  }


  if (
    type === 'depart'
  ) {

    return 'Comienza la ruta';

  }


  if (
    type === 'roundabout'
  ) {

    if (
      maneuver.exit
    ) {

      return (

        `En la rotonda, toma la salida ${maneuver.exit}`

      );

    }


    return 'Entra en la rotonda';

  }


  if (
    type === 'merge'
  ) {

    return 'Incorpórate';

  }


  if (
    type === 'fork'
  ) {

    if (
      modifier.includes(
        'left'
      )
    ) {

      return 'Mantente a la izquierda';

    }


    if (
      modifier.includes(
        'right'
      )
    ) {

      return 'Mantente a la derecha';

    }


    return 'Continúa por la bifurcación';

  }


  if (
    modifier === 'left'
  ) {

    return 'Gira a la izquierda';

  }


  if (
    modifier === 'slight left'
  ) {

    return 'Gira ligeramente a la izquierda';

  }


  if (
    modifier === 'sharp left'
  ) {

    return 'Gira a la izquierda cerrada';

  }


  if (
    modifier === 'right'
  ) {

    return 'Gira a la derecha';

  }


  if (
    modifier === 'slight right'
  ) {

    return 'Gira ligeramente a la derecha';

  }


  if (
    modifier === 'sharp right'
  ) {

    return 'Gira a la derecha cerrada';

  }


  if (
    type === 'continue'
  ) {

    return 'Continúa recto';

  }


  if (
    type === 'new name'
  ) {

    return 'Continúa';

  }


  return 'Continúa por la ruta';

}


/* =========================================================
   OBTENER NOMBRE DE LA VÍA
   ========================================================= */

function getStepRoadName(
  step
) {

  if (
    !step
  ) {

    return '';

  }


  if (
    step.name &&
    step.name.trim()
  ) {

    return step.name;

  }


  if (
    step.ref &&
    step.ref.trim()
  ) {

    return step.ref;

  }


  return 'Carretera';

}


/* =========================================================
   MOSTRAR PASO ACTUAL
   ========================================================= */

function updateNavigationInstruction() {

  if (
    !navigationSteps.length
  ) {

    return;

  }


  let step =
    navigationSteps[
      navigationStepIndex
    ];


  if (
    !step
  ) {

    return;

  }


  const icon =
    getManeuverIcon(
      step
    );


  const text =
    getManeuverText(
      step
    );


  const road =
    getStepRoadName(
      step
    );


  if (
    navigationInstructionTitle
  ) {

    navigationInstructionTitle.textContent =
      text;

  }


  if (
    navigationInstructionRoad
  ) {

    navigationInstructionRoad.textContent =

      road

        ?

        `Por ${road}`

        :

        '';

  }


  if (
    navigationInstructionDistance
  ) {

    navigationInstructionDistance.textContent =

      formatRouteDistance(
        step.distance || 0
      );

  }


  const iconElement =
    document.getElementById(
      'navigationInstructionIcon'
    );


  if (
    iconElement
  ) {

    iconElement.textContent =
      icon;

  }


  updateNavigationRemaining();

}


/* =========================================================
   DISTANCIA RESTANTE
   ========================================================= */

function updateNavigationRemaining() {

  if (
    !navigationSteps.length
  ) {

    return;

  }


  let remainingDistance = 0;

  let remainingDuration = 0;


  for (

    let i =
      navigationStepIndex;

    i <
      navigationSteps.length;

    i++

  ) {

    const step =
      navigationSteps[i];


    remainingDistance +=
      step.distance || 0;


    remainingDuration +=
      step.duration || 0;

  }


  if (
    navigationRemainingDistance
  ) {

    navigationRemainingDistance.textContent =

      formatRouteDistance(
        remainingDistance
      );

  }


  if (
    navigationRemainingTime
  ) {

    navigationRemainingTime.textContent =

      formatRouteDuration(
        remainingDuration
      );

  }

}


/* =========================================================
   ENCONTRAR EL PASO MÁS CERCANO
   ========================================================= */

function findClosestNavigationStep(
  position
) {

  if (
    !navigationSteps.length
  ) {

    return 0;

  }


  let closestIndex =
    navigationStepIndex;


  let closestDistance =
    Infinity;


  for (

    let i =
      navigationStepIndex;

    i <
      navigationSteps.length;

    i++

  ) {

    const step =
      navigationSteps[i];


    if (
      !step.maneuver ||
      !step.maneuver.location
    ) {

      continue;

    }


    const coords =
      step.maneuver.location;


    const stepPosition =
      L.latLng(

        coords[1],

        coords[0]

      );


    const distance =
      position.distanceTo(
        stepPosition
      );


    if (
      distance <
      closestDistance
    ) {

      closestDistance =
        distance;


      closestIndex =
        i;

    }

  }


  return closestIndex;

}


/* =========================================================
   ACTUALIZAR PASO SEGÚN POSICIÓN
   ========================================================= */

function updateNavigationProgress() {

  if (
    !navigationActive
  ) {

    return;

  }


  if (
    !userLocation
  ) {

    return;

  }


  if (
    !navigationSteps.length
  ) {

    return;

  }


  const position =
    L.latLng(

      userLocation.lat,

      userLocation.lng

    );


  const closestIndex =
    findClosestNavigationStep(
      position
    );


  if (
    closestIndex >
    navigationStepIndex
  ) {

    navigationStepIndex =
      closestIndex;


    updateNavigationInstruction();

  }


  const currentStep =
    navigationSteps[
      navigationStepIndex
    ];


  if (
    currentStep &&
    currentStep.maneuver &&
    currentStep.maneuver.location
  ) {

    const coords =
      currentStep.maneuver.location;


    const maneuverPosition =
      L.latLng(

        coords[1],

        coords[0]

      );


    const distanceToManeuver =
      position.distanceTo(
        maneuverPosition
      );


    if (
      distanceToManeuver < 35 &&
      navigationStepIndex <
        navigationSteps.length - 1
    ) {

      navigationStepIndex++;

      updateNavigationInstruction();

    }

  }


  updateNavigationRemaining();

}


/* =========================================================
   OBTENER PUNTOS DE LA RUTA
   ========================================================= */

function getNavigationRoutePoints() {

  if (
    !navigationRouteGeometry
  ) {

    return [];

  }


  if (
    !navigationRouteGeometry.coordinates
  ) {

    return [];

  }


  return navigationRouteGeometry.coordinates.map(

    coordinate =>

      L.latLng(

        coordinate[1],

        coordinate[0]

      )

  );

}


/* =========================================================
   DISTANCIA MÍNIMA A LA RUTA
   ========================================================= */

function getDistanceToRoute(
  position
) {

  const points =
    getNavigationRoutePoints();


  if (
    !points.length
  ) {

    return Infinity;

  }


  let minimumDistance =
    Infinity;


  for (
    const point of points
  ) {

    const distance =
      position.distanceTo(
        point
      );


    if (
      distance <
      minimumDistance
    ) {

      minimumDistance =
        distance;

    }

  }


  return minimumDistance;

}


/* =========================================================
   COMPROBAR SI EL USUARIO SE HA DESVIADO
   ========================================================= */

function checkNavigationDeviation() {

  if (
    !navigationActive
  ) {

    return;

  }


  if (
    !userLocation
  ) {

    return;

  }


  const position =
    L.latLng(

      userLocation.lat,

      userLocation.lng

    );


  const distanceToRoute =
    getDistanceToRoute(
      position
    );


  const accuracy =
    userLocation.accuracy || 0;


  const allowedDistance =

    Math.max(

      NAVIGATION_OFF_ROUTE_METERS,

      accuracy * 2.5

    );


  if (
    distanceToRoute >
    allowedDistance
  ) {

    requestNavigationRecalculation();

  }

}


/* =========================================================
   SOLICITAR RECÁLCULO
   ========================================================= */

function requestNavigationRecalculation() {

  const now =
    Date.now();


  if (

    now -
    navigationLastRouteRequest

    <

    NAVIGATION_RECALCULATE_DELAY

  ) {

    return;

  }


  if (
    navigationRecalculateTimer
  ) {

    clearTimeout(
      navigationRecalculateTimer
    );

  }


  if (
    routeStatusElement
  ) {

    routeStatusElement.textContent =
      '⚠️ Te has desviado. Recalculando...';

  }


  navigationRecalculateTimer =

    setTimeout(

      () => {

        calculateNavigationRoute(
          true
        );

      },

      700

    );

}


/* =========================================================
   CALCULAR RUTA DE NAVEGACIÓN
   ========================================================= */

async function calculateNavigationRoute(
  keepNavigation = false
) {

  if (
    !userLocation
  ) {

    return;

  }


  if (
    !selectedSpotForGPS
  ) {

    return;

  }


  createNavigationInterface();


  if (
    !keepNavigation
  ) {

    navigationActive =
      true;

  }


  navigationLastRouteRequest =
    Date.now();


  if (
    routeInfoPanel
  ) {

    routeInfoPanel.classList.add(
      'visible'
    );

  }


  if (
    routeStatusElement
  ) {

    routeStatusElement.textContent =
      '🛰️ Calculando navegación...';

  }


  if (
    routeRequestController
  ) {

    routeRequestController.abort();

  }


  routeRequestController =
    new AbortController();


  const origin =

    `${userLocation.lng},${userLocation.lat}`;


  const destination =

    `${selectedSpotForGPS.lng},${selectedSpotForGPS.lat}`;


  const url =

    `https://router.project-osrm.org/route/v1/${currentRouteProfile}/`

    +

    `${origin};${destination}`

    +

    `?overview=full`

    +

    `&geometries=geojson`

    +

    `&steps=true`

    +

    `&alternatives=false`;


  try {

    const response =
      await fetch(

        url,

        {

          signal:
            routeRequestController.signal

        }

      );


    if (
      !response.ok
    ) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    const data =
      await response.json();


    if (
      data.code !== 'Ok'
    ) {

      throw new Error(
        data.message ||
        'No se pudo calcular la ruta.'
      );

    }


    if (
      !data.routes ||
      !data.routes.length
    ) {

      throw new Error(
        'No se encontró ninguna ruta.'
      );

    }


    const route =
      data.routes[0];


    /* =====================================================
       GUARDAR INFORMACIÓN
       ===================================================== */

    navigationRouteGeometry =
      route.geometry;


    navigationRouteDistance =
      route.distance;


    navigationRouteDuration =
      route.duration;


    const legs =
      route.legs || [];


    navigationSteps =
      [];


    legs.forEach(
      leg => {

        if (
          Array.isArray(
            leg.steps
          )
        ) {

          navigationSteps.push(
            ...leg.steps
          );

        }

      }
    );


    /*
       El primer paso normalmente es "depart".
       Lo mantenemos para que la navegación tenga
       una salida coherente.
    */

    navigationStepIndex =
      0;


    /* =====================================================
       BORRAR RUTA ANTERIOR
       ===================================================== */

    if (
      currentRouteLayer
    ) {

      map.removeLayer(
        currentRouteLayer
      );

      currentRouteLayer =
        null;

    }


    /* =====================================================
       DIBUJAR RUTA GPS
       ===================================================== */

    const routeOuter =
      L.geoJSON(

        route.geometry,

        {

          style: {

            color:
              '#ffd000',

            weight:
              9,

            opacity:
              0.30

          }

        }

      );


    const routeInner =
      L.geoJSON(

        route.geometry,

        {

          style: {

            color:
              '#ffffff',

            weight:
              4,

            opacity:
              0.95

          }

        }

      );


    currentRouteLayer =
      L.layerGroup(

        [

          routeOuter,

          routeInner

        ]

      );


    currentRouteLayer.addTo(
      map
    );


    /* =====================================================
       DISTANCIA Y TIEMPO
       ===================================================== */

    if (
      routeDistanceElement
    ) {

      routeDistanceElement.textContent =

        formatRouteDistance(
          route.distance
        );

    }


    if (
      routeDurationElement
    ) {

      routeDurationElement.textContent =

        formatRouteDuration(
          route.duration
        );

    }


    if (
      routeStatusElement
    ) {

      routeStatusElement.textContent =

        `Navegando hacia ${selectedSpotForGPS.name}`;

    }


    /* =====================================================
       INSTRUCCIÓN
       ===================================================== */

    updateNavigationInstruction();


    /* =====================================================
       ENCUADRAR RUTA SOLO AL INICIAR
       ===================================================== */

    if (
      !keepNavigation
    ) {

      const bounds =
        currentRouteLayer.getBounds();


      if (
        bounds.isValid()
      ) {

        map.fitBounds(

          bounds,

          {

            padding:
              [70, 70],

            maxZoom:
              12,

            animate:
              true

          }

        );

      }

    }


    console.log(
      'Navegación calculada:',
      route
    );

  }

  catch (error) {

    if (
      error.name ===
      'AbortError'
    ) {

      return;

    }


    console.error(
      'Error en navegación:',
      error
    );


    if (
      routeStatusElement
    ) {

      routeStatusElement.textContent =
        '⚠️ No se pudo calcular la navegación.';

    }

  }

}


/* =========================================================
   INICIAR NAVEGACIÓN
   ========================================================= */

function startNavigation() {

  if (
    !userLocation
  ) {

    createNavigationInterface();


    if (
      routeStatusElement
    ) {

      routeStatusElement.textContent =
        '📍 Primero activa tu ubicación.';

    }


    if (
      locateMeBtn
    ) {

      locateMeBtn.scrollIntoView({

        behavior:
          'smooth',

        block:
          'center'

      });

    }


    return;

  }


  if (
    !selectedSpotForGPS
  ) {

    return;

  }


  navigationActive =
    true;


  navigationLastPosition =
    null;


  createNavigationInterface();


  calculateNavigationRoute(
    false
  );

}


/* =========================================================
   TERMINAR NAVEGACIÓN
   ========================================================= */

function stopNavigation() {

  navigationActive =
    false;


  navigationSteps =
    [];


  navigationStepIndex =
    0;


  navigationRouteGeometry =
    null;


  navigationLastPosition =
    null;


  if (
    navigationRecalculateTimer
  ) {

    clearTimeout(
      navigationRecalculateTimer
    );

    navigationRecalculateTimer =
      null;

  }


  if (
    currentRouteLayer
  ) {

    map.removeLayer(
      currentRouteLayer
    );

    currentRouteLayer =
      null;

  }


  if (
    routeInfoPanel
  ) {

    routeInfoPanel.classList.remove(
      'visible'
    );

  }


  if (
    routeStatusElement
  ) {

    routeStatusElement.textContent =
      '';

  }


  console.log(
    'Navegación terminada.'
  );

}


/* =========================================================
   BOTÓN CÓMO LLEGAR
   Capturamos el click antes que los listeners
   anteriores de Fase 1/Fase 2.
   ========================================================= */

if (
  navigationBtn
) {

  navigationBtn.addEventListener(

    'click',

    event => {

      event.preventDefault();

      event.stopImmediatePropagation();

      startNavigation();

    },

    true

  );

}


/* =========================================================
   CONECTAR EL GPS CON LA NAVEGACIÓN
   ========================================================= */

const previousHandlePositionPhase3 =
  handlePosition;


handlePosition =
  function(
    position
  ) {

    previousHandlePositionPhase3(
      position
    );


    if (
      !navigationActive
    ) {

      return;

    }


    navigationLastPosition =
      position;


    /*
       Actualizar el paso actual.
    */

    updateNavigationProgress();


    /*
       Comprobar si el usuario se ha
       separado de la ruta.
    */

    checkNavigationDeviation();


    /*
       Durante navegación centramos el mapa
       suavemente sobre el usuario.
    */

    if (
      userLocation
    ) {

      const currentCenter =
        map.getCenter();


      const userPoint =
        L.latLng(

          userLocation.lat,

          userLocation.lng

        );


      const distanceFromCenter =
        currentCenter.distanceTo(
          userPoint
        );


      /*
         Solo movemos el mapa cuando el usuario
         se aleja bastante del centro.
      */

      if (
        distanceFromCenter >
        250
      ) {

        map.panTo(

          userPoint,

          {

            animate:
              true,

            duration:
              0.5

          }

        );

      }

    }

  };


/* =========================================================
   CREAR INTERFAZ AL FINAL
   ========================================================= */

createNavigationInterface();


/* =========================================================
   FIN FASE 3
   ========================================================= */

   /* =========================================================
   FASE 3.5 · PLANIFICADOR PRO
   TODOS CON HERNÁN · GRAND TOUR DE SUIZA
   ========================================================= */


/* =========================================================
   ESTADO DEL PLANIFICADOR
   ========================================================= */

let plannerOrigin = null;

let plannerOriginName = '';

let plannerDestination = null;

let plannerRouteLayer = null;

let plannerSearchController = null;

let plannerSearchTimer = null;


let plannerSearchRequestId = 0;

let plannerRouteRequestController = null;

let plannerRouteRequestId = 0;


/* =========================================================
   ELEMENTOS HTML
   ========================================================= */

const plannerOriginInput =
  document.getElementById(
    'routeOriginInput'
  );

const plannerOriginSearchBtn =
  document.getElementById(
    'routeOriginSearchBtn'
  );

const plannerOriginResults =
  document.getElementById(
    'routeOriginResults'
  );

const plannerUseLocationBtn =
  document.getElementById(
    'routeUseLocationBtn'
  );

const plannerOriginSelected =
  document.getElementById(
    'routeOriginSelected'
  );

const plannerOriginNameElement =
  document.getElementById(
    'routeOriginName'
  );

const plannerOriginDetails =
  document.getElementById(
    'routeOriginDetails'
  );

const plannerDestinationSelect =
  document.getElementById(
    'routeDestinationSelect'
  );

const plannerDestinationSelected =
  document.getElementById(
    'routeDestinationSelected'
  );

const plannerDestinationNameElement =
  document.getElementById(
    'routeDestinationName'
  );

const plannerDestinationDetails =
  document.getElementById(
    'routeDestinationDetails'
  );

const plannerCalculateBtn =
  document.getElementById(
    'calculatePlannerRouteBtn'
  );

const plannerClearBtn =
  document.getElementById(
    'clearPlannerRouteBtn'
  );

const plannerRouteResult =
  document.getElementById(
    'plannerRouteResult'
  );

const plannerRouteTitle =
  document.getElementById(
    'plannerRouteTitle'
  );

const plannerRouteDistance =
  document.getElementById(
    'plannerRouteDistance'
  );

const plannerRouteDuration =
  document.getElementById(
    'plannerRouteDuration'
  );

const plannerStartNavigationBtn =
  document.getElementById(
    'plannerStartNavigationBtn'
  );

const plannerStatus =
  document.getElementById(
    'plannerStatus'
  );


/* =========================================================
   COMPROBAR QUE EL HTML EXISTE
   ========================================================= */

const plannerReady =

  !!plannerOriginInput &&

  !!plannerOriginSearchBtn &&

  !!plannerOriginResults &&

  !!plannerUseLocationBtn &&

  !!plannerDestinationSelect &&

  !!plannerCalculateBtn &&

  !!plannerClearBtn;


/* =========================================================
   MOSTRAR ESTADO
   ========================================================= */

function setPlannerStatus(
  message
) {

  if (
    plannerStatus
  ) {

    plannerStatus.textContent =
      message;

  }

}


/* =========================================================
   ESCAPAR HTML
   Evita introducir directamente texto externo
   dentro del HTML.
   ========================================================= */

function escapePlannerHTML(
  value
) {

  return String(
    value || ''
  )

    .replace(
      /&/g,
      '&amp;'
    )

    .replace(
      /</g,
      '&lt;'
    )

    .replace(
      />/g,
      '&gt;'
    )

    .replace(
      /"/g,
      '&quot;'
    )

    .replace(
      /'/g,
      '&#039;'
    );

}


/* =========================================================
   RELLENAR LOS 92 PHOTO SPOTS
   ========================================================= */

function populatePlannerSpots() {

  if (
    !plannerDestinationSelect
  ) {

    return;

  }


  if (
    typeof spots ===
    'undefined'
  ) {

    console.error(
      'Planner: no existe la variable spots.'
    );

    return;

  }


  plannerDestinationSelect.innerHTML = `

    <option value="">
      Selecciona un Photo Spot...
    </option>

  `;


  spots.forEach(
    (
      spot,
      index
    ) => {

      if (
        !spot
      ) {

        return;

      }


      const option =
        document.createElement(
          'option'
        );


      option.value =
        spot.id;


      option.textContent =

        `${index + 1}. ${spot.name || 'Photo Spot'}`;


      plannerDestinationSelect.appendChild(
        option
      );

    }
  );

}


/* =========================================================
   SELECCIONAR PHOTO SPOT
   ========================================================= */

function selectPlannerDestination(
  spot
) {

  if (
    !spot
  ) {

    plannerDestination =
      null;


    if (
      plannerDestinationSelected
    ) {

      plannerDestinationSelected.hidden =
        true;

    }


    return;

  }


  plannerDestination =
    spot;


  if (
    plannerDestinationSelected
  ) {

    plannerDestinationSelected.hidden =
      false;

  }


  if (
    plannerDestinationNameElement
  ) {

    plannerDestinationNameElement.textContent =

      spot.name ||
      'Photo Spot';

  }


  if (
    plannerDestinationDetails
  ) {

    const lat =
      Number(
        spot.lat
      );


    const lng =
      Number(
        spot.lng
      );


    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    ) {

      plannerDestinationDetails.textContent =

        `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    }

    else {

      plannerDestinationDetails.textContent =
        'Coordenadas no disponibles';

    }

  }

}


/* =========================================================
   CAMBIO DE DESTINO
   ========================================================= */

if (
  plannerDestinationSelect
) {

  plannerDestinationSelect.addEventListener(

    'change',

    () => {

      const id =
        plannerDestinationSelect.value;


      if (
        !id
      ) {

        selectPlannerDestination(
          null
        );

        return;

      }


      const spot =
        spots.find(

          item =>

            String(
              item.id
            ) ===
            String(
              id
            )

        );


      selectPlannerDestination(
        spot
      );

    }

  );

}


/* =========================================================
   USAR UBICACIÓN GPS COMO ORIGEN
   ========================================================= */

function plannerUseCurrentLocation() {

  if (
    !userLocation
  ) {

    setPlannerStatus(
      '📍 Activa primero tu ubicación GPS.'
    );


    /*
       Intentamos utilizar el botón GPS existente.
    */

    if (
      locateMeBtn
    ) {

      locateMeBtn.click();

    }


    return;

  }


  plannerOrigin = {

    lat:
      Number(
        userLocation.lat
      ),

    lng:
      Number(
        userLocation.lng
      )

  };


  plannerOriginName =
    'Mi ubicación';


  if (
    plannerOriginInput
  ) {

    plannerOriginInput.value =
      'Mi ubicación';

  }


  if (
    plannerOriginSelected
  ) {

    plannerOriginSelected.hidden =
      false;

  }


  if (
    plannerOriginNameElement
  ) {

    plannerOriginNameElement.textContent =
      'Mi ubicación';

  }


  if (
    plannerOriginDetails
  ) {

    plannerOriginDetails.textContent =

      `${plannerOrigin.lat.toFixed(5)}, ${plannerOrigin.lng.toFixed(5)}`;

  }


  setPlannerStatus(
    '📍 Origen establecido mediante GPS.'
  );

}


/* =========================================================
   BOTÓN MI UBICACIÓN
   ========================================================= */

if (
  plannerUseLocationBtn
) {

  plannerUseLocationBtn.addEventListener(

    'click',

    plannerUseCurrentLocation

  );

}


/* =========================================================
   GEOCODIFICACIÓN
   Nominatim / OpenStreetMap
   ========================================================= */

async function searchPlannerLocation(
  query
) {

  const cleanQuery =
    String(
      query || ''
    ).trim();


  if (
    cleanQuery.length <
    2
  ) {

    setPlannerStatus(
      'Escribe una ciudad, pueblo o dirección.'
    );

    return;

  }


 /* =========================================================
   CANCELAR BÚSQUEDA ANTERIOR
   Y CREAR ID ÚNICO PARA ESTA BÚSQUEDA
   ========================================================= */

plannerSearchRequestId++;

const requestId =
  plannerSearchRequestId;


if (
  plannerSearchController
) {

  plannerSearchController.abort();

}


plannerSearchController =
  new AbortController();


  setPlannerStatus(
    '🔎 Buscando lugar...'
  );


  if (
    plannerOriginResults
  ) {

    plannerOriginResults.hidden =
      false;


    plannerOriginResults.innerHTML = `

      <div class="plannerResultItem">

        <strong>
          🔎 Buscando...
        </strong>

      </div>

    `;

  }


  const url =

    'https://nominatim.openstreetmap.org/search'

    +

    `?q=${encodeURIComponent(cleanQuery)}`

    +

    '&format=jsonv2'

    +

    '&addressdetails=1'

    +

    '&limit=6';


  try {

    const response =
      await fetch(

        url,

        {

          signal:
            plannerSearchController.signal,

          headers: {

            'Accept':
              'application/json'

          }

        }

      );


    if (
      !response.ok
    ) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


const results =
  await response.json();


/* -------------------------------------------------------
   IGNORAR RESPUESTAS DE BÚSQUEDAS ANTERIORES
   ------------------------------------------------------- */

if (
  requestId !==
  plannerSearchRequestId
) {

  return;

}


renderPlannerSearchResults(
  results
);

  }

  catch (
    error
  ) {

    if (
      error.name ===
      'AbortError'
    ) {

      return;

    }


    console.error(
      'Planner geocoding error:',
      error
    );


    if (
      plannerOriginResults
    ) {

      plannerOriginResults.innerHTML = `

        <div class="plannerResultItem">

          <strong>
            ⚠️ No se pudo realizar la búsqueda
          </strong>

          <span>
            Inténtalo de nuevo.
          </span>

        </div>

      `;

    }


    setPlannerStatus(
      '⚠️ No se pudo buscar ese lugar.'
    );

  }

}


/* =========================================================
   MOSTRAR RESULTADOS
   ========================================================= */

function renderPlannerSearchResults(
  results
) {

  if (
    !plannerOriginResults
  ) {

    return;

  }


  plannerOriginResults.innerHTML =
    '';


  if (
    !Array.isArray(
      results
    ) ||
    !results.length
  ) {

    plannerOriginResults.innerHTML = `

      <div class="plannerResultItem">

        <strong>
          No encontramos ese lugar
        </strong>

        <span>
          Prueba con otra ciudad, pueblo o dirección.
        </span>

      </div>

    `;


    plannerOriginResults.hidden =
      false;


    setPlannerStatus(
      'No se encontraron resultados.'
    );


    return;

  }


  results.forEach(

    result => {

      const button =
        document.createElement(
          'button'
        );


      button.type =
        'button';


      button.className =
        'plannerResultItem';


      const displayName =
        result.display_name ||
        'Lugar';


      const address =
        result.address || {};


      const country =
        address.country ||
        '';


      const type =
        result.type ||
        '';


      button.innerHTML = `

        <strong>
          📍 ${escapePlannerHTML(
            getPlannerShortName(
              result
            )
          )}
        </strong>

        <span>
          ${escapePlannerHTML(
            country
          )}

          ${country && type ? ' · ' : ''}

          ${escapePlannerHTML(
            type
          )}

        </span>

      `;


      button.addEventListener(

        'click',

        () => {

          choosePlannerOrigin(
            result
          );

        }

      );


      plannerOriginResults.appendChild(
        button
      );

    }

  );


  plannerOriginResults.hidden =
    false;


  setPlannerStatus(
    'Selecciona un resultado.'
  );

}


/* =========================================================
   NOMBRE CORTO
   ========================================================= */

function getPlannerShortName(
  result
) {

  const address =
    result.address ||
    {};


  return (

    address.city ||

    address.town ||

    address.village ||

    address.municipality ||

    address.county ||

    result.display_name ||

    'Lugar'

  );

}


/* =========================================================
   SELECCIONAR ORIGEN
   ========================================================= */

function choosePlannerOrigin(
  result
) {

  const lat =
    Number(
      result.lat
    );


  const lng =
    Number(
      result.lon
    );


  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {

    setPlannerStatus(
      '⚠️ Ese resultado no tiene coordenadas válidas.'
    );


    return;

  }

  


  plannerOrigin = {

    lat:
      lat,

    lng:
      lng

  };


  plannerOriginName =
    getPlannerShortName(
      result
    );


  if (
    plannerOriginInput
  ) {

    plannerOriginInput.value =

      plannerOriginName;

  }


  if (
    plannerOriginSelected
  ) {

    plannerOriginSelected.hidden =
      false;

  }


  if (
    plannerOriginNameElement
  ) {

    plannerOriginNameElement.textContent =

      plannerOriginName;

  }


  if (
    plannerOriginDetails
  ) {

    plannerOriginDetails.textContent =

      result.display_name ||
      `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

  }


  if (
    plannerOriginResults
  ) {

    plannerOriginResults.hidden =
      true;

  }


  setPlannerStatus(
    `📍 Origen: ${plannerOriginName}`
  );


  /*
     Centrar suavemente el mapa en el origen.
  */

  if (
    typeof map !==
    'undefined' &&
    map
  ) {

    map.flyTo(

      [
        lat,
        lng
      ],

      9,

      {

        animate:
          true,

        duration:
          1.1

      }

    );

  }

}


/* =========================================================
   BUSCAR AL PULSAR 🔎
   ========================================================= */

if (
  plannerOriginSearchBtn
) {

  plannerOriginSearchBtn.addEventListener(

    'click',

    () => {

      searchPlannerLocation(

        plannerOriginInput
          ?

          plannerOriginInput.value

          :

          ''

      );

    }

  );

}


/* =========================================================
   ENTER EN EL BUSCADOR
   ========================================================= */

if (
  plannerOriginInput
) {

  plannerOriginInput.addEventListener(

    'keydown',

    event => {

      if (
        event.key ===
        'Enter'
      ) {

        event.preventDefault();


        searchPlannerLocation(
          plannerOriginInput.value
        );

      }

    }

  );


  /*
     Búsqueda automática después de una pausa.
  */

  plannerOriginInput.addEventListener(

    'input',

    () => {

      if (
        plannerSearchTimer
      ) {

        clearTimeout(
          plannerSearchTimer
        );

      }


      const value =
        plannerOriginInput.value.trim();


      if (
        value.length <
        3
      ) {

        if (
          plannerOriginResults
        ) {

          plannerOriginResults.hidden =
            true;

        }

        return;

      }


      plannerSearchTimer =

        setTimeout(

          () => {

            searchPlannerLocation(
              value
            );

          },

          650

        );

    }

  );

}


/* =========================================================
   CERRAR RESULTADOS AL HACER CLICK FUERA
   ========================================================= */

document.addEventListener(

  'click',

  event => {

    if (
      !plannerOriginResults ||
      !plannerOriginInput
    ) {

      return;

    }


    const field =
      plannerOriginInput.closest(
        '.plannerField'
      );


    if (
      field &&
      !field.contains(
        event.target
      )
    ) {

      plannerOriginResults.hidden =
        true;

    }

  }

);


/* =========================================================
   BORRAR RUTA DEL PLANIFICADOR
   ========================================================= */

function clearPlannerRoute() {

  if (
    plannerRouteLayer
  ) {

    map.removeLayer(
      plannerRouteLayer
    );

    plannerRouteLayer =
      null;

  }


  if (
    plannerRouteResult
  ) {

    plannerRouteResult.hidden =
      true;

  }


  if (
    plannerRouteTitle
  ) {

    plannerRouteTitle.textContent =
      '—';

  }


  if (
    plannerRouteDistance
  ) {

    plannerRouteDistance.textContent =
      '—';

  }


  if (
    plannerRouteDuration
  ) {

    plannerRouteDuration.textContent =
      '—';

  }


  setPlannerStatus(
    ''
  );

}


/* =========================================================
   BOTÓN LIMPIAR
   ========================================================= */

if (
  plannerClearBtn
) {

  plannerClearBtn.addEventListener(

    'click',

    clearPlannerRoute

  );

}


/* =========================================================
   CALCULAR RUTA PRO
   ========================================================= */

async function calculatePlannerRoute() {

  if (
    !plannerOrigin
  ) {

    setPlannerStatus(
      '📍 Primero selecciona un lugar de salida.'
    );


    return;

  }


  if (
    !plannerDestination
  ) {

    setPlannerStatus(
      '📸 Primero selecciona un Photo Spot de destino.'
    );


    return;

  }


  const originLat =
    Number(
      plannerOrigin.lat
    );


  const originLng =
    Number(
      plannerOrigin.lng
    );


  const destinationLat =
    Number(
      plannerDestination.lat
    );


  const destinationLng =
    Number(
      plannerDestination.lng
    );


  if (

    !Number.isFinite(
      originLat
    ) ||

    !Number.isFinite(
      originLng
    ) ||

    !Number.isFinite(
      destinationLat
    ) ||

    !Number.isFinite(
      destinationLng
    )

  ) {

    setPlannerStatus(
      '⚠️ Las coordenadas no son válidas.'
    );


    return;

  }


  if (
    plannerRouteLayer
  ) {

    map.removeLayer(
      plannerRouteLayer
    );

    plannerRouteLayer =
      null;

  }


  if (
    plannerRouteResult
  ) {

    plannerRouteResult.hidden =
      false;

  }


  if (
    plannerRouteTitle
  ) {

    plannerRouteTitle.textContent =

      `${plannerOriginName} → ${plannerDestination.name}`;

  }


  if (
    plannerRouteDistance
  ) {

    plannerRouteDistance.textContent =
      '...';

  }


  if (
    plannerRouteDuration
  ) {

    plannerRouteDuration.textContent =
      '...';

  }



  setPlannerStatus(
    '🛰️ Calculando ruta real por carretera...'
  );


  
  /* =========================================================
   CONTROL DE RUTA PRO
   SOLO UNA RUTA ACTIVA
   ========================================================= */

if (
  plannerRouteRequestController
) {

  plannerRouteRequestController.abort();

}


plannerRouteRequestId++;

const requestId =
  plannerRouteRequestId;


plannerRouteRequestController =
  new AbortController();


const origin =

  `${originLng},${originLat}`;


const destination =

  `${destinationLng},${destinationLat}`;


const url =

  `https://router.project-osrm.org/route/v1/driving/`

  +

  `${origin};${destination}`

  +

  '?overview=full'

  +

  '&geometries=geojson'

  +

  '&steps=true'

  +

  '&alternatives=false';


try {

const response =
  await fetch(

    url,

    {

      signal:
        plannerRouteRequestController.signal

    }

  );


    if (
      !response.ok
    ) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    const data =
      await response.json();

/* =========================================================
   IGNORAR RESPUESTAS DE RUTAS ANTERIORES
   ========================================================= */

if (
  requestId !==
  plannerRouteRequestId
) {

  return;

}


    if (
      data.code !==
      'Ok'
    ) {

      throw new Error(
        data.message ||
        'No se encontró una ruta.'
      );

    }


    if (
      !data.routes ||
      !data.routes.length
    ) {

      throw new Error(
        'No se encontró una ruta.'
      );

    }


    const route =
      data.routes[0];


    /* =====================================================
       DIBUJAR RUTA
       ===================================================== */

    const routeOuter =
      L.geoJSON(

        route.geometry,

        {

          style: {

            color:
              '#ffd000',

            weight:
              9,

            opacity:
              0.30

          }

        }

      );


    const routeInner =
      L.geoJSON(

        route.geometry,

        {

          style: {

            color:
              '#ffffff',

            weight:
              4,

            opacity:
              0.95

          }

        }

      );


    plannerRouteLayer =
      L.layerGroup(

        [

          routeOuter,

          routeInner

        ]

      );


    plannerRouteLayer.addTo(
      map
    );


    /* =====================================================
       INFORMACIÓN
       ===================================================== */

    if (
      plannerRouteDistance
    ) {

      plannerRouteDistance.textContent =

        formatRouteDistance(
          route.distance
        );

    }


    if (
      plannerRouteDuration
    ) {

      plannerRouteDuration.textContent =

        formatRouteDuration(
          route.duration
        );

    }


    if (
      plannerRouteTitle
    ) {

      plannerRouteTitle.textContent =

        `${plannerOriginName} → ${plannerDestination.name}`;

    }


    setPlannerStatus(
      '✅ Ruta calculada correctamente.'
    );


    /* =====================================================
       ENCUADRAR RUTA
       ===================================================== */

    const bounds =
      plannerRouteLayer.getBounds();


    if (
      bounds.isValid()
    ) {

      map.fitBounds(

        bounds,

        {

          padding:
            [70, 70],

          maxZoom:
            10,

          animate:
            true

        }

      );

    }


    console.log(
      'Planificador PRO:',
      route
    );

  }

  catch (
    error
  ) {

    /* =========================================================
   IGNORAR CANCELACIONES DE RUTAS ANTERIORES
   ========================================================= */

if (
  error.name ===
  'AbortError'
) {

  return;

}

    console.error(
      'Planner route error:',
      error
    );


    if (
      plannerRouteDistance
    ) {

      plannerRouteDistance.textContent =
        '—';

    }


    if (
      plannerRouteDuration
    ) {

      plannerRouteDuration.textContent =
        '—';

    }


    setPlannerStatus(
      '⚠️ No se pudo calcular la ruta. Prueba otro origen.'
    );

  }

}


/* =========================================================
   BOTÓN CALCULAR
   ========================================================= */

if (
  plannerCalculateBtn
) {

  plannerCalculateBtn.addEventListener(

    'click',

    calculatePlannerRoute

  );

}


/* =========================================================
   INICIAR NAVEGACIÓN DESDE EL PLANIFICADOR
   ========================================================= */

if (
  plannerStartNavigationBtn
) {

  plannerStartNavigationBtn.addEventListener(

    'click',

    () => {

      if (
        !plannerDestination
      ) {

        setPlannerStatus(
          '📸 Selecciona primero un Photo Spot.'
        );


        return;

      }


      /*
         Si el origen seleccionado es la posición GPS
         actual, podemos pasar directamente al sistema
         de navegación de la Fase 3.
      */

      if (
        plannerOriginName ===
        'Mi ubicación' &&
        userLocation
      ) {

        selectedSpotForGPS =
          plannerDestination;


        startNavigation();


        return;

      }


      /*
         Si el origen es Madrid, París, Zúrich, etc.,
         todavía no podemos "navegar" físicamente desde
         ese lugar porque el usuario no está allí.

         La ruta sí queda calculada en el mapa.
      */

      setPlannerStatus(

        '🗺️ Ruta preparada. Para navegación GPS en vivo, usa "Mi ubicación" cuando estés en el punto de salida.'

      );

    }

  );


}


/* =========================================================
   ACTUALIZAR EL DESTINO DEL PLANIFICADOR CUANDO
   SE SELECCIONA UN PHOTO SPOT DESDE OTRA PARTE
   ========================================================= */

function syncPlannerWithSelectedSpot(
  spot
) {

  if (
    !spot
  ) {

    return;

  }


  plannerDestination =
    spot;


  if (
    plannerDestinationSelect
  ) {

    plannerDestinationSelect.value =
      spot.id;

  }


  if (
    plannerDestinationSelected
  ) {

    plannerDestinationSelected.hidden =
      false;

  }


  if (
    plannerDestinationNameElement
  ) {

    plannerDestinationNameElement.textContent =
      spot.name;

  }


  if (
    plannerDestinationDetails
  ) {

    plannerDestinationDetails.textContent =

      `${Number(spot.lat).toFixed(5)}, ${Number(spot.lng).toFixed(5)}`;

  }

}


/* =========================================================
   INICIALIZAR
   ========================================================= */

if (
  plannerReady
) {

  populatePlannerSpots();


  setPlannerStatus(
    'Elige un origen y un Photo Spot para empezar.'
  );


  console.log(
    '🧭 Planificador PRO iniciado.'
  );

}


/* =========================================================
   FIN FASE 3.5
   ========================================================= */

   /* =========================================================
   FASE 3.6 · MAPA EUROPA PRO
   CAPA DE CALLES / CIUDADES
   ========================================================= */

const europeStreetMap =
  L.tileLayer(

    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',

    {

      maxZoom:
        19,

      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'

    }

  );


/* =========================================================
   ACTIVAR MAPA DE CALLES
   ========================================================= */

europeStreetMap.addTo(
  map
);


/* =========================================================
   CONTROL DE CAPAS
   ========================================================= */

const baseMaps = {

  '🗺️ Mapa': europeStreetMap,

  '🛰️ Satélite':
    typeof satelliteLayer !==
    'undefined'
      ? satelliteLayer
      : null

};


/*
   Eliminamos entradas que no existan.
*/

Object.keys(
  baseMaps
).forEach(

  key => {

    if (
      !baseMaps[key]
    ) {

      delete baseMaps[key];

    }

  }

);


/* =========================================================
   CONTROL DE MAPAS
   ========================================================= */

L.control.layers(

  baseMaps,

  null,

  {

    position:
      'topright',

    collapsed:
      true

  }

).addTo(
  map
);


/* =========================================================
   CESIUM ION · TOKEN
   =========================================================
   Pega aquí el token que acabas de crear en Cesium ion.
   NO publiques este archivo con el token en repositorios públicos
   hasta haber configurado correctamente las restricciones de URL.
   ========================================================= */

const CESIUM_ION_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IloyaTRoRW5yYTEtMUlSYlciLCJqdGkiOiJjNjBjYTAyNC05NWNhLTQ4YjctYTFiZS02MWU0NzhiNWQyM2YiLCJpZCI6NDcwNDA0LCJzdWIiOiJhbnRvbmktdGVjaCIsImlzcyI6Imh0dHBzOi8vYXBpLmNlc2l1bS5jb20iLCJhdWQiOiJHcmFuZCBUb3VyIGRlIFN1aXphIiwiaWF0IjoxNzg3MzE5OTEyfQ.mdavG38Gi-pQd-LxkprwfD-zDj8RxcoeqLp0bOW3sUI';

/* =========================================================
   VISTA 3D · RELIEVE DE SUIZA · v4
   ---------------------------------------------------------
   - Sin sceneModePicker nativo: evitamos que Cesium recoloque
     la cámara de forma inesperada.
   - Único control propio: Relieve 3D.
   - Siempre encuadra Suiza.
   - Los controles viven fuera de #grandTour3DViewer para que
     viewerEl.innerHTML = '' no los elimine.
   ========================================================= */

let cesiumViewer = null;
let cesiumLoading = null;

const SUISSE_VIEW = {
  west: 5.8,
  south: 45.7,
  east: 10.7,
  north: 47.9,
  centerLng: 8.23,
  centerLat: 46.82,
  overviewHeight: 430000,
  reliefHeight: 220000,
  spotHeight: 18000,
  minHeight: 1200
};

function create3DModal() {
  let modal = document.getElementById('grandTour3DModal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'grandTour3DModal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="gt3d-backdrop" data-close-3d></div>
    <div class="gt3d-panel" role="dialog" aria-modal="true" aria-label="Relieve 3D">
      <div class="gt3d-header">
        <div>
          <div class="gt3d-kicker">🏔️ GRAND TOUR DE SUIZA</div>
          <div class="gt3d-title">Relieve 3D</div>
        </div>

        <div class="gt3d-tools">
          <button type="button" class="gt3d-mode-btn active" data-gt3d-3d title="Relieve 3D">🌐</button>
          <button type="button" class="gt3d-close" data-close-3d aria-label="Cerrar">×</button>
        </div>
      </div>

      <div id="grandTour3DViewer" class="gt3d-viewer">
        <div class="gt3d-loading">Cargando terreno 3D…</div>
      </div>

      <div class="gt3d-footer">
        <span>🏔️ Terreno 3D · 🛰️ Imágenes satélite</span>
        <span>Arrastra para rotar · rueda para acercar/alejar.</span>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.id = 'grandTour3DStyles';
  style.textContent = `
    #grandTour3DModal{position:fixed;inset:0;z-index:99999}
    #grandTour3DModal[hidden]{display:none}
    .gt3d-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(3px)}
    .gt3d-panel{position:absolute;inset:4vh 4vw;display:flex;flex-direction:column;overflow:hidden;border:1px solid #294b60;border-radius:18px;background:#061823;box-shadow:0 20px 70px rgba(0,0,0,.65)}
    .gt3d-header{min-height:66px;display:flex;align-items:center;justify-content:space-between;padding:10px 14px 10px 18px;color:#fff;gap:12px}
    .gt3d-kicker{color:#ffd400;font-size:11px;font-weight:900;letter-spacing:.08em}
    .gt3d-title{margin-top:3px;font-size:22px;font-weight:900}
    .gt3d-tools{display:flex;align-items:center;gap:6px}
    .gt3d-mode-btn,.gt3d-close{width:42px;height:42px;border:0;border-radius:10px;background:#173246;color:#fff;font-size:20px;cursor:pointer}
    .gt3d-mode-btn:hover,.gt3d-close:hover{background:#23485f}
    .gt3d-mode-btn.active{background:#2d86c5;box-shadow:0 0 0 2px rgba(255,255,255,.18) inset}
    .gt3d-close{border-radius:50%;font-size:28px;margin-left:4px}
    .gt3d-viewer{position:relative;flex:1;min-height:320px;background:#17202a}
    .gt3d-loading{position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-weight:800;z-index:2;text-align:center}
    .gt3d-footer{display:flex;justify-content:space-between;gap:15px;padding:8px 14px;color:#c7d3da;font-size:11px;border-top:1px solid #294b60}
    @media(max-width:700px){
      .gt3d-panel{inset:1vh 1vw;border-radius:12px}
      .gt3d-footer{flex-direction:column;gap:4px}
      .gt3d-mode-btn,.gt3d-close{width:38px;height:38px}
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(modal);

  modal.querySelectorAll('[data-close-3d]').forEach(el => {
    if (el && typeof el.addEventListener === 'function') {
      el.addEventListener('click', close3DViewer);
    }
  });

  const mode3DBtn = modal.querySelector('[data-gt3d-3d]');

  if (mode3DBtn) mode3DBtn.addEventListener('click', () => {
    if (cesiumViewer) showSwitzerland3D();
  });

  return modal;
}

function setCesiumModeButton(mode) {
  const modal = document.getElementById('grandTour3DModal');
  if (!modal) return;

  const b3d = modal.querySelector('[data-gt3d-3d]');
  const b2d = modal.querySelector('[data-gt3d-2d]');

  if (b3d) b3d.classList.toggle('active', mode === '3D');
  if (b2d) b2d.classList.toggle('active', mode === '2D');
}

function suisseRectangle(Cesium) {
  return Cesium.Rectangle.fromDegrees(
    SUISSE_VIEW.west,
    SUISSE_VIEW.south,
    SUISSE_VIEW.east,
    SUISSE_VIEW.north
  );
}

function showSwitzerland3D() {
  if (!cesiumViewer || !window.Cesium) return;

  const Cesium = window.Cesium;
  if (cesiumViewer.scene.mode !== Cesium.SceneMode.SCENE3D) {
    cesiumViewer.scene.morphTo3D(0);
  }

  cesiumViewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      SUISSE_VIEW.centerLng,
      SUISSE_VIEW.centerLat,
      SUISSE_VIEW.reliefHeight
    ),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-48),
      roll: 0
    },
    duration: 1.1,
    complete: () => {
      setCesiumModeButton('3D');
    }
  });
}

function showSwitzerland2D() {
  if (!cesiumViewer || !window.Cesium) return;

  const Cesium = window.Cesium;

  cesiumViewer.camera.flyTo({
    destination: suisseRectangle(Cesium),
    duration: 1.0,
    complete: () => {
      setCesiumModeButton('2D');
    }
  });
}

function switchCesiumMode(mode) {
  if (!cesiumViewer || !window.Cesium) return;

  const Cesium = window.Cesium;

  try {
    if (mode === '2D') {
      cesiumViewer.scene.morphTo2D(0.8);
      setTimeout(() => {
        if (!cesiumViewer) return;
        showSwitzerland2D();
      }, 850);
      return;
    }

    cesiumViewer.scene.morphTo3D(0.8);
    setTimeout(() => {
      if (!cesiumViewer) return;
      showSwitzerland3D();
    }, 850);
  } catch (error) {
    console.warn('No se pudo cambiar el modo Cesium:', error);
    if (mode === '2D') showSwitzerland2D();
    else showSwitzerland3D();
  }
}

function loadCesium() {
  if (window.Cesium) return Promise.resolve(window.Cesium);
  if (cesiumLoading) return cesiumLoading;

  cesiumLoading = new Promise((resolve, reject) => {
    if (!document.getElementById('cesiumStyles')) {
      const css = document.createElement('link');
      css.id = 'cesiumStyles';
      css.rel = 'stylesheet';
      css.href = 'https://cesium.com/downloads/cesiumjs/releases/1.132/Build/Cesium/Widgets/widgets.css';
      document.head.appendChild(css);
    }

    const script = document.createElement('script');
    script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.132/Build/Cesium/Cesium.js';
    script.onload = () => resolve(window.Cesium);
    script.onerror = () => reject(new Error('No se pudo cargar CesiumJS.'));
    document.head.appendChild(script);
  });

  return cesiumLoading;
}

async function open3DViewer() {
  const modal = create3DModal();
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  const viewerEl = document.getElementById('grandTour3DViewer');
  if (!viewerEl) {
    console.error('No existe #grandTour3DViewer.');
    return;
  }

  try {
    const Cesium = await loadCesium();

    if (
      !CESIUM_ION_ACCESS_TOKEN ||
      CESIUM_ION_ACCESS_TOKEN === 'PEGA_AQUI_TU_TOKEN_DE_CESIUM_ION'
    ) {
      throw new Error('Falta configurar el Access Token de Cesium ion.');
    }

    Cesium.Ion.defaultAccessToken = CESIUM_ION_ACCESS_TOKEN;

    if (!cesiumViewer) {
      viewerEl.innerHTML = '';

      const terrain = Cesium.Terrain.fromWorldTerrain({
        requestVertexNormals: true
      });

      cesiumViewer = new Cesium.Viewer(viewerEl, {
        terrain,
        animation: false,
        timeline: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        infoBox: false,
        selectionIndicator: false,
        shouldAnimate: false
      });

      cesiumViewer.imageryLayers.removeAll();

      const worldImagery = await Cesium.createWorldImageryAsync({
        style: Cesium.IonWorldImageryStyle.AERIAL
      });

      cesiumViewer.imageryLayers.addImageryProvider(worldImagery);
      cesiumViewer.scene.globe.enableLighting = true;

      const spots3D = Array.isArray(window.SPOTS) ? window.SPOTS : [];

      spots3D.forEach(spot => {
        if (typeof spot.lat !== 'number' || typeof spot.lng !== 'number') return;

        cesiumViewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(spot.lng, spot.lat, 50),
          point: {
            pixelSize: 9,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          },
          label: {
            text: String(spot.id).padStart(2, '0'),
            font: '700 12px sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -10),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString('#e11')
          },
          name: `${String(spot.id).padStart(2, '0')} · ${spot.name}`
        });
      });

      /* Limitar el zoom para que no atraviese el terreno. */
      cesiumViewer.camera.changed.addEventListener(() => {
        if (!cesiumViewer) return;

        const carto = cesiumViewer.camera.positionCartographic;
        if (!carto || !Number.isFinite(carto.height)) return;

        if (
          cesiumViewer.scene.mode === Cesium.SceneMode.SCENE3D &&
          carto.height < SUISSE_VIEW.minHeight
        ) {
          cesiumViewer.camera.zoomOut(
            SUISSE_VIEW.minHeight - carto.height
          );
        }
      });
    }

    cesiumViewer.resize();

    /* Al abrir: siempre encuadramos Suiza, nunca el último punto visitado. */
    if (cesiumViewer.scene.mode !== Cesium.SceneMode.SCENE3D) {
      cesiumViewer.scene.morphTo3D(0);
    }

    showSwitzerland3D();

  } catch (error) {
    console.error('Error cargando la vista 3D:', error);

    viewerEl.innerHTML = `
      <div class="gt3d-loading">
        ⚠️ No se pudo cargar el relieve 3D.<br>
        ${String(error && error.message ? error.message : error)}
      </div>
    `;
  }
}

function close3DViewer() {
  const modal = document.getElementById('grandTour3DModal');
  if (modal) modal.hidden = true;
  document.body.style.overflow = '';
}

const threeDControl = L.Control.extend({
  options: { position: 'topright' },

  onAdd: function () {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const button = L.DomUtil.create('a', '', container);

    button.href = '#';
    button.title = 'Abrir relieve 3D';
    button.setAttribute('aria-label', 'Abrir relieve 3D');
    button.innerHTML = '🏔️';

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.on(button, 'click', function (event) {
      L.DomEvent.stop(event);
      open3DViewer();
    });

    return container;
  }
});

new threeDControl().addTo(map);

document.addEventListener('keydown', event => {
  const modal = document.getElementById('grandTour3DModal');
  if (event.key === 'Escape' && modal && !modal.hidden) {
    close3DViewer();
  }
});

/* =========================================================
   FASE 3.6 · MARCADOR DEL ORIGEN DEL PLANIFICADOR
   ========================================================= */

let plannerOriginMarker = null;


/* =========================================================
   MOSTRAR ORIGEN EN EL MAPA
   ========================================================= */

function showPlannerOriginOnMap() {

  if (
    !plannerOrigin ||
    typeof map === 'undefined' ||
    !map
  ) {
    return;
  }


  const lat =
    Number(
      plannerOrigin.lat
    );

  const lng =
    Number(
      plannerOrigin.lng
    );


  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return;
  }


  /* -------------------------------------------------------
     Eliminar marcador anterior
     ------------------------------------------------------- */

  if (
    plannerOriginMarker
  ) {

    map.removeLayer(
      plannerOriginMarker
    );

    plannerOriginMarker =
      null;

  }


  /* -------------------------------------------------------
     Crear icono del origen
     ------------------------------------------------------- */

  const originIcon =
    L.divIcon({

      className:
        'planner-origin-marker',

      html: `

        <div style="
          width:34px;
          height:34px;
          border-radius:50%;
          background:#1677ff;
          border:4px solid #ffffff;
          box-shadow:0 3px 12px rgba(0,0,0,.45);
          display:flex;
          align-items:center;
          justify-content:center;
          color:#ffffff;
          font-size:16px;
        ">
          📍
        </div>

      `,

      iconSize:
        [34, 34],

      iconAnchor:
        [17, 17]

    });


  /* -------------------------------------------------------
     Crear marcador
     ------------------------------------------------------- */

  plannerOriginMarker =
    L.marker(

      [
        lat,
        lng
      ],

      {
        icon:
          originIcon,

        zIndexOffset:
          5000

      }

    );


  /* -------------------------------------------------------
     Popup
     ------------------------------------------------------- */

  plannerOriginMarker.bindPopup(`

    <div style="
      min-width:170px;
      font-family:Arial,sans-serif;
    ">

      <strong style="
        display:block;
        margin-bottom:5px;
        font-size:14px;
      ">
        📍 ORIGEN
      </strong>

      <span style="
        font-size:12px;
      ">
        ${escapePlannerHTML(
          plannerOriginName ||
          'Punto de partida'
        )}
      </span>

    </div>

  `);


  plannerOriginMarker.addTo(
    map
  );


  /* -------------------------------------------------------
     Abrir popup
     ------------------------------------------------------- */

  plannerOriginMarker.openPopup();

}


/* =========================================================
   ACTUALIZAR LA FUNCIÓN DE SELECCIÓN DE ORIGEN
   ========================================================= */

const originalChoosePlannerOrigin =
  choosePlannerOrigin;


/*
   Guardamos la función original y añadimos
   el marcador después de seleccionar.
*/

choosePlannerOrigin =
  function(result) {

    originalChoosePlannerOrigin(
      result
    );


    setTimeout(

      () => {

        showPlannerOriginOnMap();

      },

      50

    );

  };


/* =========================================================
   ACTUALIZAR MI UBICACIÓN
   ========================================================= */

const originalPlannerUseCurrentLocation =
  plannerUseCurrentLocation;


plannerUseCurrentLocation =
  function() {

    originalPlannerUseCurrentLocation();


    setTimeout(

      () => {

        showPlannerOriginOnMap();

      },

      100

    );

  };


/* =========================================================
   FIN MARCADOR DE ORIGEN
   ========================================================= */