// frontend/js/modules/ui.js
// Este modulo conecta los interruptores (switches) del HTML con las capas del Mapa

export function setupSidebarControls(map, capas) {
    console.log("Configurando controles del Sidebar...");

    const controles = {
        // 'checkMapaCalor': capas.mapaCalor, // <--- NUEVA CAPA DE CALOR
        'checkFAISMUN2025': capas.faismun2025, 
        // 'checkFAISMUN': capas.faismun2024,
        // 'checkFAISMUNLineas': capas.faismunLineas,
        // 'checkFAISMUN2023': capas.faismun2023,
        'checkColonias': capas.colonias,
        'checkZAP': capas.zap,
        'checkManzanas': capas.manzanas,
        'checkPrediosCB01': capas.predios,
        'checkLimiteMunicipal': capas.limite,
        'checkPIM2025': capas.pim2025,
        'checkParques': capas.parques_mun,
        'checkRutas': capas.Rutas_Tuxtla,
        'checkVialidades': capas.vialidades
        // 'checkPavimentacion': capas.pavimentacion
    };

    const checkAllFais = document.getElementById('checkFAISMUN_All');
    if (checkAllFais) {
        checkAllFais.checked = false; 
    }

    for (const [idCheckbox, capa] of Object.entries(controles)) {
        const checkbox = document.getElementById(idCheckbox);

        if (checkbox && capa) {
            
            if (!checkbox.checked && map.hasLayer(capa)) {
                map.removeLayer(capa);
            }
            if (checkbox.checked && !map.hasLayer(capa)) {
                map.addLayer(capa);
            }

            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    map.addLayer(capa);
                    console.log(`Capa activada: ${idCheckbox}`);
                } else {
                    map.removeLayer(capa);
                    console.log(`Capa desactivada: ${idCheckbox}`);
                }
            });

            map.on('layeradd layerremove', () => {
                checkbox.checked = map.hasLayer(capa);
            });
        }
    }
    
    if (checkAllFais) {
        checkAllFais.addEventListener('change', (e) => {
            const estado = e.target.checked;
            const hijos = ['checkFAISMUN2025', 'checkFAISMUN', 'checkFAISMUNLineas', 'checkFAISMUN2023', 'checkPIM2025'];
            hijos.forEach(id => {
                const cb = document.getElementById(id);
                if (cb && cb.checked !== estado) {
                    cb.click(); 
                }
            });
        });
    }
}