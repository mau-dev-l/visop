// frontend/js/app.js

import { loadComponent } from './modules/loader.js';
import { initMap } from './modules/mapSetup.js';
import { cargarCapasBackend } from './modules/layers.js';             
import { cargarCapasFaismun } from './modules/geoserverLayers.js';
import { cargarPim2025 } from './modules/pim2025.js';    

import { setupSidebarControls } from './modules/ui.js';
import { setupSearch } from './modules/search.js';
import { initDashboard } from './modules/dashboard.js';
import { initDashboardManzanas } from './modules/dashboardManzanas.js';
import { initLegend } from './modules/legend.js'; 
import { setupGPS } from './modules/gps.js'; 
import { initGallery } from './modules/gallery_dynamic.js'; 
import { setupCoordSearch } from './modules/searchCoords.js';

// 1. NUEVO IMPORT: SPINNER DE CARGA
import { initSpinner, hideSpinner } from './modules/loaderSpinner.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    //  2. ACTIVAR SPINNER AL INICIO
    initSpinner();
    console.log("Cargando componentes HTML...");

    try {
        // Carga de componentes
        await Promise.all([
            loadComponent('layout-header', 'components/header.html'),
            loadComponent('layout-sidebar', 'components/sidebar.html'),
            loadComponent('placeholder-buscadores', 'components/buscadores.html'),
            loadComponent('placeholder-map-controls', 'components/map_controls.html'),
            loadComponent('placeholder-legend', 'components/legend.html'), 
            loadComponent('placeholder-dashboard-demografico', 'components/dashboard_demografico.html'),
            loadComponent('modalDashboard', 'components/modal_dashboard.html')
        ]);

        console.log(" Componentes cargados. Iniciando lógica...");

        // INICIALIZAR GALERÍA (Prioridad Alta)
        initGallery(); 

        // INICIAR MAPA
        const { map, baseLayers } = initMap();

        // CARGAR TODAS LAS CAPAS (PARALELO)
        // El spinner seguirá visible mientras esto se descarga
        const [capasOriginales, capasFaismun, capaPim] = await Promise.all([
            cargarCapasBackend(),
            cargarCapasFaismun(map),
            cargarPim2025(map)
        ]);

        // FUSIONAR EN OBJETO PRINCIPAL
        const capasOverlay = {
            ...capasOriginales,
            ...capasFaismun,
            pim2025: capaPim
        };

        L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

        // Zoom Home
        const btnHome = document.getElementById('btn-zoom-home');
        if(btnHome) btnHome.addEventListener('click', () => map.setView([16.7538, -93.116], 13));

        // CONFIGURAR CONTROLES
        setupSidebarControls(map, capasOverlay);
        setupSearch(map, capasOverlay);
        initDashboard();

        // Dashboard Manzanas
        if (capasOverlay.manzanas) {
            initDashboardManzanas(map, capasOverlay.manzanas);
        }

        initLegend(map, capasOverlay);
        setupGPS(map); 
        setupCoordSearch(map);

        console.log("VISOP 2.0 Iniciado Exitosamente.");

    } catch (error) {
        // Si algo falla, lo mostramos en consola
        console.error("Error crítico durante la carga:", error);
    } finally {
        //  3. OCULTAR SPINNER SIEMPRE (Al terminar bien o mal)
        hideSpinner();
    }
});