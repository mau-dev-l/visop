// js/modules/searchLogic.js

export function setupColoniaSearch(map, capas) {
    const input = document.getElementById('map-search-colonia');
    const sugerencias = document.getElementById('map-sugerencias');
    const btnClear = document.getElementById('btn-clear-colonia');

    if (!input || !capas.colonias) return;

    const baseDeDatos = [];
    capas.colonias.eachLayer(layer => {
        if (layer.feature && layer.feature.properties.nom_asen) {
            baseDeDatos.push({
                nombre: layer.feature.properties.nom_asen,
                layer: layer
            });
        }
    });

    input.addEventListener('input', () => {
        const texto = input.value.toLowerCase().trim();
        sugerencias.innerHTML = '';
        if (texto.length === 0) {
            sugerencias.style.display = 'none';
            return;
        }

        const coincidencias = baseDeDatos.filter(item => 
            item.nombre.toLowerCase().includes(texto)
        ).slice(0, 10);

        if (coincidencias.length > 0) {
            sugerencias.style.display = 'block';
            coincidencias.forEach(item => {
                const div = document.createElement('div');
                div.className = 'sugerencia-item';
                div.textContent = item.nombre;
                div.addEventListener('click', () => {
                    input.value = item.nombre;
                    sugerencias.style.display = 'none';
                    map.fitBounds(item.layer.getBounds());
                    item.layer.openPopup();
                });
                sugerencias.appendChild(div);
            });
        }
    });

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            input.value = '';
            sugerencias.innerHTML = '';
            sugerencias.style.display = 'none';
        });
    }
}

export function setupCoordLogic(map) {
    const input = document.getElementById('map-search-coords');
    const btnSearch = document.getElementById('btn-search-coords');
    const btnClear = document.getElementById('btn-clear-coords');
    const errorDiv = document.getElementById('map-coord-error');
    let marcadorBusqueda = null;

    if (!btnSearch || !input) return;

    btnSearch.addEventListener('click', () => {
        const texto = input.value.trim();
        if (errorDiv) errorDiv.textContent = "";
        const partes = texto.split(',').map(n => parseFloat(n));

        if (partes.length === 2 && !isNaN(partes[0]) && !isNaN(partes[1])) {
            const [lat, lon] = partes;
            if (marcadorBusqueda) map.removeLayer(marcadorBusqueda);
            
            map.flyTo([lat, lon], 18);
            marcadorBusqueda = L.marker([lat, lon]).addTo(map)
                .bindPopup(`<b>Coordenada:</b><br>${lat}, ${lon}`).openPopup();
        } else {
            if (errorDiv) errorDiv.textContent = "Formato: Lat, Lon";
        }
    });

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            input.value = '';
            if (errorDiv) errorDiv.textContent = "";
            if (marcadorBusqueda) {
                map.removeLayer(marcadorBusqueda);
                marcadorBusqueda = null;
            }
        });
    }
}