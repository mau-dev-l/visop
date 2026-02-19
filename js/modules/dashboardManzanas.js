// frontend/js/modules/dashboardManzanas.js

export function initDashboardManzanas(map, capaManzanas) {
    console.log("Iniciando Dashboard Demográfico (ICIPLAM)...");

    const panel = document.getElementById('panel-demografico');
    const btn = document.getElementById('btn-toggle-demografico');

    if (!panel || !btn) {
        console.warn("No se encontraron los elementos del dashboard demográfico.");
        return;
    }

    // 1. Control de apertura y cierre del panel
    btn.onclick = (e) => {
        e.stopPropagation(); 
        const isActivo = panel.classList.toggle('activo');
        actualizarIconoBtn(isActivo, btn);
    };

    if (capaManzanas) {
        // Carga inicial con totales de toda la ciudad
        calcularTotalesCiudad(capaManzanas);
        
        // Interacción al hacer clic en una manzana específica
        capaManzanas.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            const props = e.layer.feature.properties;
            mostrarDatosUnicos(props);
            
            // Forzar apertura del panel al consultar
            if (!panel.classList.contains('activo')) {
                panel.classList.add('activo');
                actualizarIconoBtn(true, btn);
            }
        });

        // Resetear a totales generales al hacer clic en el mapa base
        map.on('click', () => {
            calcularTotalesCiudad(capaManzanas);
        });
    }
}

function calcularTotalesCiudad(capa) {
    let tPob = 0, tMas = 0, tFem = 0, tJefa = 0, tViv = 0;

    capa.eachLayer(layer => {
        const p = layer.feature.properties;
        tPob += parseInt(p.pobtot) || 0;
        tMas += parseInt(p.pobmas) || 0;
        tFem += parseInt(p.pobfem) || 0;
        tViv += parseInt(p.vivtot) || 0;
        // Mapeo de campos INEGI
        tJefa += parseInt(p.hogjef_f) || parseInt(p.vph_jef_f) || 0; 
    });

    actualizarDOM(tPob, tMas, tFem, tJefa, tViv, "Demografía Tuxtla (Total)");
    
    const btn = document.getElementById('btn-toggle-demografico');
    if(btn) btn.style.backgroundColor = "#0077b6"; 
}

function mostrarDatosUnicos(props) {
    const pob = parseInt(props.pobtot) || 0;
    const mas = parseInt(props.pobmas) || 0;
    const fem = parseInt(props.pobfem) || 0;
    const viv = parseInt(props.vivtot) || 0;
    const jefa = parseInt(props.hogjef_f) || parseInt(props.vph_jef_f) || 0;

    const idManzana = props.cvegeo || props.manzana || 'Seleccionada';
    actualizarDOM(pob, mas, fem, jefa, viv, `Manzana: ${idManzana}`);

    const btn = document.getElementById('btn-toggle-demografico');
    if(btn) btn.style.backgroundColor = "#e76f51"; // Color naranja de alerta/selección
}

function actualizarDOM(pob, mas, fem, jefa, viv, titulo) {
    const fmt = new Intl.NumberFormat('es-MX');

    // Animación y actualización de valores
    animateValue("kpi-pob-total", pob);
    document.getElementById('kpi-pob-mas').textContent = fmt.format(mas);
    document.getElementById('kpi-pob-fem').textContent = fmt.format(fem);
    document.getElementById('kpi-jefatura').textContent = fmt.format(jefa);
    document.getElementById('kpi-viviendas').textContent = fmt.format(viv);

    // Actualizar texto del botón con el ID de la manzana
    const btn = document.getElementById('btn-toggle-demografico');
    if (btn) {
        const iconClass = document.getElementById('panel-demografico').classList.contains('activo') 
            ? 'fa-chevron-down' 
            : 'fa-people-group';
        btn.innerHTML = `<i class="fa-solid ${iconClass} me-2"></i> ${titulo}`;
    }
}

function animateValue(id, end) {
    const obj = document.getElementById(id);
    if(!obj) return;
    let startTimestamp = null;
    const duration = 600;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = new Intl.NumberFormat('es-MX').format(Math.floor(progress * end));
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function actualizarIconoBtn(isActivo, btn) {
    const icon = btn.querySelector('i');
    if (!icon) return;
    icon.className = isActivo ? 'fa-solid fa-chevron-down me-2' : 'fa-solid fa-people-group me-2';
}