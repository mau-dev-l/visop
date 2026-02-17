// frontend/js/modules/gallery.js

export function initGallery() {
    console.log("Módulo de Galería Universal iniciado...");
    injectModalHTML();
    exposeGlobalFunction();
}

function injectModalHTML() {
    if (document.getElementById('modalGaleria')) return;

    const modalHTML = `
    <div class="modal fade" id="modalGaleria" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="titulo-galeria">Evidencia Fotográfica</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-light">
                    <div class="row text-center">
                        <div class="col-12 col-md-6 mb-3">
                            <div class="card h-100 shadow-sm border-warning">
                                <div class="card-header bg-warning text-dark fw-bold">
                                    <i class="fa-solid fa-clock-rotate-left"></i> ANTES
                                </div>
                                <div class="card-body p-1 d-flex align-items-center justify-content-center bg-dark" style="min-height: 300px;">
                                    <img id="img-antes" src="" class="img-fluid rounded" style="max-height: 450px; object-fit: contain;" alt="Evidencia Antes">
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 mb-3">
                            <div class="card h-100 shadow-sm border-success">
                                <div class="card-header bg-success text-white fw-bold">
                                    <i class="fa-solid fa-check-circle"></i> DESPUÉS
                                </div>
                                <div class="card-body p-1 d-flex align-items-center justify-content-center bg-dark" style="min-height: 300px;">
                                    <img id="img-despues" src="" class="img-fluid rounded" style="max-height: 450px; object-fit: contain;" alt="Evidencia Después">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="alert alert-secondary mt-2 small text-center mb-0">
                        <i class="fa-solid fa-folder-open"></i> Carpeta: <span id="nombre-carpeta-ref" class="fw-bold me-3"></span>
                        <i class="fa-solid fa-key"></i> Clave: <span id="clave-obra-ref" class="fw-bold font-monospace"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function exposeGlobalFunction() {
    /**
     * @param {string} cvePrep - Clave presupuestal de la obra
     * @param {string} nombreObra - Nombre para el título del modal
     * @param {string} carpeta - Nombre de la subcarpeta en assets/ (ej: 'pim_2025' o 'faismun_2025')
     * @param {string} ext - Extensión de la imagen (ej: 'jpg' o 'png')
     */
    window.abrirGaleria = function(cvePrep, nombreObra, carpeta = 'faismun_2025', ext = 'jpg') {
        
        const modalEl = document.getElementById('modalGaleria');
        const imgAntes = document.getElementById('img-antes');
        const imgDespues = document.getElementById('img-despues');
        const titulo = document.getElementById('titulo-galeria');
        const lblClave = document.getElementById('clave-obra-ref');
        const lblCarpeta = document.getElementById('nombre-carpeta-ref');

        // 1. Limpieza de datos
        if (!cvePrep || cvePrep === 'null' || cvePrep === 'undefined') {
            alert("Esta obra no tiene una Clave válida para buscar fotos.");
            return;
        }
        const cleanCve = String(cvePrep).trim();
        
        // 2. Construcción de Rutas Dinámicas
        // Ejemplo PIM: assets/pim_2025/CLAVE_antes.png
        const rutaAntes = `assets/${carpeta}/${cleanCve}_antes.${ext}`;
        const rutaDespues = `assets/${carpeta}/${cleanCve}_despues.${ext}`;

        console.log(`📸 Solicitando galería: ${rutaAntes}`);

        // 3. Actualizar Interfaz
        titulo.innerText = nombreObra || "Detalle de Obra";
        lblClave.innerText = cleanCve;
        lblCarpeta.innerText = carpeta.toUpperCase();

        // Placeholder en caso de error
        const placeholder = `https://via.placeholder.com/500x400?text=No+se+encontró+imagen+en+${carpeta}`;
        
        imgAntes.onerror = function() { this.src = placeholder; };
        imgDespues.onerror = function() { this.src = placeholder; };

        // 4. Cargar Imágenes
        imgAntes.src = rutaAntes;
        imgDespues.src = rutaDespues;

        // 5. Mostrar Modal
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    };
}