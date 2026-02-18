// js/modules/auth.js

/**
 * Inicializa el sistema de autenticación (Solo Frontend)
 * @param {L.Map} map - Objeto del mapa de Leaflet
 * @param {Object} capasOverlay - Capas cargadas desde el backend
 */
export function initAuth(map, capasOverlay) {
    const form = document.getElementById('form-login-visop');
    const loginModalElement = document.getElementById('modalLogin');
    
    if (!form || !loginModalElement) return;

    const loginModal = bootstrap.Modal.getOrCreateInstance(loginModalElement);

    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const userInput = document.getElementById('login-user').value;
        const passInput = document.getElementById('login-pass').value;
        const errorMsg = document.getElementById('login-error');

        // --- CONEXIÓN CON EL BACKEND ---
        try {
            // Aquí tu amigo te dará la URL final (ej: 'http://localhost:3000/api/login')
            // Por ahora simulamos la petición
            const respuesta = await simularPeticionBackend(userInput, passInput);

            if (respuesta.success) {
                console.log("Acceso autorizado por el servidor.");
                loginModal.hide();
                
                // Feedback visual de sesión iniciada
                actualizarInterfazLogin(true);

                // Activar el panel de edición restringido a FAISMUN y PIM 2025
                activarPanelEdicionObra(map, capasOverlay);
                
                alert(`Bienvenido ${respuesta.nombre}. Modo edición FAISMUN/PIM habilitado.`);
            } else {
                if (errorMsg) errorMsg.style.display = 'block';
            }
        } catch (error) {
            console.error("Error de conexión con el servidor:", error);
            alert("No se pudo conectar con el servicio de autenticación.");
        }
    };
}

/**
 * Simulación de lo que hará el backend de tu amigo
 */
async function simularPeticionBackend(user, pass) {
    // Esto es lo que tu amigo validará en su servidor
    if (user === "admin_sig" && pass === "Tuxtla2026") {
        return { success: true, nombre: "Yahir", rol: "Editor" };
    }
    return { success: false };
}

function actualizarInterfazLogin(estaActivo) {
    const authBtn = document.getElementById('btn-map-auth');
    if (!authBtn) return;

    if (estaActivo) {
        authBtn.classList.replace('btn-outline-dark', 'btn-success');
        authBtn.innerHTML = '<i class="fa-solid fa-user-check"></i>';
        authBtn.title = "Sesión activa: Editor SIG";
    }
}

function activarPanelEdicionObra(map, capas) {
    const sidebarBody = document.querySelector('#collapseCapas .card-body');
    if (!sidebarBody) return;

    // Inyectamos el formulario de captura especializado en el Sidebar
    sidebarBody.innerHTML = `
        <div class="alert alert-dark py-2 mb-3 shadow-sm" style="background-color: #2c2c2c; border: none;">
            <small class="text-white">
                <i class="fa-solid fa-person-digging me-1 text-warning"></i> 
                <strong>Editor de Obra Pública</strong>
            </small>
        </div>
        
        <div class="mb-3">
            <label class="form-label small fw-bold">1. Seleccionar Programa</label>
            <select id="select-capa-destino" class="form-select form-select-sm border-warning">
                <option value="faismun2025">FAISMUN 2025</option>
                <option value="pim2025">PIM 2025</option>
            </select>
        </div>

        <div class="mb-2">
            <label class="form-label small fw-bold">2. Datos del Registro</label>
            <input type="text" id="edit-nombre" class="form-control form-control-sm mb-2" placeholder="Nombre de la Obra">
            <textarea id="edit-desc" class="form-control form-control-sm" placeholder="Observaciones técnicas..." rows="3"></textarea>
        </div>

        <hr class="my-3">

        <div class="d-grid gap-2">
            <button id="btn-save-obra" class="btn btn-sm btn-success shadow-sm">
                <i class="fa-solid fa-cloud-arrow-up me-1"></i> Guardar en Servidor
            </button>
            <button onclick="location.reload()" class="btn btn-sm btn-outline-danger border-0 mt-2">
                <i class="fa-solid fa-power-off me-1"></i> Cerrar Sesión
            </button>
        </div>
    `;

    activarHerramientasDibujo(map);
}

function activarHerramientasDibujo(map) {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
            polyline: { shapeOptions: { color: '#C68A2C', weight: 5 } },
            polygon: false, circle: false, rectangle: false, marker: true, circlemarker: false
        },
        edit: { featureGroup: drawnItems, remove: true }
    });
    
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e) => {
        drawnItems.addLayer(e.layer);
        alert("Trazo capturado. Ingrese los datos en el panel y presione Guardar.");
    });
}