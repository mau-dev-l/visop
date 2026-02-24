// frontend/js/modules/legend.js

export function initLegend(map, capas) {
    console.log("Iniciando Leyenda Dinámica (Sincronizada)...");

    const container = document.getElementById('leyenda-dinamica');
    const content = document.getElementById('leyenda-content');

    if (!container || !content) return;

    // ============================================================
    // 1. CONFIGURACIÓN DE COLORES Y ESTILOS
    // ============================================================
    const config = [
        { 
            layer: capas.mapaCalor, 
            label: 'Densidad Obras (2025)', 
            type: 'gradient',     
            color: 'linear-gradient(to right, blue, cyan, lime, yellow, red)' 
        },
        { 
            layer: capas.faismun2025, 
            label: 'FAISMUN 2025', 
            type: 'line',     
            color: '#ce0cae'  
        },
        { 
            layer: capas.pim2025, 
            label: 'PIM 2025', 
            type: 'circle',     
            color: '#00897B'  
        },
        { 
            layer: capas.pavimentacion, 
            label: 'Pavimentación (18-25)', 
            type: 'line',     
            color: '#495057'  
        },
        { 
            layer: capas.faismun2024, 
            label: 'Obra 2024', 
            type: 'circle', 
            color: '#0077b6' 
        },
        { 
            layer: capas.faismunLineas, 
            label: 'Obra 2024 (Red)', 
            type: 'line', 
            color: '#0077b6' 
        },
        { 
            layer: capas.faismun2023, 
            label: 'Obra 2023', 
            type: 'circle', 
            color: '#2a9d8f' 
        },
        { 
            layer: capas.colonias, 
            label: 'Colonias', 
            type: 'polygon', 
            color: '#ff7800' 
        },
        { 
            layer: capas.zap, 
            label: 'Zonas Atención (ZAP)', 
            type: 'polygon-outline', 
            color: '#FF6600'  
        },
        { 
            layer: capas.manzanas, 
            label: 'Manzanas', 
            type: 'polygon', 
            color: '#6c757d' 
        },
        { 
            layer: capas.predios, 
            label: 'Predios (Catastro)', 
            type: 'polygon', 
            color: '#8A2BE2' 
        },
        { 
            layer: capas.limite, 
            label: 'Límite Municipal', 
            type: 'line-dashed', 
            color: '#000000' 
        }
    ];

    // 2. Función que redibuja el HTML
    function render() {
        let html = '';
        let visibleCount = 0;

        config.forEach(item => {
            if (item.layer && map.hasLayer(item.layer)) {
                visibleCount++;
                html += `
                    <div class="legend-item" style="margin-bottom: 6px; display: flex; align-items: center;">
                        ${getSymbolHTML(item)}
                        <span style="font-size: 12px; color: #333; line-height: 1.2;">${item.label}</span>
                    </div>
                `;
            }
        });

        content.innerHTML = html;
        container.style.display = (visibleCount > 0) ? 'block' : 'none';
    }

    map.on('layeradd layerremove', render);
    render();
}

// Helper para dibujar los iconitos con CSS
function getSymbolHTML(item) {
    let style = '';
    
    if (item.type === 'circle') {
        style = `background-color: ${item.color}; border: 1px solid #fff; border-radius: 50%; width: 12px; height: 12px;`;
    } else if (item.type === 'line') {
        style = `background-color: ${item.color}; height: 4px; width: 18px; border-radius: 2px;`;
    } else if (item.type === 'line-dashed') {
        style = `border-top: 2px dashed ${item.color}; height: 0px; width: 18px;`;
    } else if (item.type === 'polygon') {
        style = `background-color: ${item.color}; opacity: 0.6; border: 1px solid ${item.color}; width: 14px; height: 14px;`;
    } else if (item.type === 'polygon-outline') {
        style = `background-color: transparent; border: 2px solid ${item.color}; width: 14px; height: 14px; box-sizing: border-box;`;
    } else if (item.type === 'gradient') {
        // TIPO NUEVO: GRADIENTE (MAPA DE CALOR)
        style = `background: ${item.color}; width: 45px; height: 10px; border-radius: 3px; border: 1px solid #aaa;`;
    }

    return `<div style="display: inline-block; margin-right: 8px; vertical-align: middle; flex-shrink: 0; ${style}"></div>`;
}