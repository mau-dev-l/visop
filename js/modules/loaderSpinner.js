// frontend/js/modules/loaderSpinner.js

/**
 * Inicializa la pantalla de carga (Spinner)
 * Inyecta el HTML y CSS necesarios al inicio del body.
 */
export function initSpinner() {
    // 1. Si ya existe, no hacemos nada
    if (document.getElementById('visop-loader')) return;

    // 2. Inyectar Estilos CSS dinámicamente
    const style = document.createElement('style');
    style.innerHTML = `
        #visop-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(33, 37, 41, 0.95); /* Fondo oscuro elegante */
            z-index: 99999; /* Por encima de todo, incluido el mapa */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: opacity 0.6s ease-out, visibility 0.6s;
            backdrop-filter: blur(5px);
        }

        /* Clase para ocultarlo suavemente */
        #visop-loader.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }

        /* Animación del texto */
        .loading-text {
            color: #fff;
            margin-top: 20px;
            font-family: 'Segoe UI', sans-serif;
            font-weight: 300;
            letter-spacing: 1px;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
    `;
    document.head.appendChild(style);

    // 3. Inyectar HTML (Usando clases de Bootstrap para el spinner)
    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'visop-loader';
    loaderDiv.innerHTML = `
        <div class="spinner-border text-light" style="width: 4rem; height: 4rem;" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
        <div class="loading-text">CARGANDO VISOP 2.0...</div>
        <small style="color: #aaa; margin-top: 10px;">Preparando capas y herramientas</small>
    `;
    
    // Lo ponemos al principio del body
    document.body.prepend(loaderDiv);
}

/**
 * Oculta la pantalla de carga con una transición suave
 * Se debe llamar cuando todo (mapa y capas) esté listo.
 */
export function hideSpinner() {
    const loader = document.getElementById('visop-loader');
    if (loader) {
        // Agregamos la clase que baja la opacidad a 0
        loader.classList.add('hidden');
        
        // Removemos el elemento del DOM después de la transición para limpiar memoria
        setTimeout(() => {
            loader.remove();
        }, 700);
    }
}
