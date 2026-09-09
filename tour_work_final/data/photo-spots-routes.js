/* =========================================================
   PHOTO SPOTS · DESTINOS DE RUTA (PARKING / ACCESO / SENDERO)
   ---------------------------------------------------------
   Estructura preparada para coordenadas reales y verificadas
   de cada Photo Spot. Mientras un destino no tenga sus
   coordenadas, el botón de navegación correspondiente no se
   muestra en el panel derecho.

   NO rellenar con coordenadas aproximadas, calculadas o
   inventadas: solo datos verificados.

   Clave del objeto = id del Photo Spot (mismo id que en
   data/spots.js y data/photo-spots-info.js).

   Campos disponibles por spot (todos opcionales):
     parkingName, parkingAddress, parkingLat, parkingLng
     accessName,  accessAddress,  accessLat,  accessLng
     trailName,   trailAddress,   trailLat,   trailLng

   Ejemplo (no activo, solo referencia de formato):

   1: {
     parkingName: 'Aparcamiento estación de Betten',
     parkingAddress: 'Furkastrasse, 3983 Betten',
     parkingLat: 46.3766,
     parkingLng: 8.0577,

     accessName: 'Estación de góndola Bettmeralp',
     accessAddress: 'Furkastrasse 39, 3983 Mörel-Filet',
     accessLat: 46.3771,
     accessLng: 8.0581,

     trailName: null,
     trailAddress: null,
     trailLat: null,
     trailLng: null
   }
   ========================================================= */

