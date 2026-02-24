// frontend/js/modules/attributeTable.js

export function initAttributeTable(map, capas) {
    console.log("Iniciando modulo de Tabla de Atributos...");

    const sidebar = document.getElementById('right-sidebar');
    const btnToggle = document.getElementById('btn-toggle-right');
    const tabsContainer = document.getElementById('attribute-tabs');
    const contentContainer = document.getElementById('attribute-tabs-content');
    const emptyState = document.getElementById('empty-state-msg');

    if (!sidebar || !btnToggle) {
        console.warn("No se encontraron los elementos HTML del sidebar derecho.");
        return;
    }

    // Alternar visibilidad
    btnToggle.addEventListener('click', () => {
        sidebar.classList.toggle('activo');
    });

    // Definir qué capas de obras se rastrearán para la tabla
    const trackedLayers = [
        { id: 'fais25', name: 'FAIS 25', layer: capas.faismun2025, color: '#ce0cae' },
        { id: 'pim25', name: 'PIM 25', layer: capas.pim2025, color: '#00897B' },
        { id: 'fais24', name: 'FAIS 24', layer: capas.faismun2024, color: '#0077b6' },
        { id: 'fais23', name: 'FAIS 23', layer: capas.faismun2023, color: '#2a9d8f' }
    ];

    // Función principal de renderizado
    function renderTabs() {
        let activeCount = 0;
        
        // Limpiamos pestañas y contenido (respetando el mensaje de estado vacío)
        tabsContainer.innerHTML = '';
        Array.from(contentContainer.children).forEach(child => {
            if (child.id !== 'empty-state-msg') child.remove();
        });

        // Recorrer las capas trackeadas
        trackedLayers.forEach((item) => {
            // Verificar si la capa existe y está encendida en el mapa
            if (item.layer && map.hasLayer(item.layer)) {
                activeCount++;
                const isFirst = (activeCount === 1);
                
                // 1. Crear Pestaña (Tab)
                const li = document.createElement('li');
                li.className = 'nav-item';
                li.setAttribute('role', 'presentation');
                
                const btn = document.createElement('button');
                btn.className = `nav-link ${isFirst ? 'active' : ''}`;
                btn.id = `${item.id}-tab`;
                btn.setAttribute('data-bs-toggle', 'tab');
                btn.setAttribute('data-bs-target', `#${item.id}-pane`);
                btn.type = 'button';
                btn.setAttribute('role', 'tab');
                btn.style.color = isFirst ? '#000' : item.color;
                btn.style.fontWeight = 'bold';
                btn.textContent = item.name;

                // Efecto visual para pestaña activa
                btn.addEventListener('show.bs.tab', () => { btn.style.color = '#000'; });
                btn.addEventListener('hide.bs.tab', () => { btn.style.color = item.color; });

                li.appendChild(btn);
                tabsContainer.appendChild(li);

                // 2. Crear Panel de Contenido para la lista
                const pane = document.createElement('div');
                pane.className = `tab-pane fade ${isFirst ? 'show active' : ''}`;
                pane.id = `${item.id}-pane`;
                pane.setAttribute('role', 'tabpanel');

                const listGroup = document.createElement('div');
                listGroup.className = 'list-group list-group-flush';

                // 3. Iterar sobre las geometrías de la capa para extraer propiedades
                item.layer.eachLayer(l => {
                    const p = l.feature.properties;
                    
                    // Asegurar compatibilidad de nombres de columnas entre diferentes años/capas
                    const nombre = p.nom_obra || p['Nombre de'] || p.name || 'Obra sin nombre';
                    const colonia = p.colonia || p.Colonia || 'Colonia no especificada';
                    // Extraer la clave de preparación o clave presupuestaria (FAISMUN o PIM)
                    const cvePrep = p.cve_prep || p['Clave Pres'] || 'Sin clave';
                    
                    let montoStr = '$0.00';
                    const rawMonto = p.monto || p['Monto Apro'];
                    try {
                        if (rawMonto) {
                            const num = parseFloat(String(rawMonto).replace(/[^0-9.-]+/g,""));
                            montoStr = new Intl.NumberFormat('es-MX', {style:'currency', currency:'MXN'}).format(num);
                        }
                    } catch(e) {}

                    // Crear elemento de la lista
                    const a = document.createElement('a');
                    a.href = '#';
                    a.className = 'list-group-item list-group-item-action obra-item-list p-2 text-decoration-none';
                    a.innerHTML = `
                        <div class="d-flex w-100 justify-content-between align-items-start mb-1">
                            <strong class="text-truncate d-block" style="max-width: 190px; color: #333; font-size: 11px;">${nombre}</strong>
                            <span class="badge" style="background-color: ${item.color}; font-size: 9px;">${montoStr}</span>
                        </div>
                        <div class="d-flex w-100 justify-content-between align-items-center">
                            <small class="text-muted text-truncate" style="font-size: 10px; max-width: 150px;"><i class="fa-solid fa-map-pin"></i> ${colonia}</small>
                            <small class="text-secondary" style="font-size: 9px; font-weight: 600;"><i class="fa-solid fa-hashtag"></i> ${cvePrep}</small>
                        </div>
                    `;

                    // Acción: Al hacer clic en la obra de la lista, el mapa viaja hacia ella
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (l.getBounds) {
                            // Para Polígonos y Líneas
                            map.fitBounds(l.getBounds(), { padding: [50, 50], maxZoom: 18 });
                        } else if (l.getLatLng) {
                            // Para Puntos
                            map.setView(l.getLatLng(), 18);
                        }
                        l.openPopup();
                        
                        // Auto-colapsar sidebar en pantallas pequeñas para dejar ver el mapa
                        if (window.innerWidth < 992) {
                            sidebar.classList.remove('activo');
                        }
                    });

                    listGroup.appendChild(a);
                });

                pane.appendChild(listGroup);
                contentContainer.appendChild(pane);
            }
        });

        // Alternar entre el mensaje vacío o las pestañas
        if (activeCount > 0) {
            emptyState.style.display = 'none';
            tabsContainer.style.display = 'flex';
        } else {
            emptyState.style.display = 'block';
            tabsContainer.style.display = 'none';
        }
    }

    // Escuchar los eventos del mapa para reaccionar en tiempo real
    map.on('layeradd layerremove', (e) => {
        // Solo actualizamos la tabla si la capa activada/desactivada es de obras
        if (trackedLayers.some(t => t.layer === e.layer)) {
            renderTabs();
        }
    });
}