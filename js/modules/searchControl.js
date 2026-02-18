// js/modules/searchControl.js

export function initSearchControls(map) {
    const SearchControl = L.Control.extend({
        options: { position: 'bottomleft' },
        onAdd: function() {
            const container = L.DomUtil.create('div', 'leaflet-search-bottom-wrapper');
            L.DomEvent.disableClickPropagation(container);
            
            container.innerHTML = `
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
                            <button id="btn-clear-coords" class="btn btn-white border-start-0" type="button"><i class="fa-solid fa-eraser text-muted"></i></button>
                        </div>
                        <div id="map-coord-error" class="error-badge-map"></div>
                    </div>
                </div>`;
            return container;
        }
    });
    map.addControl(new SearchControl());
}