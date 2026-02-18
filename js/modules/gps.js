// js/modules/gps.js

export function setupGPS(map) {
    const btnGPS = document.getElementById('btn-map-gps');
    const containerClean = document.getElementById('container-clean-gps');
    const btnClean = document.getElementById('btn-map-clean-gps');

    if (!btnGPS) return;

    let userMarker = null;
    let userCircle = null;

    // Función para limpiar rastro
    window.limpiarGPS = function() {
        if (userMarker) map.removeLayer(userMarker);
        if (userCircle) map.removeLayer(userCircle);
        userMarker = null;
        userCircle = null;
        
        if (containerClean) containerClean.style.display = 'none';
        btnGPS.disabled = false;
        console.log("GPS Limpiado");
    };

    btnGPS.addEventListener('click', () => {
        if (!navigator.geolocation) return alert("Sin soporte GPS");

        btnGPS.disabled = true;
        
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            map.flyTo([latitude, longitude], 17);

            // Limpiar previo si existe
            if (userMarker) map.removeLayer(userMarker);
            if (userCircle) map.removeLayer(userCircle);

            userMarker = L.marker([latitude, longitude]).addTo(map).bindPopup("Usted está aquí").openPopup();
            userCircle = L.circle([latitude, longitude], { radius: accuracy, color: '#0d6efd' }).addTo(map);

            // Mostrar el botón de limpieza
            if (containerClean) containerClean.style.display = 'block';
            btnGPS.disabled = false;
        }, (err) => {
            alert("Error al obtener ubicación");
            btnGPS.disabled = false;
        }, { enableHighAccuracy: true });
    });

    if (btnClean) {
        btnClean.onclick = () => window.limpiarGPS();
    }
}