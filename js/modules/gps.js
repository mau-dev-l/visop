// frontend/js/modules/gps.js

export function setupGPS(map) {
    console.log("Módulo GPS iniciado (Controles en Mapa)");

    // Referencias a los nuevos botones en el mapa
    const btnGPS = document.getElementById('btn-map-gps');
    const btnClean = document.getElementById('btn-map-clean-gps');

    if (!btnGPS) return;

    let userMarker = null;
    let userCircle = null;

    // --- 1. FUNCIÓN GLOBAL PARA LIMPIAR GPS ---
    window.limpiarGPS = function() {
        if (userMarker) {
            map.removeLayer(userMarker);
            userMarker = null;
        }
        if (userCircle) {
            map.removeLayer(userCircle);
            userCircle = null;
        }
        
        if (btnClean) btnClean.style.display = 'none';
        
        btnGPS.disabled = false;
        btnGPS.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> GPS';
        
        console.log("GPS limpiado.");
    };

    // --- 2. ACTIVAR GPS ---
    btnGPS.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización.");
            return;
        }

        // Limpiar búsquedas o rastros previos
        if (window.limpiarBusqueda) window.limpiarBusqueda();
        window.limpiarGPS();

        const originalContent = '<i class="fa-solid fa-location-crosshairs"></i> GPS';
        btnGPS.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ...';
        btnGPS.disabled = true;

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                map.flyTo([latitude, longitude], 18, { duration: 1.5 });

                userMarker = L.marker([latitude, longitude]).addTo(map)
                    .bindPopup(`<strong>¡Estás aquí!</strong><br><small>Precisión: ±${Math.round(accuracy)} m</small>`)
                    .openPopup();

                userCircle = L.circle([latitude, longitude], {
                    color: '#136f63',
                    fillColor: '#136f63',
                    fillOpacity: 0.2,
                    radius: accuracy
                }).addTo(map);

                if (btnClean) btnClean.style.display = 'block';

                btnGPS.innerHTML = originalContent;
                btnGPS.disabled = false;
            },
            (error) => {
                let msg = "Error al obtener ubicación.";
                if (error.code === 1) msg = "Permiso denegado.";
                alert(msg);
                btnGPS.innerHTML = originalContent;
                btnGPS.disabled = false;
            },
            options
        );
    });

    if (btnClean) {
        btnClean.addEventListener('click', () => {
            window.limpiarGPS();
        });
    }
}