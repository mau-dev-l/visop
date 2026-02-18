// js/modules/uiLayout.js

export function setupSidebarToggle(map) {
    const container = document.getElementById('app-container');
    
    // Creamos el control de Leaflet para el botón de colapso
    const ToggleControl = L.Control.extend({
        options: { position: 'topleft' },
        onAdd: function() {
            const btn = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom-toggle');
            btn.innerHTML = '<a href="#" title="Alternar Sidebar" role="button" aria-label="Alternar Sidebar"><i class="fa-solid fa-bars"></i></a>';
            btn.style.backgroundColor = 'white';
            btn.style.width = '34px';
            btn.style.height = '34px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.cursor = 'pointer';

            L.DomEvent.on(btn, 'click', function(e) {
                L.DomEvent.stopPropagation(e);
                L.DomEvent.preventDefault(e);
                
                // Alternamos la clase en el contenedor principal
                container.classList.toggle('sidebar-collapsed');
                
                // IMPORTANTE: Notificar a Leaflet que el tamaño del contenedor cambió
                setTimeout(() => {
                    map.invalidateSize({ animate: true });
                }, 300); // Tiempo igual a la transición CSS
            });

            return btn;
        }
    });

    map.addControl(new ToggleControl());
}