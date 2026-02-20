// frontend/js/modules/layers.js

import { fetchWFS, GEOSERVER_BASE_URL } from './api.js';
import { 
    iconoFAISMUN, iconoFAISMUN23, popupFAISMUN, 
    estiloManzanas, popupManzanas, 
    estiloColonias, estiloZAP, estiloLineas24, popupGenerico 
} from './styles.js';

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
                color: '#ce0cae', // Magenta/Morado
                weight: 4, 
                opacity: 0.9,
                lineCap: 'round'
            },
            onEachFeature: (feature, layer) => {
                const p = feature.properties;
                let montoFormat = p.monto; 
                try { 
                    if (p.monto) montoFormat = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p.monto); 
                } catch(e) {}

                const safeNombre = (p.nom_obra || 'Obra').replace(/"/g, '&quot;');
                const safeCve = (p.cve_prep || '').trim();

                let descRaw = p.descp || 'Sin descripción';
                let descList = descRaw.replace(/(\d+\.-)/g, '<br><strong style="color:#000;">$1</strong>');
                if (descList.startsWith('<br>')) descList = descList.substring(4);

                const html = `
                    <div style="min-width: 280px; font-family: 'Segoe UI', sans-serif; font-size: 13px;">
                        <div style="background-color: #ce0cae; color: #fff; padding: 6px 10px; border-radius: 4px 4px 0 0; font-weight: bold; margin-bottom: 8px; border-bottom: 2px solid #a6098f;">
                            <i class="fa-solid fa-hard-hat"></i> FAISMUN 2025
                        </div>
                        <div style="margin-bottom: 6px;">
                            <strong style="color: #000; font-size: 14px;">${p.nom_obra || 'Sin Nombre'}</strong>
                        </div>
                        <div style="margin-top: 8px; margin-bottom: 2px; font-size: 11px; color: #666; font-weight: bold; text-transform: uppercase;">
                            <i class="fa-solid fa-align-left"></i> Descripción del Proyecto
                        </div>
                        <div style="margin-bottom: 10px; color: #444; background-color: #f9f9f9; padding: 5px; border-left: 3px solid #ce0cae; line-height: 1.4;">
                            ${descList}
                        </div>
                        <div class="d-grid gap-2 mb-3">
                            <button class="btn btn-sm btn-outline-dark" onclick="window.abrirGaleria('${safeCve}', '${safeNombre}')">
                                <i class="fa-solid fa-camera"></i> Ver Evidencia (Antes/Después)
                            </button>
                        </div>
                        <hr style="margin: 5px 0; border-color: #eee;">
                        <div style="margin-bottom: 5px; font-size: 11px; color: #333;">
                                <strong style="color: #C20096;"><i class="fa-solid fa-map-location-dot"></i> Colonia:</strong> ${p.colonia || 'Sin colonia asignada'}
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px dashed #ccc; font-size: 10px;">
                            <div>
                                <strong style="color: #666;"><i class="fa-solid fa-play text-success"></i> Inicial:</strong><br>
                                <span style="font-family: monospace; color: #444;">${p.inicial || 'S/D'}</span>
                            </div>
                            <div>
                                <strong style="color: #666;"><i class="fa-solid fa-stop text-danger"></i> Final:</strong><br>
                                <span style="font-family: monospace; color: #444;">${p.final || 'S/D'}</span>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                            <div><strong style="color: #0077b6;">No. Aprob:</strong><br>${p.no_aprob || '-'}</div>
                            <div><strong style="color: #0077b6;">No. Contrato:</strong><br>${p.no_cont || '-'}</div>
                            <div><strong style="color: #0077b6;">Clave Prep:</strong><br>${p.cve_prep || '-'}</div>
                            <div><strong style="color: #0077b6;">Tipo Proy:</strong><br>${p.tipo_proy || '-'}</div>
                            <div style="background-color: #e3f2fd; padding: 4px; border-radius: 3px; text-align: center; border: 1px solid #bbdefb;">
                                <strong style="color: #0d47a1;">Avance Físico</strong><br>
                                <span style="font-size: 14px; font-weight: bold;">${p.avan_fis || '0'}%</span>
                            </div>
                            <div style="background-color: #e8f5e9; padding: 4px; border-radius: 3px; text-align: center; border: 1px solid #c8e6c9;">
                                <strong style="color: #1b5e20;">Avance Finan.</strong><br>
                                <span style="font-size: 14px; font-weight: bold;">${p.avam_fin || '0'}%</span>
                            </div>
                        </div>
                        <hr style="margin: 5px 0; border-color: #eee;">
                        <div style="font-size: 12px; margin-bottom: 4px;"><strong>Unidad Resp:</strong> <span style="color: #333;">${p.un_res || '-'}</span></div>
                        <div style="font-size: 12px;"><strong>Unidad Op:</strong> <span style="color: #333;">${p.un_res_op || '-'}</span></div>
                        <div style="background-color: #f1f8e9; padding: 6px; text-align: right; margin-top: 8px; border-radius: 4px; border: 1px solid #c8e6c9;">
                            <strong style="color: #2e7d32;">Monto: ${montoFormat || '$0.00'}</strong>
                        </div>
                    </div>
                `;
                layer.bindPopup(html);
            }
        });
        console.log(`FAISMUN 25 (Líneas): ${dF25.features.length} registros`);
    }

    console.log("Conectando PIM 2025...");
    try {
        // CORRECCIÓN: Se usa GEOSERVER_BASE_URL directamente para evitar duplicar /visop/wms
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
            console.log(`PIM 2025 cargado: ${dPim.features.length} registros`); // Sin emojis
        }
    } catch (error) {
        console.error("Error cargando PIM 2025:", error); // Sin emojis
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
            onEachFeature: (feature, layer) => {
                const props = feature.properties;
                const nombre = props.name || "Sin nombre";
                const descripcion = props.descriptio || "Sin descripción";
                const contenidoHtml = `
                    <div style="min-width: 200px; font-family: sans-serif;">
                        <h6 style="color: #0077b6; font-weight: bold; border-bottom: 2px solid #0077b6; padding-bottom: 5px; margin-bottom: 10px;">
                            <i class="fa-solid fa-road"></i> Detalle de Obra (Línea)
                        </h6>
                        <div style="margin-bottom: 5px;"><strong style="color: #555;">Nombre:</strong><br><span style="color: #333;">${nombre}</span></div>
                        <div style="margin-bottom: 5px;"><strong style="color: #555;">Descripción:</strong><br><span style="color: #333;">${descripcion}</span></div>
                    </div>
                `;
                layer.bindPopup(contenidoHtml);
            }
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
            onEachFeature: (feature, layer) => {
                const p = feature.properties;
                const html = `
                    <div style="min-width: 220px; font-family: 'Segoe UI', sans-serif; font-size: 13px;">
                        <div style="background-color: #FF6600; color: white; padding: 5px 10px; border-radius: 4px 4px 0 0; font-weight: bold; margin-bottom: 8px;">
                            <i class="fa-solid fa-circle-exclamation"></i> Información ZAP
                        </div>
                        <div style="margin-bottom: 5px;"><strong>Clave Geoestadística:</strong> ${p.CVEGEO || 'S/D'}</div>
                        <div style="margin-bottom: 8px;"><strong>Clave AGEB:</strong> ${p.CVE_AGEB || 'S/D'}</div>
                    </div>
                `;
                layer.bindPopup(html);
            }
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
            onEachFeature: (feature, layer) => {
                const p = feature.properties;
                layer.bindPopup(`<strong>Parque:</strong> ${p.newfield1 || 'S/D'}`);
            }
        });
    }

    const drutas = await fetchWFS('Rutas_Tuxtla');
    if (drutas?.features) {
        capas.Rutas_Tuxtla = L.geoJSON(drutas, {
            onEachFeature: (feature, layer) => {
                const p = feature.properties;
                layer.bindPopup(`<strong>Ruta:</strong> ${p.route_name || 'S/D'}`);
            }
        });
    }

    capas.limite = L.tileLayer.wms(GEOSERVER_BASE_URL, {
        layers: 'visop:tuxtla_geo', format: 'image/png', transparent: true, version: '1.1.0', zIndex: 2
    });

    capas.predios = L.tileLayer.wms(GEOSERVER_BASE_URL, {
        layers: 'visop:predios_cb01_geo', format: 'image/png', transparent: true, version: '1.1.0', zIndex: 3
    });

    // =========================================================
    //  NUEVA CAPA: Vialidades Sin Recubrimiento (WMS)
    // =========================================================
    // CORRECCIÓN: Se usa GEOSERVER_BASE_URL directamente
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

