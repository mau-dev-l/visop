// frontend/js/app.js

import { initMap } from './modules/mapSetup.js';
import { cargarCapasBackend } from './modules/layers.js';
import { setupSidebarControls } from './modules/ui.js';
// import { initDashboard } from './modules/dashboard.js';
import { initDashboardManzanas } from './modules/dashboardManzanas.js';
import { initLegend } from './modules/legend.js'; 
import { setupGPS } from './modules/gps.js'; 
import { initGallery } from './modules/gallery.js'; 

// --- MÓDULOS DE INTERFAZ Y SEGURIDAD ---
import { initSearchControls } from './modules/searchControl.js';
import { setupColoniaSearch, setupCoordLogic } from './modules/searchLogic.js';
import { setupSidebarToggle } from './modules/uiLayout.js';
import { initAuth } from './modules/auth.js'; 

/**
 * Lógica para alternar entre Modo Claro y Oscuro
 */
function setupDarkMode() {
    const btn = document.getElementById('btn-dark-mode');
    if (!btn) return;

    // Verificar si ya existía una preferencia guardada en el navegador
    if (localStorage.getItem('visop-theme') === 'dark') {
        document.body.classList.add('dark-mode');
        btn.innerHTML = '<i class="fa-solid fa-sun text-warning"></i>';
    }

    btn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        
        // Guardar la preferencia del usuario
        localStorage.setItem('visop-theme', isDark ? 'dark' : 'light');
        
        // Actualizar icono visualmente
        btn.innerHTML = isDark 
            ? '<i class="fa-solid fa-sun text-warning"></i>' 
            : '<i class="fa-solid fa-moon"></i>';
            
        console.log(`Modo ${isDark ? 'Oscuro' : 'Claro'} activado.`);
    });
}

/**
 * Función principal de inicio del VISOP 2.0
 */
export async function iniciarVisop() {
    console.log("Iniciando lógica de VISOP 2.0...");

    // Validar que el contenedor del mapa exista antes de iniciar Leaflet
    if (!document.getElementById('map-container')) {
        console.error("Error: No se encontró 'map-container'.");
        return;
    }

    try {
        // 1. Iniciar Mapa base (Centro y Zoom inicial)
        const { map, baseLayers } = initMap();

        // 2. Cargar Capas desde GeoServer (WFS/WMS)
        const capasOverlay = await cargarCapasBackend();

        // 3. Habilitar función de Colapso de Sidebar
        setupSidebarToggle(map);

        // 4. Control de Capas Base (Top-Right)
        L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

        // 5. Configurar Sidebar (Vincula switches con capas)
        setupSidebarControls(map, capasOverlay);

        // 6. Iniciar Dashboards y Estadísticas
        // initDashboard();
        if (capasOverlay.manzanas) {
            initDashboardManzanas(map, capasOverlay.manzanas);
        }

        // 7. Iniciar Leyenda Dinámica
        initLegend(map, capasOverlay);

        // 8. Iniciar Módulo de Galería
        initGallery(); 

        // 9. Inicialización de Controles sobre el Mapa (Home, GPS, Ayuda, Llave)
        initSearchControls(map); 
        
        // 10. Lógica funcional de buscadores
        setupColoniaSearch(map, capasOverlay);
        setupCoordLogic(map);

        // 11. Lógica de Navegación y Ubicación
        setupGPS(map);

        // 12. Inicializar Sistema de Autenticación y Edición
        initAuth(map, capasOverlay);

        // 13. Configurar el Modo Oscuro
        // setupDarkMode();

        // 14. Lógica del botón Home personalizado
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