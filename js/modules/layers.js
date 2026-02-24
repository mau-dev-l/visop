// frontend/js/modules/layers.js

import { fetchWFS, GEOSERVER_BASE_URL } from './api.js';
import { 
    iconoFAISMUN, iconoFAISMUN23, popupFAISMUN, 
    estiloManzanas, popupManzanas, 
    estiloColonias, estiloZAP, estiloLineas24, popupGenerico 
} from './styles.js';

import { 
    popupFAISMUN2025, crearPopupPIM, popupFAISMUNLineas, 
    popupZAP, popupParques, popupRutas, popupPavimentacion 
} from './popups.js';

export async function cargarCapasBackend() {
    const capas = {};
    console.log("Conectando a GeoServer (Tuxtla)...");

    // Matriz exclusiva para FAISMUN 2025 y PIM 2025
    const puntosParaCalor = [];

    // Funcion auditora estricta: Solo busca campos cent_x y cent_y
    function extraerPuntosCalor(dGeoJSON, nombreCapa) {
        if (!dGeoJSON || !dGeoJSON.features) return;
        
        let contCentroides = 0;

        dGeoJSON.features.forEach(f => {
            const p = f.properties;
            
            // Verificacion estricta y flexible a la vez (por si GeoServer envia mayusculas)
            const cx = p.cent_x !== undefined ? p.cent_x : (p.CENT_X !== undefined ? p.CENT_X : null);
            const cy = p.cent_y !== undefined ? p.cent_y : (p.CENT_Y !== undefined ? p.CENT_Y : null);
            
            if (cx !== null && cy !== null && cx !== "" && cy !== "") {
                // Leaflet usa [Latitud, Longitud], que equivale a [Y, X]
                puntosParaCalor.push([parseFloat(cy), parseFloat(cx), 1]);
                contCentroides++;
            }
        });

        // Reporte en consola
        if (contCentroides > 0) {
            console.log(`Auditoria Heatmap [${nombreCapa}]: ${contCentroides} coordenadas extraidas por centroides.`);
        } else {
            console.warn(`Alerta Heatmap [${nombreCapa}]: 0 puntos. Los campos cent_x/cent_y no existen o estan vacios.`);
        }
    }

    // ============================================================
    //  GRUPO 1: CAPAS WFS (Vectores Interactivos - GeoJSON)
    // ============================================================

    const dF25 = await fetchWFS('faismun_2025');
    if (dF25?.features) {
        // EXTRACCION HABILITADA PARA FAISMUN 2025
        extraerPuntosCalor(dF25, 'FAISMUN 2025'); 
        
        capas.faismun2025 = L.geoJSON(dF25, {
            style: { color: '#ce0cae', weight: 4, opacity: 0.9, lineCap: 'round' },
            onEachFeature: popupFAISMUN2025 
        });
        console.log(`FAISMUN 25 (Lineas): ${dF25.features.length} registros`);
    }

    console.log("Conectando PIM 2025...");
    try {
        const pimWms = L.tileLayer.wms(GEOSERVER_BASE_URL, {
            layers: 'visop:pim_2025', format: 'image/png', transparent: true, version: '1.1.0', zIndex: 1000
        });

        const dPim = await fetchWFS('pim_2025');
        if (dPim?.features) {
            // EXTRACCION HABILITADA PARA PIM 2025
            extraerPuntosCalor(dPim, 'PIM 2025'); 

            const pimWfs = L.geoJSON(dPim, {
                pointToLayer: (f, latlng) => L.circleMarker(latlng, { radius: 12, opacity: 0, fillOpacity: 0, color: 'transparent', weight: 0 }),
                onEachFeature: (feature, layer) => { layer.bindPopup(crearPopupPIM(feature.properties)); }
            });

            const originalOnAdd = pimWfs.onAdd.bind(pimWfs);
            const originalOnRemove = pimWfs.onRemove.bind(pimWfs);
            pimWfs.onAdd = function(map) { originalOnAdd(map); pimWms.addTo(map); return this; };
            pimWfs.onRemove = function(map) { originalOnRemove(map); map.removeLayer(pimWms); return this; };

            capas.pim2025 = pimWfs;
        }
    } catch (error) {
        console.error("Error cargando PIM 2025:", error);
    }

    const dPavimentacion = await fetchWFS('pavimentacion_2018_2025');
    if (dPavimentacion?.features) {
        capas.pavimentacion = L.geoJSON(dPavimentacion, {
            style: { color: '#495057', weight: 4, opacity: 0.85 },
            onEachFeature: popupPavimentacion
        });
    }

    const dF24 = await fetchWFS('faismun_2024_geo');
    if (dF24?.features) {
        capas.faismun2024 = L.geoJSON(dF24, {
            pointToLayer: (f, latlng) => L.marker(latlng, { icon: iconoFAISMUN }),
            onEachFeature: popupFAISMUN
        });
    }

    const dF24Lin = await fetchWFS('faismun_2024_lineas');
    if (dF24Lin?.features) {
        capas.faismunLineas = L.geoJSON(dF24Lin, {
            style: estiloLineas24,
            onEachFeature: popupFAISMUNLineas 
        });
    }

    const dF23 = await fetchWFS('faismun_2023_geo');
    if (dF23?.features) {
        capas.faismun2023 = L.geoJSON(dF23, {
            pointToLayer: (f, latlng) => L.marker(latlng, { icon: iconoFAISMUN23 }),
            onEachFeature: popupFAISMUN
        });
    }

    const dCol = await fetchWFS('101_COL_H_AYUNTAMIENTO_2023_geo');
    if (dCol?.features) {
        capas.colonias = L.geoJSON(dCol, { style: estiloColonias, onEachFeature: popupGenerico });
    }

    const dZap = await fetchWFS('ZAP_2026_TUXTLA'); 
    if (dZap?.features) {
        capas.zap = L.geoJSON(dZap, {
            style: function(feature) { return { color: '#FF6600', weight: 2, opacity: 1, fillColor: '#FF6600', fillOpacity: 0.0 }; },
            onEachFeature: popupZAP 
        });
    }

    const dManzanas = await fetchWFS('manzanas_tuxtla_cpyv2020_geo');
    if (dManzanas?.features) {
        capas.manzanas = L.geoJSON(dManzanas, { style: estiloManzanas, onEachFeature: popupManzanas });
    }

    const dparques = await fetchWFS('parques_mun');
    if (dparques?.features) { capas.parques_mun = L.geoJSON(dparques, { onEachFeature: popupParques }); }

    const drutas = await fetchWFS('Rutas_Tuxtla');
    if (drutas?.features) { capas.Rutas_Tuxtla = L.geoJSON(drutas, { onEachFeature: popupRutas }); }

    // ============================================================
    //  CAPA GENERADA: MAPA DE CALOR ESTRICTO (FAISMUN Y PIM 2025)
    // ============================================================
    if (typeof L.heatLayer !== 'undefined') {
        capas.mapaCalor = L.heatLayer(puntosParaCalor, {
            radius: 20,
            blur: 15,
            maxZoom: 15,
            gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }
        });
        console.log(`Capa Mapa de Calor lista. Total exclusivo de centroides 2025 procesados: ${puntosParaCalor.length}`);
    }

    // ============================================================
    //  GRUPO 2: CAPAS WMS (Mapas de imagen estaticos)
    // ============================================================
    capas.limite = L.tileLayer.wms(GEOSERVER_BASE_URL, { layers: 'visop:tuxtla_geo', format: 'image/png', transparent: true, version: '1.1.0', zIndex: 2 });
    capas.predios = L.tileLayer.wms(GEOSERVER_BASE_URL, { layers: 'visop:predios_cb01_geo', format: 'image/png', transparent: true, version: '1.1.0', zIndex: 3 });
    capas.vialidades = L.tileLayer.wms(GEOSERVER_BASE_URL, { layers: 'visop:vialidades_sin_recubrimiento', format: 'image/png', transparent: true, version: '1.1.0', zIndex: 4, attribution: 'ICIPLAM - SIGETUX' });

    return capas;
}