function crearPopupPIM(p) {
    const nombreObra = p['Nombre de'] || 'NOMBRE NO DISPONIBLE';
    const descripcion = p['Descrició'] || 'Sin descripción'; 
    const clavePres = p['Clave Pres'] || '';
    const noAprob = p['No de Apro'] || 'S/D';
    const noContrato = p['No de Cont'] || 'S/D';
    const tipoProy = p['Tipo de Pr'] || 'Infraestructura';
    const avanceFis = p['Avance Fis'] || '0';
    const avanceFin = p['Avance Fin'] || '0';
    const colonia = p['Colonia'] || 'Sin colonia asignada';
    const unidadRes = p['Unidad Res'] || '-';
    const unidadOp = p['Unidad R_1'] || '-';
    
    const coordInicial = p['inicial'] || p['INICIAL'] || 'S/D';
    const coordFinal = p['final'] || p['FINAL'] || 'S/D';
    
    let montoFormat = '$0.00';
    try { 
        const valor = p['Monto Apro']; 
        if (valor) {
            const numero = parseFloat(String(valor).replace(/[^0-9.-]+/g,""));
            montoFormat = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(numero); 
        }
    } catch(e) {}

    const safeNombre = nombreObra.replace(/"/g, '&quot;');
    const safeCve = String(clavePres).trim();
    
    let descList = descripcion.replace(/(\d+\.-)/g, '<br><strong style="color:#000;">$1</strong>');
    if (descList.startsWith('<br>')) descList = descList.substring(4);

    return `
        <div style="min-width: 280px; font-family: 'Segoe UI', sans-serif; font-size: 13px;">
            <div style="background-color: #00897B; color: #fff; padding: 6px 10px; border-radius: 4px 4px 0 0; font-weight: bold; margin-bottom: 8px; border-bottom: 2px solid #00695C;">
                <i class="fa-solid fa-helmet-safety"></i> PIM 2025
            </div>
            
            <div style="margin-bottom: 6px;">
                <strong style="color: #000; font-size: 14px;">${nombreObra}</strong>
            </div>
            
            <div style="margin-top: 8px; margin-bottom: 2px; font-size: 11px; color: #666; font-weight: bold; text-transform: uppercase;">
                <i class="fa-solid fa-align-left"></i> Descripción del Proyecto
            </div>

            <div style="margin-bottom: 10px; color: #444; background-color: #f9f9f9; padding: 5px; border-left: 3px solid #00897B; line-height: 1.4;">
                ${descList}
            </div>
            
            <div class="d-grid gap-2 mb-3">
                <button class="btn btn-sm btn-outline-dark" onclick="window.abrirGaleria('${safeCve}', '${safeNombre}', 'pim_2025', 'png')">
                    <i class="fa-solid fa-camera"></i> Ver Evidencia
                </button>
            </div>

            <hr style="margin: 5px 0; border-color: #eee;">
            
            <div style="margin-bottom: 5px; font-size: 11px; color: #333;">
                <strong style="color: #00796B;"><i class="fa-solid fa-map-location-dot"></i> Colonia:</strong> ${colonia}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px dashed #ccc; font-size: 10px;">
                <div>
                    <strong style="color: #666;"><i class="fa-solid fa-play text-success"></i> Inicial:</strong><br>
                    <span style="font-family: monospace; color: #444;">${coordInicial}</span>
                </div>
                <div>
                    <strong style="color: #666;"><i class="fa-solid fa-stop text-danger"></i> Final:</strong><br>
                    <span style="font-family: monospace; color: #444;">${coordFinal}</span>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                <div><strong style="color: #00796B;">No. Aprob:</strong><br>${noAprob}</div>
                <div><strong style="color: #00796B;">Contrato:</strong><br>${noContrato}</div>
                <div><strong style="color: #00796B;">Clave Pres:</strong><br>${clavePres}</div>
                <div><strong style="color: #00796B;">Tipo Proy:</strong><br>${tipoProy}</div>
                
                <div style="background-color: #e3f2fd; padding: 4px; border-radius: 3px; text-align: center; border: 1px solid #bbdefb;">
                    <strong style="color: #0d47a1;">Avance Físico</strong><br>
                    <span style="font-size: 14px; font-weight: bold;">${avanceFis}%</span>
                </div>
                <div style="background-color: #e8f5e9; padding: 4px; border-radius: 3px; text-align: center; border: 1px solid #c8e6c9;">
                    <strong style="color: #1b5e20;">Avance Finan.</strong><br>
                    <span style="font-size: 14px; font-weight: bold;">${avanceFin}%</span>
                </div>
            </div>

            <hr style="margin: 5px 0; border-color: #eee;">
            <div style="font-size: 12px; margin-bottom: 4px;"><strong>Unidad Resp:</strong> <span style="color: #333;">${unidadRes}</span></div>
            <div style="font-size: 12px;"><strong>Unidad Op:</strong> <span style="color: #333;">${unidadOp}</span></div>
            
            <div style="background-color: #E0F2F1; padding: 6px; text-align: right; margin-top: 8px; border-radius: 4px; border: 1px solid #DCEDC8;">
                <strong style="color: #00695C; font-size: 14px;">Monto: ${montoFormat}</strong>
            </div>
        </div>
    `;
}