window.PHOTO_SPOTS_ROUTES = {

  /*
     PHOTO SPOT 1 (Bettmeralp – Aletsch Arena).
     Parking y acceso: coordenadas reales y verificadas
     (Aletsch Arena / Outdooractive). Sendero: sin coordenada
     real verificada del punto de inicio todavía, por lo que
     se deja sin *Lat/*Lng y su botón no debe mostrarse.
  */
  1: {
    parkingName: 'Parking Bettmeralp Talstation',
    parkingAddress: 'Bettmeralp Talstation, 3993 Grengiols',
    parkingLat: 46.371273,
    parkingLng: 8.076861,

    accessName: 'Bettmeralp Talstation',
    accessAddress: 'Furkastrasse 22, 3993 Grengiols',
    accessLat: 46.371036,
    accessLng: 8.076839,

    trailName: 'Bettmeralp – estación de montaña del teleférico (inicio del sendero Culture Discovery)',
    trailAddress: 'Bettmeralp Bergstation, 3992 Bettmeralp',
    trailLat: 46.386253,
    trailLng: 8.057598
  },

  /* PHOTO SPOT 2 (Gornergrat – Matterhorn). Fuente: OSM/Nominatim (nombres exactos). */
  2: {
    parkingName: 'Parkhaus Matterhorn Terminal Täsch',
    parkingAddress: 'Kantonsstrasse, 3929 Täsch',
    parkingLat: 46.0689369,
    parkingLng: 7.7753046,

    accessName: 'Bahnhof Zermatt Gornergratbahn (estación de valle)',
    accessAddress: 'Bahnhofstrasse, 3920 Zermatt',
    accessLat: 46.0239843,
    accessLng: 7.7486385,

    trailName: 'Gornergrat (estación superior)',
    trailAddress: 'Gornergrat, 3920 Zermatt',
    trailLat: 45.9832411,
    trailLng: 7.7821890
  },

  /* PHOTO SPOT 3 (Thun). Sin coordenadas verificables encontradas. */
  3: {
    parkingName: 'Parking City Ost Schlossberg',
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Bälliz 61a / Mühlebrücke, Thun',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 4 (Swissminiatur). Fuente: OSM (P+Rail Melide, junto a Via Cantonale). */
  4: {
    parkingName: 'P+Rail Melide',
    parkingAddress: 'Via Cantonale, 6815 Melide',
    parkingLat: 45.954326,
    parkingLng: 8.951179,

    accessName: 'Swissminiatur (taquilla)',
    accessAddress: 'Via Cantonale, 6815 Melide',
    accessLat: 45.9541005,
    accessLng: 8.9502496,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 5 (Castillo Wyher). Fuente: Wikipedia/GeoHack (coordenadas oficiales del castillo, que es el propio destino de acceso descrito). */
  5: {
    parkingName: 'Aparcamiento del castillo',
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Schloss Wyher',
    accessAddress: 'Wyherstrasse, 6218 Ettiswil',
    accessLat: 47.14203,
    accessLng: 8.02378,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 6 (Monte San Giorgio). Sin coordenadas verificables encontradas. */
  6: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Via Maroggia, 6816 Bissone',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 7 (Lavaux). Sin coordenadas verificables encontradas. */
  7: {
    parkingName: '5 plazas gratuitas junto al Photo Spot',
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Route de Vevey, 1071 Chexbres',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 8 (Parco San Michele). Fuente: OSM/Nominatim (centroide del parque, nombre exacto). */
  8: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Parco San Michele',
    accessAddress: 'Cassarate, 6976 Lugano',
    accessLat: 46.0046519,
    accessLng: 8.9735373,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 9 (Muottas Muragl). Fuente: OSM/Nominatim + muottasmuragl.ch (oficial). */
  9: {
    parkingName: 'Punt Muragl (estación de valle)',
    parkingAddress: 'Via da Bernina, 7503 Samedan',
    parkingLat: 46.5096861,
    parkingLng: 9.8812626,

    accessName: 'Punt Muragl (estación de valle del funicular)',
    accessAddress: 'Punt Muragl 3, 7503 Samedan',
    accessLat: 46.5096861,
    accessLng: 9.8812626,

    trailName: 'Muottas Muragl (cima / mirador)',
    trailAddress: 'Muottas Muragl, 7503 Samedan',
    trailLat: 46.5239561,
    trailLng: 9.9098329
  },

  /* PHOTO SPOT 10 (Cuevas de Vallorbe). Fuente: OSM/Nominatim + grottesdevallorbe.ch (oficial). */
  10: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Grottes de Vallorbe (entrada/taquilla)',
    accessAddress: 'Chemin de la Résurgence 1, 1337 Vallorbe',
    accessLat: 46.6983370,
    accessLng: 6.3457703,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 11 (Engadina – St. Moritz). Fuente: OSM/Nominatim (hotel, dirección exacta). */
  11: {
    parkingName: 'Waldhaus am See',
    parkingAddress: 'Via Dimlej 6, 7500 St. Moritz',
    parkingLat: 46.4971406,
    parkingLng: 9.8490428,

    accessName: null,
    accessAddress: null,
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 12 (Davos – Klosters). Fuente: OSM/Nominatim (edificio "Wägerhus" exacto). */
  12: {
    parkingName: 'Car park Wägerhus',
    parkingAddress: 'Flüelapassstrasse, 7260 Davos',
    parkingLat: 46.7796793,
    parkingLng: 9.9281427,

    accessName: null,
    accessAddress: 'Unteres Wägerhus, 7260 Davos',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 13 (Grosser Mythen). Fuente: OSM/Nominatim (estación de teleférico exacta). */
  13: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Rotenflue (Mythenregion) – estación superior del teleférico',
    accessAddress: 'Ibergereggstrasse, 6432 Rickenbach SZ',
    accessLat: 47.0208690,
    accessLng: 8.7032342,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 14 (Aarburg). Sin coordenadas verificables encontradas (solo tramo de calle genérico). */
  14: {
    parkingName: 'Landhausstrasse 15, junto al Photo Spot',
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Landhausstrasse 15, 4663 Aarburg',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 15 (Badhütte – Rorschach). Sin coordenadas verificables encontradas. */
  15: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Seepromenade, Thurgauerstrasse 38, 9400 Rorschach',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 16 (Stäfa). Sin coordenadas verificables encontradas. */
  16: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Schiffssteg Stäfa, 8712 Stäfa',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 17 (Niesen). Fuente: OSM/Nominatim (parada del tren de cremallera exacta). */
  17: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Mülenen (Niesenbahn) – estación de valle',
    accessAddress: 'Heustrichstrasse, 3711 Mülenen',
    accessLat: 46.6394204,
    accessLng: 7.6902147,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 18 (Cataratas del Rin). Fuente: Wikipedia/GeoHack (Schloss Laufen, coincide con el parking gratuito descrito en la ficha oficial). */
  18: {
    parkingName: 'Schloss Laufen',
    parkingAddress: 'Laufen 5, 8447 Dachsen',
    parkingLat: 47.676667,
    parkingLng: 8.615,

    accessName: null,
    accessAddress: 'Rheinfall, Schloss Laufen, 8447 Dachsen',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 19 (Val Surses). Sin coordenadas verificables encontradas. */
  19: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Val Surses, Bavegna / región de Savognin y Bivio',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 20 (Granero típico del Valais en Goms, Reckingen). Sin coordenadas verificables encontradas. */
  20: {
    parkingName: 'Estación de tren de Reckingen, de pago',
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Unterdorf 10, 3998 Reckingen',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 21 (Erlach). Sin coordenadas verificables suficientemente precisas. */
  21: {
    parkingName: null,
    parkingAddress: 'Seestrandweg, junto al Restaurant Du Port, Erlach',
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Hoggenberg 5, 3235 Erlach',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 22 (Piz Bernina). Fuente: OSM/Nominatim (estación de Morteratsch, misma carretera/dirección descrita). */
  22: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Morteratsch (estación)',
    accessAddress: 'Via Morteratsch, 7504 Pontresina',
    accessLat: 46.4507365,
    accessLng: 9.9404320,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 23 (Landquart Fashion Outlet). Fuente: OSM/Nominatim (misma dirección exacta: Tardisstrasse 20a). */
  23: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Landquart Fashion Outlet',
    accessAddress: 'Tardisstrasse 20a, 7302 Landquart',
    accessLat: 46.9660916,
    accessLng: 9.5526307,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 24 (Ascona). Sin coordenadas verificables encontradas. */
  24: {
    parkingName: 'Aparcamiento del paseo ribereño degli Angioli',
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Paseo ribereño de Ascona, Ascona',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 25 (Abadía de Saint-Maurice). Fuente: OSM/Nominatim (Abbaye de Saint Maurice, dirección exacta). */
  25: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Abbaye de Saint-Maurice',
    accessAddress: "Avenue d'Agaune 15, 1890 Saint-Maurice",
    accessLat: 46.2192844,
    accessLng: 7.0037384,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 26 (Pays-d'Enhaut). Sin coordenadas verificables encontradas. */
  26: {
    parkingName: 'Aparcamientos públicos en Château-d’Oex',
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: "Château-d'Oex / Pays-d'Enhaut",
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 27 (Puerto de Morges). Sin coordenadas verificables suficientemente precisas (solo tramos de quai genéricos). */
  27: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Quai de Morges, Morges',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 28 (Castillo de Burgdorf). Fuente: OSM/Nominatim (edificio en Sägegasse 1, dirección exacta). */
  28: {
    parkingName: 'Parking Schafrothmatte',
    parkingAddress: 'Sägegasse 1, 3400 Burgdorf',
    parkingLat: 47.0577949,
    parkingLng: 7.6292222,

    accessName: null,
    accessAddress: 'Castillo de Burgdorf, Burgdorf',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 29 (Palacio de Stockalper). Fuente: OSM/Nominatim (Parkhaus Altstadt + Stockalperschloss, nombres exactos). */
  29: {
    parkingName: 'Parkhaus Altstadt',
    parkingAddress: 'Neue Simplonstrasse, 3900 Brig',
    parkingLat: 46.3148924,
    parkingLng: 7.9893110,

    accessName: 'Stockalperschloss',
    accessAddress: 'Alte Simplonstrasse 28, 3900 Brig',
    accessLat: 46.315167,
    accessLng: 7.990837,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 30 (Pirámides de tierra de Euseigne). Fuente: OSM/Nominatim (panel informativo en el mirador, sobre la carretera). */
  30: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: "Pyramides d'Euseigne (mirador)",
    accessAddress: 'Rue Principale, Euseigne, Hérémence',
    accessLat: 46.1730590,
    accessLng: 7.4180747,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 31 (Cardada). Fuente: OSM/Nominatim (Funivia Orselina-Cardada, nombre exacto). */
  31: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Funivia Orselina – Cardada (estación de valle)',
    accessAddress: 'San Bernardo, Orselina',
    accessLat: 46.1832945,
    accessLng: 8.7869506,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 32 (Maloja). Sin coordenadas verificables encontradas. */
  32: {
    parkingName: 'Aparcamientos públicos de Maloja',
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Maloja, Engadina',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 33 (San Galo). Fuente: OSM/Nominatim (edificio en Dreilindenstrasse 50, dirección exacta). */
  33: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Drei Weieren (Dreilinden)',
    accessAddress: 'Dreilindenstrasse 50, 9011 St. Gallen',
    accessLat: 47.4231109,
    accessLng: 9.3906101,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 34 (Gran Glaciar Aletsch). Fuente: OSM/Nominatim.
     NOTA: el edificio verificado en esa dirección está etiquetado "alte Talstation"
     (estación de VALLE), no "Bergstation" (estación superior) como indica el texto
     existente; por precaución se etiqueta como estación de valle y no se asume que
     sea la cima de Eggishorn. */
  34: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Estación de valle del teleférico (Fiesch)',
    accessAddress: 'Furkastrasse 61, 3984 Fiesch',
    accessLat: 46.4050996,
    accessLng: 8.1366011,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 35 (Alpstein). Fuente: OSM/Nominatim (Luftseilbahn Hoher Kasten, nombre exacto). */
  35: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Luftseilbahn Hoher Kasten (estación de valle)',
    accessAddress: 'Pfannenstielstrasse, 9058 Brülisau',
    accessLat: 47.2901241,
    accessLng: 9.4708828,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 36 (Montaña Pizol). Sin coordenadas verificables encontradas. */
  36: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Pizol, Bad Ragaz/Wangs',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 37 (Casa de Heidi). Fuente: OSM/Nominatim (Heidihof + Heididorf, nombres exactos, sitio oficial heididorf.ch). */
  37: {
    parkingName: 'Heidihof',
    parkingAddress: 'Bovelweg 16, 7304 Maienfeld',
    parkingLat: 47.0172970,
    parkingLng: 9.5442977,

    accessName: 'Heididorf',
    accessAddress: 'Bovel, 7304 Maienfeld',
    accessLat: 47.0132367,
    accessLng: 9.5451067,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 38 (Stein am Rhein). Fuente: OSM/Nominatim (parada "Stein am Rhein Untertor", nombre exacto). */
  38: {
    parkingName: 'Aparcamiento Untertor',
    parkingAddress: 'Hemishoferstrasse, 8260 Stein am Rhein',
    parkingLat: 47.6615010,
    parkingLng: 8.8573226,

    accessName: null,
    accessAddress: null,
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 39 (Gruyères). Fuente: OSM/Nominatim (Château de Gruyères, nombre exacto). */
  39: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Château de Gruyères',
    accessAddress: 'Chemin de ronde, Epagny, 1663 Gruyères',
    accessLat: 46.5847869,
    accessLng: 7.0840530,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 40 (Meilen). Sin coordenadas verificables encontradas. */
  40: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Meilen, lago de Zúrich',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 41 (Castel San Pietro). Solo se encontró el centro de la localidad (rechazado por regla). */
  41: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Castel San Pietro, Mendrisiotto',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 42 (Tremola). Sin coordenadas verificables encontradas (carretera histórica, sin POI único). */
  42: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Tremola, paso de San Gotardo',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 43 (Gemmi 2350 – Leukerbad). Fuente: OSM/Nominatim (Gemmibahn, nombre exacto). */
  43: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Gemmibahn (estación de valle)',
    accessAddress: 'Gemmistrasse, 3954 Leukerbad',
    accessLat: 46.3908220,
    accessLng: 7.6208440,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 44 (Stockhorn – Simmental). Fuente: OSM/Nominatim (Stockhornbahn, tramo de valle). */
  44: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Stockhornbahn (estación de valle)',
    accessAddress: 'Simmentalstrasse, 3762 Erlenbach im Simmental',
    accessLat: 46.6719618,
    accessLng: 7.5438537,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 45 (Región Dents du Midi, Morgins). Sin coordenadas verificables encontradas. */
  45: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Morgins, Dents du Midi',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 46 (Morcote). Fuente: OSM/Nominatim (Porto Comunale Vedo-Arbostora). */
  46: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Porto Comunale Vedo-Arbostora',
    accessAddress: "Strada Professore Teucro Isella, Morcote",
    accessLat: 45.9306468,
    accessLng: 8.9010707,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 47 (San Bernardino). Sin coordenadas verificables encontradas. */
  47: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'San Bernardino, pueblo y paso',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 48 (Romanshorn). Fuente: OSM/Nominatim (localidad "Hafen", puerto de Romanshorn). */
  48: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Hafen Romanshorn',
    accessAddress: 'Im Bahnhof, 8590 Romanshorn',
    accessLat: 47.5657442,
    accessLng: 9.3803444,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 49 (Tower of Hospental). Fuente: Wikipedia/GeoHack (coordenadas oficiales de la torre, accesible directamente desde el pueblo). */
  49: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Turm der Herren von Hospental',
    accessAddress: '6493 Hospental',
    accessLat: 46.61869,
    accessLng: 8.56678,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 50 (Ferry del Lago de Lucerna). Fuente: OSM/Nominatim (terminal de ferry, nombre exacto). */
  50: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Beckenried Niederdorf (embarcadero del ferry)',
    accessAddress: 'Buochserstrasse, 6375 Beckenried',
    accessLat: 46.9719503,
    accessLng: 8.4596176,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 51 (Bellinzona). Fuente: OSM/Nominatim (Castelgrande, nombre exacto). */
  51: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Castelgrande',
    accessAddress: 'Salita al Castel Grande, 6503 Bellinzona',
    accessLat: 46.1929023,
    accessLng: 9.0217456,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 52 (Matterhorn, Zermatt). Sin coordenadas verificables suficientemente precisas (zona amplia de miradores). */
  52: {
    parkingName: null,
    parkingAddress: 'Aparcamientos en Täsch; Zermatt es libre de coches',
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Zermatt / zona de vistas del Matterhorn',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 53 (Obermutten). Fuente: OSM/Nominatim (núcleo del propio pueblo, que es el destino descrito). */
  53: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Obermutten (pueblo)',
    accessAddress: 'Obermutten, Thusis',
    accessLat: 46.6721710,
    accessLng: 9.4842914,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 54 (Monte Generoso). Fuente: OSM/Nominatim (parking y depósito del ferrocarril, nombres exactos). */
  54: {
    parkingName: 'Parcheggio Monte Generoso',
    parkingAddress: 'Via Segoma, Ronco, 6825 Capolago',
    parkingLat: 45.9016810,
    parkingLng: 8.9771853,

    accessName: 'Ferrovia Monte Generoso (estación de Capolago)',
    accessAddress: 'Via Lüera 1, Ronco, 6825 Capolago',
    accessLat: 45.9046695,
    accessLng: 8.9792916,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 55 (Rolle). Fuente: OSM/Nominatim (Port de Rolle, nombre exacto). */
  55: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Port de Rolle',
    accessAddress: 'Rue du Port, 1180 Rolle',
    accessLat: 46.4524071,
    accessLng: 6.3362623,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 56 (Ginebra). Fuente: OSM/Nominatim (Jet d'eau, el propio destino descrito en el acceso). */
  56: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: null,
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 57 (Glaciares de Bernina). Misma dirección exacta que el Photo Spot 22 (Morteratsch); reutilizamos la misma coordenada ya verificada. */
  57: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Morteratsch (estación)',
    accessAddress: 'Via Morteratsch, 7504 Pontresina',
    accessLat: 46.4507365,
    accessLng: 9.9404320,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 58 (Höhematte – Interlaken). Fuente: OSM/Nominatim (parque Höhematte, nombre exacto). */
  58: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Höhematte',
    accessAddress: '3800 Interlaken',
    accessLat: 46.6860146,
    accessLng: 7.8573349,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 59 (Niederhorn). Fuente: OSM (Beatenbucht (See), terminal de barco BLS, punto de trasbordo hacia el teleférico de Niederhorn). */
  59: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Beatenbucht (See) – embarcadero/estación de transbordo',
    accessAddress: 'Seestrasse, 3658 Sigriswil',
    accessLat: 46.6865419,
    accessLng: 7.7460315,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 60 (Mendrisiotto). Sin coordenadas verificables encontradas. */
  60: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Mendrisio, La Torre / casco histórico',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 61 (Castillo Hünegg). Fuente: OSM/Nominatim (edificio exacto). */
  61: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Schloss Hünegg',
    accessAddress: 'Staatsstrasse 52, Hünibach, 3652 Hilterfingen',
    accessLat: 46.7377699,
    accessLng: 7.6548958,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 62 (Los Siete Churfirsten). Fuente: OSM/Nominatim (Hotel Hirschen + Talstation Iltios/Chäserrugg, nombres exactos). */
  62: {
    parkingName: 'Hotel Hirschen',
    parkingAddress: 'Dorf 1b, 9658 Wildhaus',
    parkingLat: 47.2034448,
    parkingLng: 9.3498445,

    accessName: 'Talstation Iltios (Chäserrugg)',
    accessAddress: 'Iltios, 9657 Unterwasser',
    accessLat: 47.185268,
    accessLng: 9.311828,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 63 (Friburgo). Fuente: OSM/Nominatim (Pont du Gottéron, nombre exacto). */
  63: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Pont du Gottéron',
    accessAddress: 'Bürglenstrasse / Route de Bourguillon, 1722 Fribourg',
    accessLat: 46.8045042,
    accessLng: 7.1719389,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 64 (Garganta de Viamala). Fuente: Wikipedia/GeoHack (coordenada de la garganta; el texto confirma un Parkplatz mit Kiosk en la entrada, que usamos como parking y acceso). */
  64: {
    parkingName: 'Viamala-Schlucht (Parkplatz mit Kiosk)',
    parkingAddress: 'Viamalastrasse, 7430 Thusis',
    parkingLat: 46.665922,
    parkingLng: 9.449147,

    accessName: 'Viamala-Schlucht (centro de visitantes)',
    accessAddress: 'Viamalastrasse, 7430 Thusis',
    accessLat: 46.665922,
    accessLng: 9.449147,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 65 (Lago de Constanza – Obersee, Altnau). Sin coordenadas verificables encontradas. */
  65: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Hafenquai Altnau, Hafenstrasse 3, 8595 Altnau',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 66 (Sion). Fuente: OSM/Nominatim (Bisse de Montorge, nombre exacto). */
  66: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: null,
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 67 (Lucerna). Fuente: OSM/Nominatim (Château Gütsch, nombre exacto). */
  67: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Château Gütsch',
    accessAddress: 'Kanonenstrasse 1, 6003 Luzern',
    accessLat: 47.0516689,
    accessLng: 8.2949170,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 68 (Saint-Ursanne). Fuente: OSM/Nominatim (Pont St-Jean, nombre exacto). */
  68: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Pont St-Jean',
    accessAddress: 'En Chavatte, 2882 Saint-Ursanne',
    accessLat: 47.3640295,
    accessLng: 7.1547640,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 69 (Cabrio Stanserhorn). Fuente: OSM/Nominatim (estación del teleférico Stanserhorn-Rinderalp).
     NOTA: no se pudo confirmar si es exactamente la estación de valle o una intermedia. */
  69: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Stanserhorn – estación superior (Bergstation CabriO)',
    accessAddress: 'Stanserhorn-Rinderalp, 6372 Stans',
    accessLat: 46.9304377,
    accessLng: 8.3423156,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 70 (Lago de Constanza – Untersee). Fuente: OSM/Nominatim (Napoleonmuseum Arenenberg, nombre exacto). */
  70: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Napoleonmuseum Arenenberg',
    accessAddress: 'Arenenberg, 8268 Salenstein',
    accessLat: 47.6726822,
    accessLng: 9.0592034,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 71 (Emmental, Affoltern). Fuente: OSM/Nominatim (parking de la Schaukäserei, dirección exacta). */
  71: {
    parkingName: 'Schaukäserei (Show Dairy)',
    parkingAddress: 'Schaukäsereistrasse, 3416 Affoltern im Emmental',
    parkingLat: 47.0638053,
    parkingLng: 7.7308856,

    accessName: null,
    accessAddress: null,
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 72 (Fully). Fuente: OSM (panel informativo "Combe d'Enfer" en el Sentier de L'Abérieux-Chancotin). */
  72: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Fully, Valais',
    accessLat: null,
    accessLng: null,

    trailName: "Combe d'Enfer (panel informativo del sendero)",
    trailAddress: "Sentier de L'Abérieux-Chancotin, Fully",
    trailLat: 46.1388899,
    trailLng: 7.1023485
  },

  /* PHOTO SPOT 73 (Cuevas de San Beato). Fuente: OSM/Nominatim (Beatushöhlen-Sundlauenen, nombre exacto). */
  73: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Beatushöhlen-Sundlauenen',
    accessAddress: 'Ländteweg, Schwendi, 3803 Beatenberg',
    accessLat: 46.6849595,
    accessLng: 7.7899426,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 74 (Basilea). Sin coordenadas verificables encontradas (destino urbano amplio). */
  74: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Basilea, casco histórico',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 75 (Creux du Van). Fuente: OSM/Nominatim (mirador Creux-du-Van, nombre exacto, sobre el sendero). */
  75: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Creux du Van, Brot-Dessus/Brot-Plamboz',
    accessLat: null,
    accessLng: null,

    trailName: 'La Ferme Robert (punto de partida del sendero hacia Creux du Van)',
    trailAddress: 'Chemin des Chômeurs, Noiraigue',
    trailLat: 46.9432014,
    trailLng: 6.7365796
  },

  /* PHOTO SPOT 76 (Lago Lemán, Coppet). Fuente: OSM/Nominatim (misma dirección exacta: Route Suisse 48). */
  76: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Route Suisse 48, 1296 Coppet',
    accessLat: 46.3156453,
    accessLng: 6.1920331,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 77 (Ballenberg). Fuente: OSM/Nominatim (museo y parking, nombres exactos). */
  77: {
    parkingName: 'Ballenberg Ost Parking 1',
    parkingAddress: 'Museumsstrasse, Brienzwiler, 3856',
    parkingLat: 46.7498603,
    parkingLng: 8.0971259,

    accessName: 'Ballenberg Swiss Open-Air Museum',
    accessAddress: 'Museumsstrasse, 3858 Hofstetten bei Brienz',
    accessLat: 46.7487621,
    accessLng: 8.0848710,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 78 (Spiez). Fuente: OSM/Nominatim (misma dirección exacta: Oberlandstrasse 73). */
  78: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Oberlandstrasse 73, 3700 Spiez',
    accessLat: 46.6844136,
    accessLng: 7.6857872,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 79 (Rigi, Vitznau). Fuente: OSM (estación de tren/embarcadero de Vitznau, nombre exacto). */
  79: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Vitznau (estación del tren de creamallera Rigi / embarcadero)',
    accessAddress: 'Bahnhofstrasse 7, 6354 Vitznau',
    accessLat: 47.0096410,
    accessLng: 8.4829858,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 80 (La Punt). Sin coordenadas verificables encontradas (solo tramos de calle genéricos, sin número 22). */
  80: {
    parkingName: null,
    parkingAddress: 'Aparcamiento en Via Cumünela 22',
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Via Cumünela 22, 7522 La Punt Chamues-ch',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 81 (Säntis). Fuente: OSM/Nominatim (Säntis-Schwebebahn y parking de Schwägalp, nombres exactos). */
  81: {
    parkingName: 'Parkplatz Schwägalp Passhöhe',
    parkingAddress: 'Säntisalp-Wideralp-Strasse, 9107 Urnäsch',
    parkingLat: 47.2539840,
    parkingLng: 9.3048672,

    accessName: 'Säntis-Schwebebahn (estación de valle)',
    accessAddress: 'Schwägalp 970, 9107 Urnäsch',
    accessLat: 47.2564785,
    accessLng: 9.3175958,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 82 (Castillo de Hallwyl). Fuente: OSM/Nominatim (nombre exacto). */
  82: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Schloss Hallwyl',
    accessAddress: 'Boniswilerstrasse, 5707 Seengen',
    accessLat: 47.3232471,
    accessLng: 8.1938060,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 83 (Appenzell Show Dairy). Fuente: OSM/Nominatim (nombre exacto). */
  83: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Appenzeller Schaukäserei',
    accessAddress: 'Dorf 711, 9063 Stein AR',
    accessLat: 47.3733908,
    accessLng: 9.3447056,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 84 (Rapperswil-Jona). Fuente: OSM/Nominatim (misma dirección exacta: Fischmarktplatz 1). */
  84: {
    parkingName: 'Parking See (P1)',
    parkingAddress: 'Fischmarktplatz 1, 8640 Rapperswil',
    parkingLat: 47.2251700,
    parkingLng: 8.8154129,

    accessName: null,
    accessAddress: null,
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 85 (Lago de Lucerna, Brunnen). Fuente: OSM/Nominatim (misma dirección exacta: Axenstrasse 9). */
  85: {
    parkingName: null,
    parkingAddress: 'Axenstrasse 9, 6440 Brunnen',
    parkingLat: 46.9935969,
    parkingLng: 8.6065204,

    accessName: null,
    accessAddress: null,
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 86 (Grupo Weisshorn, Grächen). Fuente: OSM/Nominatim (Hannigalp, nombre exacto). */
  86: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Hannigalp',
    accessAddress: '3925 Grächen',
    accessLat: 46.2065453,
    accessLng: 7.8679331,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 87 (Rheinfelden). Sin coordenadas verificables encontradas (destino urbano amplio). */
  87: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Rheinfelden, casco histórico',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 88 (Abadía de Einsiedeln). Fuente: OSM/Nominatim (Klosterplatz, nombre exacto). */
  88: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Klosterplatz',
    accessAddress: '8840 Einsiedeln',
    accessLat: 47.1267119,
    accessLng: 8.7507755,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 89 (Furka). Fuente: OSM/Nominatim (Furkapass, el propio puerto de montaña descrito). */
  89: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Furkapass',
    accessAddress: 'Furka Pass, Münster/Goms',
    accessLat: 46.5726851,
    accessLng: 8.4151840,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 90 (Lindt Home of Chocolate). Fuente: OSM/Nominatim (nombre exacto). */
  90: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: 'Lindt Home of Chocolate',
    accessAddress: 'Schokoladenplatz 1, 8802 Kilchberg',
    accessLat: 47.3184665,
    accessLng: 8.5509004,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 91 (Gstaad – Saanenland). Fuente: OSM/Nominatim (misma dirección exacta: Schönriedstrasse 74). */
  91: {
    parkingName: 'Huus Gstaad',
    parkingAddress: 'Schönriedstrasse 74, 3792 Saanen-Gstaad',
    parkingLat: 46.4934019,
    parkingLng: 7.2667919,

    accessName: null,
    accessAddress: null,
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  },

  /* PHOTO SPOT 92 (Monte Ceneri). Sin coordenadas verificables encontradas
     (el único resultado cercano, "Piazza d'Armi Monte Ceneri", es un lugar
     distinto de "Piazza Ticino" y se descarta por no coincidir el nombre). */
  92: {
    parkingName: null,
    parkingAddress: null,
    parkingLat: null,
    parkingLng: null,

    accessName: null,
    accessAddress: 'Piazza Ticino, Monte Ceneri, Rivera',
    accessLat: null,
    accessLng: null,

    trailName: null,
    trailAddress: null,
    trailLat: null,
    trailLng: null
  }

};

