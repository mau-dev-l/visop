// frontend/js/modules/layers.js

import { fetchWFS, GEOSERVER_BASE_URL } from './api.js';
import { 
    iconoFAISMUN, iconoFAISMUN23, popupFAISMUN, 
    estiloManzanas, popupManzanas, 
    estiloColonias, estiloZAP, estiloLineas24, popupGenerico 
} from './styles.js';

// Importamos la nueva modularidad de Popups y la nueva de pavimentacion
import { 
    popupFAISMUN2025, crearPopupPIM, popupFAISMUNLineas, 
    popupZAP, popupParques, popupRutas, popupPavimentacion 
} from './popups.js';

export async function cargarCapasBackend() {
    const capas = {};
    console.log("Conectando a GeoServer (Tuxtla)...");

    // ============================================================
    //  GRUPO 1: CAPAS WFS (Vectores Interactivos - GeoJSON)
    // ============================================================

    // 0. FAISMUN 2025 (LÍNEAS) - Color Magenta
    const dF25 = await fetchWFS('faismun_2025');
    if (dF25?.features) {
        capas.faismun2025 = L.geoJSON(dF25, {
            style: { 
                color: '#ce0cae', 
                weight: 4, 
                opacity: 0.9,
                lineCap: 'round'
            },
            onEachFeature: popupFAISMUN2025 
        });
        console.log(`FAISMUN 25 (Líneas): ${dF25.features.length} registros`);
    }

    console.log("Conectando PIM 2025...");
    try {
        const pimWms = L.tileLayer.wms(GEOSERVER_BASE_URL, {
            layers: 'visop:pim_2025',
            format: 'image/png',
            transparent: true,
            version: '1.1.0',
            zIndex: 1000
        });

        const dPim = await fetchWFS('pim_2025');
        if (dPim?.features) {
            const pimWfs = L.geoJSON(dPim, {
                pointToLayer: (f, latlng) => L.circleMarker(latlng, { radius: 12, opacity: 0, fillOpacity: 0, color: 'transparent', weight: 0 }),
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(crearPopupPIM(feature.properties)); 
                }
            });

            const originalOnAdd = pimWfs.onAdd.bind(pimWfs);
            const originalOnRemove = pimWfs.onRemove.bind(pimWfs);
            
            pimWfs.onAdd = function(map) { originalOnAdd(map); pimWms.addTo(map); return this; };
            pimWfs.onRemove = function(map) { originalOnRemove(map); map.removeLayer(pimWms); return this; };

            capas.pim2025 = pimWfs;
            console.log(`PIM 2025 cargado: ${dPim.features.length} registros`);
        }
    } catch (error) {
        console.error("Error cargando PIM 2025:", error);
    }

    // NUEVA CAPA: Pavimentación 2018-2025 (WFS Vectorial)
    const dPavimentacion = await fetchWFS('pavimentacion_2018_2025');
    if (dPavimentacion?.features) {
        capas.pavimentacion = L.geoJSON(dPavimentacion, {
            style: {
                color: '#495057', // Color gris oscuro asfalto
                weight: 4,
                opacity: 0.85
            },
            onEachFeature: popupPavimentacion
        });
        console.log(`Pavimentacion 2018-2025: ${dPavimentacion.features.length} registros`);
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
        capas.colonias = L.geoJSON(dCol, { 
            style: estiloColonias, 
            onEachFeature: popupGenerico 
        });
    }

    const dZap = await fetchWFS('ZAP_2026_TUXTLA'); 
    if (dZap?.features) {
        capas.zap = L.geoJSON(dZap, {
            style: function(feature) {
                return { color: '#FF6600', weight: 2, opacity: 1, fillColor: '#FF6600', fillOpacity: 0.0 };
            },
            onEachFeature: popupZAP 
        });
    }

    const dManzanas = await fetchWFS('manzanas_tuxtla_cpyv2020_geo');
    if (dManzanas?.features) {
        capas.manzanas = L.geoJSON(dManzanas, {
            style: estiloManzanas,
            onEachFeature: popupManzanas
        });
    }

    const dparques = await fetchWFS('parques_mun');
    if (dparques?.features) {
        capas.parques_mun = L.geoJSON(dparques, {
            onEachFeature: popupParques 
        });
    }

    const drutas = await fetchWFS('Rutas_Tuxtla');
    if (drutas?.features) {
        capas.Rutas_Tuxtla = L.geoJSON(drutas, {
            onEachFeature: popupRutas 
        });
    }

    // ============================================================
    //  GRUPO 2: CAPAS WMS (Mapas de imagen estáticos)
    // ============================================================
    capas.limite = L.tileLayer.wms(GEOSERVER_BASE_URL, {
        layers: 'visop:tuxtla_geo', format: 'image/png', transparent: true, version: '1.1.0', zIndex: 2
    });

    capas.predios = L.tileLayer.wms(GEOSERVER_BASE_URL, {
        layers: 'visop:predios_cb01_geo', format: 'image/png', transparent: true, version: '1.1.0', zIndex: 3
    });

    capas.vialidades = L.tileLayer.wms(GEOSERVER_BASE_URL, {
        layers: 'visop:vialidades_sin_recubrimiento',
        format: 'image/png',
        transparent: true,
        version: '1.1.0',
        zIndex: 4, 
        attribution: 'ICIPLAM - SIGETUX'
    });

    return capas;
}