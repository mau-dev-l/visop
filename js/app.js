// frontend/js/app.js

import { initMap } from './modules/mapSetup.js';
import { cargarCapasBackend } from './modules/layers.js';
import { setupSidebarControls } from './modules/ui.js';
import { initDashboard } from './modules/dashboard.js';
import { initDashboardManzanas } from './modules/dashboardManzanas.js';
import { initLegend } from './modules/legend.js'; 
import { setupGPS } from './modules/gps.js'; 
import { initGallery } from './modules/gallery.js'; 

// --- MÓDULOS DE INTERFAZ Y SEGURIDAD ---
import { initSearchControls } from './modules/searchControl.js';
import { setupColoniaSearch, setupCoordLogic } from './modules/searchLogic.js';
import { setupSidebarToggle } from './modules/uiLayout.js';
import { initAuth } from './modules/auth.js'; // Módulo de autenticación y edición

/**
 * Función principal de inicio del VISOP 2.0
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

        // 3. Habilitar función de Colapso de Sidebar (Botón en Top-Left)
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
        // Crea los botones de Inicio, GPS, Ayuda y la Llave de acceso
        initSearchControls(map); 
        
        // 10. Lógica funcional de los buscadores (Colonias y Coordenadas)
        setupColoniaSearch(map, capasOverlay);
        setupCoordLogic(map);

        // 11. Lógica de Navegación y Ubicación en tiempo real
        setupGPS(map);

        // 12. Inicializar Sistema de Autenticación y Herramientas de Edición
        // Pasamos capasOverlay para que el editor pueda seleccionar el destino de los trazos
        initAuth(map, capasOverlay);

        // 13. Lógica del botón Home personalizado
        const btnHomeMap = document.getElementById('btn-map-home');
        if (btnHomeMap) {
            btnHomeMap.addEventListener('click', () => {
                map.setView([16.7538, -93.116], 13);
            });
        }

        console.log("VISOP 2.0: Módulos de consulta y edición listos.");
        return true;

    } catch (error) {
        console.error("Error durante la inicialización de módulos en app.js:", error);
        throw error;
    }
}