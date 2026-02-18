// frontend/js/app.js

import { initMap } from './modules/mapSetup.js';
import { cargarCapasBackend } from './modules/layers.js';
import { setupSidebarControls } from './modules/ui.js';
import { initDashboard } from './modules/dashboard.js';
import { initDashboardManzanas } from './modules/dashboardManzanas.js';
import { initLegend } from './modules/legend.js'; 
import { setupGPS } from './modules/gps.js'; 
import { initGallery } from './modules/gallery.js'; 

// --- MÓDULOS DE INTERFAZ SOBRE EL MAPA ---
import { initSearchControls } from './modules/searchControl.js';
import { setupColoniaSearch, setupCoordLogic } from './modules/searchLogic.js';
import { setupSidebarToggle } from './modules/uiLayout.js';

/**
 * Función principal de inicio. 
 * Exportada para ser llamada desde index.html tras cargar componentes.
 */
export async function iniciarVisop() {
    console.log("Iniciando lógica de VISOP 2.0...");

    // Validar que el contenedor del mapa exista antes de intentar inicializar Leaflet
    if (!document.getElementById('map-container')) {
        console.error("Error: No se encontró 'map-container'. Asegúrate de que main_content.html se cargó correctamente.");
        return;
    }

    try {
        // 1. Iniciar Mapa base (Centro y Zoom inicial)
        const { map, baseLayers } = initMap();

        // 2. Cargar Capas desde GeoServer (WFS/WMS)
        const capasOverlay = await cargarCapasBackend();

        // 3. Habilitar función de colapso del Sidebar (Botón en Top-Left)
        setupSidebarToggle(map);

        // 4. Control de Capas Base (Esquina superior derecha)
        L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

        // 5. Configurar Sidebar (Vincula los switches del HTML con las capas)
        setupSidebarControls(map, capasOverlay);

        // 6. Iniciar Dashboards y Estadísticas
        initDashboard();
        
        if (capasOverlay.manzanas) {
            initDashboardManzanas(map, capasOverlay.manzanas);
        }

        // 7. Iniciar Leyenda Dinámica sincronizada con las capas visibles
        initLegend(map, capasOverlay);

        // 8. Iniciar Módulo de Galería de fotos (Evidencia fotográfica)
        initGallery(); 

        // 9. Inicialización de Controles sobre el Mapa (Esquina inferior izquierda)
        // Crea los inputs de búsqueda, botón Home y botón GPS
        initSearchControls(map); 
        
        // 10. Lógica funcional de los buscadores
        setupColoniaSearch(map, capasOverlay);
        setupCoordLogic(map);

        // 11. Lógica de Navegación y Ubicación en tiempo real
        setupGPS(map);

        // 12. Lógica del botón Home personalizado (Si existe en el DOM)
        const btnHomeMap = document.getElementById('btn-map-home');
        if (btnHomeMap) {
            btnHomeMap.addEventListener('click', () => {
                map.setView([16.7538, -93.116], 13);
            });
        }

        console.log("VISOP 2.0 cargado exitosamente.");

    } catch (error) {
        console.error("Error crítico durante el inicio de la aplicación:", error);
    }
}