// js/modules/navControl.js

export function initNavControls(map) {
    const NavControl = L.Control.extend({
        options: { position: 'bottomleft' },
        onAdd: function() {
            const container = L.DomUtil.create('div', 'leaflet-nav-wrapper');
            L.DomEvent.disableClickPropagation(container);

            container.innerHTML = `
                <div class="nav-container-map d-flex flex-column gap-2">
                    <button id="btn-map-home" class="btn btn-sm btn-custom-tuxtla shadow-sm" title="Restablecer Vista">
                        <i class="fa-solid fa-house-chimney"></i>
                    </button>
                    
                    <div class="d-flex gap-1">
                        <button id="btn-map-gps" class="btn btn-sm btn-primary shadow-sm" title="Mi Ubicación">
                            <i class="fa-solid fa-location-crosshairs"></i>
                        </button>
                        <button id="btn-map-clean-gps" class="btn btn-sm btn-danger shadow-sm" style="display: none;" title="Limpiar rastro">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
            return container;
        }
    });
    map.addControl(new NavControl());
}

export function setupNavLogic(map) {
    const btnHome = document.getElementById('btn-map-home');
    const btnGPS = document.getElementById('btn-map-gps');
    const btnClean = document.getElementById('btn-map-clean-gps');

    // 1. Lógica Home
    if (btnHome) {
        btnHome.onclick = () => map.setView([16.7538, -93.116], 13);
    }

    // 2. Lógica GPS (Reutilizando tu función existente)
    if (btnGPS) {
        btnGPS.onclick = () => {
            // Aquí disparamos el click del botón original o llamamos a tu función de gps.js
            // Para asegurar compatibilidad, buscamos el evento ya programado:
            const originalGpsBtn = document.getElementById('btn-native-gps');
            if (originalGpsBtn) originalGpsBtn.click();
            
            // Mostramos el botón de limpiar si el rastro se activa
            if (btnClean) btnClean.style.display = 'block';
        };
    }

    if (btnClean) {
        btnClean.onclick = () => {
            const originalCleanBtn = document.getElementById('btn-clean-gps');
            if (originalCleanBtn) originalCleanBtn.click();
            btnClean.style.display = 'none';
        };
    }
}