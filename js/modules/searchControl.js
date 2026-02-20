// js/modules/searchControl.js

export function initSearchControls(map) {
    const SearchControl = L.Control.extend({
        options: { position: 'topleft' },
        onAdd: function() {
            const container = L.DomUtil.create('div', 'leaflet-search-bottom-wrapper');
            L.DomEvent.disableClickPropagation(container);
            
            const toggleBtn = L.DomUtil.create('button', 'btn btn-sm btn-custom-tuxtla leaflet-search-toggle');
            toggleBtn.innerHTML = '<i class="fa-solid fa-sliders"></i>';
            toggleBtn.title = 'Controles de búsqueda';
            container.appendChild(toggleBtn);
            
            const searchContent = L.DomUtil.create('div', 'leaflet-search-content');
            searchContent.style.display = 'none';
            searchContent.innerHTML = `
                <div class="search-container-map shadow">
                    <div class="d-flex gap-1 mb-2">
                        <button id="btn-map-home" class="btn btn-sm btn-custom-tuxtla w-25" title="Inicio">
                            <i class="fa-solid fa-house"></i>
                        </button>
                        <button id="btn-map-gps" class="btn btn-sm btn-primary w-25" title="GPS">
                            <i class="fa-solid fa-location-crosshairs"></i>
                        </button>
                        <button id="btn-map-manual" class="btn btn-sm btn-dark w-25" title="Ayuda" data-bs-toggle="modal" data-bs-target="#modalManual">
                            <i class="fa-solid fa-question"></i>
                        </button>
                        <button id="btn-map-auth" class="btn btn-sm btn-outline-dark w-25" title="Acceso Editor" data-bs-toggle="modal" data-bs-target="#modalLogin">
                            <i class="fa-solid fa-key"></i>
                        </button>
                    </div>

                    <div id="container-clean-gps" style="display: none;" class="mb-2">
                        <button id="btn-map-clean-gps" class="btn btn-xs btn-danger w-100 shadow-sm" style="font-size: 10px; padding: 2px;">
                            <i class="fa-solid fa-trash-can"></i> Quitar marcador de ubicación
                        </button>
                    </div>

                    <div class="map-search-item">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-white"><i class="fa-solid fa-map-location-dot text-warning"></i></span>
                            <input type="text" id="map-search-colonia" class="form-control" placeholder="Buscar colonia...">
                            <button id="btn-clear-colonia" class="btn btn-white border-start-0" type="button"><i class="fa-solid fa-xmark text-muted"></i></button>
                        </div>
                        <div id="map-sugerencias" class="sugerencias-map"></div>
                    </div>

                    <div class="map-search-item mt-2">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-white"><i class="fa-solid fa-crosshairs text-primary"></i></span>
                            <input type="text" id="map-search-coords" class="form-control" placeholder="Lat, Lon">
                            <button id="btn-search-coords" class="btn btn-custom-tuxtla" type="button"><i class="fa-solid fa-location-arrow"></i></button>
                        </div>
                    </div>
                </div>`;
            container.appendChild(searchContent);
            
            toggleBtn.addEventListener('click', () => {
                searchContent.style.display = searchContent.style.display === 'none' ? 'block' : 'none';
            });
            
            return container;
        }
    });
    map.addControl(new SearchControl());
}