const taskContainer = document.getElementById("tasks-container");
const newTaskButton = document.getElementById("new-task-button");
const headerContainerUser = document.getElementById("header-container-user");
const adminActions = document.getElementById("admin-actions");
const clearDataButton = document.getElementById("clear-data-button");

/* USUARIOS */
let usuarios = [];
let tareas = [];
let usuarioActivo = {
  nombre: '',
  apellido: '',
  foto: '',
  cargo: '',
  tarea_asignada: '',
  tareas_resueltas: []
};

// Función para crear el modal de selección de usuarios
function crearModalSeleccionUsuario() {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.id = 'modal-seleccion-usuario';

  modalOverlay.innerHTML = `
    <div class="modal">
      <h2>Selecciona tu perfil</h2>
      <div class="grid-usuarios" id="grid-usuarios">
        <!-- Se llenará dinámicamente con los usuarios -->
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);
  return modalOverlay;
}

// Función para crear el modal de tareas
function crearModalTareas() {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay hidden';
  modalOverlay.id = 'modal-overlay';

  modalOverlay.innerHTML = `
    <div class="modal">
      <h2>Crear Nueva Tarea</h2>
      <form id="new-task-form">
        <input type="text" placeholder="Nombre de la tarea" id="task-name">
        <input type="text" placeholder="Lugar de trabajo" id="task-location">
        <textarea col="50" rows="10" placeholder="Descripción" id="task-description"></textarea>
        <div id="select-container" class="select-container">
          <label for="user-select">Asignar a:</label>
          <select id="user-select" class="form-select">
            <option value="">Seleccionar usuario...</option>
          </select>
        </div>
        <div class="modal-button-container">
          <button type="button" id="save-task-button" class="button">Guardar</button>
          <button type="button" id="close-modal" class="close-button">Cancelar</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modalOverlay);
  return modalOverlay;
}

// Crear los modales
const modalSeleccionUsuario = crearModalSeleccionUsuario();
const gridUsuarios = document.getElementById('grid-usuarios');
const modalOverlay = crearModalTareas();
const newTaskForm = document.getElementById('new-task-form');
const closeModal = document.getElementById('close-modal');
const saveTaskButton = document.getElementById('save-task-button');

// Cargar usuaros delarchivo JSON
async function cargarUsuarios() {
  try {
    const response = await fetch('./assets/data/usuarios.json');
    const data = await response.json();
    usuarios = data.usuarios;
    mostrarModalSeleccionUsuario();
  } catch (error) {
    
    Swal.fire({
      title: 'Error',
      text: 'No se pudieron cargar los usuarios. Por favor, recarga la página.',
      icon: 'error',
      confirmButtonColor: '#1E3A8A'
    });
  }
}

// Mostrar modal de selección de usuario 
function mostrarModalSeleccionUsuario() {
  gridUsuarios.innerHTML = usuarios.map(usuario => `
    <div class="usuario-selection-nombre-cargo" data-usuario="${usuario.nombre}">
      <img src="${usuario.foto}" alt="${usuario.nombre} ${usuario.apellido}" class="usuario-nombre-cargo-foto">
      <div class="usuario-nombre-cargo-info">
        <span class="usuario-nombre-cargo-nombre">${usuario.nombre} ${usuario.apellido}</span>
        <span class="usuario-nombre-cargo-cargo">${usuario.cargo}</span>
      </div>
    </div>
  `).join('');

  // Agregar event listeners a los items de usuario
  document.querySelectorAll('.usuario-selection-nombre-cargo').forEach(item => {
    item.addEventListener('click', () => {
      seleccionarUsuario(item.dataset.usuario);
    });
  });
}

// Seleccionar usuario 
function seleccionarUsuario(nombre) {
  usuarioActivo = usuarios.find(u => u.nombre === nombre);
  modalSeleccionUsuario.classList.add('hidden');
  document.querySelector('main').style.display = 'flex';
  actualizarInterfazUsuario();
  mostrarTareas();
  actualizarNotificaciones();
}

// Actualizar interfaz según el usuario 
function actualizarInterfazUsuario() {
  headerContainerUser.innerHTML = `
    <div class="usuario-activo">
      <img src="${usuarioActivo.foto}" alt="${usuarioActivo.nombre} ${usuarioActivo.apellido}">
      <div class="usuario-info">
        <h3>${usuarioActivo.nombre} ${usuarioActivo.apellido}</h3>
        <p>${usuarioActivo.cargo}</p>
      </div>
    </div>
    <button class="logout-button" title="Cerrar sesión">
      <i class="fa-solid fa-right-from-bracket"></i>
    </button>
  `;


  headerContainerUser.querySelector('.logout-button').addEventListener('click', cerrarSesion);


  newTaskButton.style.display = usuarioActivo.cargo === 'supervisor' ? 'block' : 'none';
  
 
  if (usuarioActivo.cargo === 'supervisor') {
    adminActions.classList.add('visible');
  } else {
    adminActions.classList.remove('visible');
  }
}

// Cerrar sesión del usuario actual
function cerrarSesion() {
  usuarioActivo = {
    nombre: '',
    apellido: '',
    foto: '',
    cargo: '',
    tarea_asignada: '',
    tareas_resueltas: []
  };
  
  
  
  document.querySelector('main').style.display = 'none';

  modalSeleccionUsuario.classList.remove('hidden');
  headerContainerUser.innerHTML = '';
  taskContainer.innerHTML = '';
}

// Función para formatear fecha y hora
function formatearFechaHora(fecha) {
  const opciones = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(fecha).toLocaleString('es-ES', opciones);
}

// Función para actualizar el menú activo 
function actualizarMenuActivo(seccion) {
  document.querySelectorAll('.menu-link').forEach(item => {
    item.classList.remove('active');
  });
    const menuItem = document.getElementById(`${seccion.toLowerCase()}-link`);
  if (menuItem) {
    menuItem.classList.add('active');
  }
}

// Limpiar formularios
function limpiarFormulario() {
  document.getElementById("task-name").value = "";
  document.getElementById("task-location").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("user-select").value = "";
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

// Mostrar/ocultar contenedores
function toggleContenedores(contenedorAMostrar) {
  document.getElementById('tasks-container').classList.add('hidden');
  document.getElementById('employees-container').classList.add('hidden');
  document.getElementById(contenedorAMostrar).classList.remove('hidden');
}

// Mostrar tareas
function mostrarTareas() {
  actualizarMenuActivo('Tareas');
  
  // Actualizar título y mostrar botón de nueva tarea si es supervisor
  document.getElementById('main-title').textContent = 'Tareas';
  document.getElementById('new-task-button').style.display = 
    usuarioActivo.cargo === 'supervisor' ? 'block' : 'none';
  
  // Mostrar contenedor de tareas
  toggleContenedores('tasks-container');

  // Cargar tareas del localStorage
  const tareasStorage = localStorage.getItem('tareas');
  if(tareasStorage) {
    tareas = JSON.parse(tareasStorage);
  }

  // Mstrar taras según el usuario
  let tareasParaRenderizar = [...tareas];
  if (usuarioActivo.cargo !== 'supervisor') {
    tareasParaRenderizar = tareasParaRenderizar.filter(tarea => 
      tarea.asignada === `${usuarioActivo.nombre} ${usuarioActivo.apellido}`
    );
  }

  // Tares recientes
  const ahora = new Date();
  tareasParaRenderizar.forEach(tarea => {
    const fechaCambio = new Date(tarea.fecha_completado || tarea.fecha_finalizacion || tarea.fecha_creacion);
    const diferenciaMinutos = (ahora - fechaCambio) / (1000 * 60);
    tarea.reciente = diferenciaMinutos <= 5;
  });

  // Tareas por estado
  const tareasPendientes = tareasParaRenderizar.filter(tarea => tarea.estado === 'pendiente');
  const tareasCompletadas = tareasParaRenderizar.filter(tarea => 
    tarea.estado === 'completada' && !tarea.aprobada
  );
  const tareasCerradas = tareasParaRenderizar.filter(tarea => tarea.aprobada);

  // Renderizar tareas
  renderizarTareas(tareasPendientes, tareasCompletadas, tareasCerradas);
}

function renderizarTareas(tareasPendientes, tareasCompletadas, tareasCerradas) {
  taskContainer.innerHTML = `
    <div class="tasks-filters">
      <button class="filter-button active" data-estado="todas">Todas</button>
      <button class="filter-button" data-estado="pendientes">Pendientes</button>
      <button class="filter-button" data-estado="completadas">Completadas</button>
      <button class="filter-button" data-estado="cerradas">Cerradas</button>
    </div>
    <div class="tasks-groups">
      <div class="tasks-group" id="tareas-pendientes">
        <h3 class="group-title">Tareas Pendientes (${tareasPendientes.length})</h3>
        <div class="group-content">
          ${renderizarGrupoTareas(tareasPendientes)}
        </div>
      </div>
      <div class="tasks-group" id="tareas-completadas">
        <h3 class="group-title">Tareas Completadas (${tareasCompletadas.length})</h3>
        <div class="group-content">
          ${renderizarGrupoTareas(tareasCompletadas)}
        </div>
      </div>
      <div class="tasks-group" id="tareas-cerradas">
        <h3 class="group-title">Tareas Cerradas (${tareasCerradas.length})</h3>
        <div class="group-content">
          ${renderizarGrupoTareas(tareasCerradas)}
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
      filtrarTareasPorEstado(button.dataset.estado);
    });
  });

  agregarEventListenersTareas();
  actualizarNotificaciones();
}

function renderizarGrupoTareas(tareasGrupo) {
  if (tareasGrupo.length === 0) {
    return '<p class="no-tasks">No hay tareas en este grupo</p>';
  }

  return tareasGrupo.map((tarea) => {
    const tareaGlobalIndex = tareas.findIndex(t => 
      t.nombre_tarea === tarea.nombre_tarea &&
      t.asignada === tarea.asignada &&
      t.fecha_creacion === tarea.fecha_creacion
    );

    const isCompletada = tarea.estado === 'completada';
    const isAprobada = tarea.aprobada;
    const puedeEditar = usuarioActivo.cargo === 'supervisor' && !isAprobada && !isCompletada;
    const puedeAprobar = usuarioActivo.cargo === 'supervisor' && isCompletada && !isAprobada;
    const puedeCompletar = !isCompletada && !isAprobada && 
      (usuarioActivo.cargo === 'supervisor' || 
       tarea.asignada === `${usuarioActivo.nombre} ${usuarioActivo.apellido}`);

    return `
      <div class="task-card ${isCompletada ? 'completada' : ''} ${isAprobada ? 'aprobada' : ''} ${tarea.reciente ? 'reciente' : ''}">
        ${tarea.reciente ? '<div class="activity-indicator"></div>' : ''}
        <div class="task-card-info">
          <h3>${tarea.nombre_tarea}</h3>
          <p>${tarea.descripcion}</p>
          <div class="task-dates">
            <div class="task-date">
              <i class="fa-regular fa-calendar-plus"></i>
              <span>Creada: ${formatearFechaHora(tarea.fecha_creacion)}</span>
            </div>
            ${isCompletada ? `
              <div class="task-date">
                <i class="fa-regular fa-calendar-check"></i>
                <span>Completada por ${tarea.completada_por}: ${formatearFechaHora(tarea.fecha_completado)}</span>
              </div>
            ` : ''}
            ${isAprobada ? `
              <div class="task-date">
                <i class="fa-solid fa-check-circle"></i>
                <span>Aprobada: ${formatearFechaHora(tarea.fecha_finalizacion)}</span>
              </div>
            ` : ''}
          </div>
          <div class="status ${isCompletada ? 'completada' : ''} ${isAprobada ? 'aprobada' : ''}">
            ${isAprobada ? 'Tarea Cerrada' : isCompletada ? 'Completada' : 'Pendiente'}
          </div>
          <div class="task-assigned">
            <span class="task-assigned-title">Asignado a:</span>
            <div class="task-assigned-user">
              ${tarea.asignada ? `
                <span>${tarea.asignada}</span>` : `
                <span class="task-assigned-user-empty">Sin asignar</span>
              `}
            </div>
          </div>
          ${isCompletada && !isAprobada && usuarioActivo.cargo !== 'supervisor' ? `
            <div class="task-message">
              <i class="fa-solid fa-clock"></i>
              <span>A la espera de cierre de tarea por el supervisor</span>
            </div>
          ` : ''}
        </div>
        
        <div class="task-card-icons">
          ${puedeEditar ? `
            <i class="fa-solid fa-pen" data-action="editar" data-index="${tareaGlobalIndex}"></i>
            <i class="fa-solid fa-trash" data-action="eliminar" data-index="${tareaGlobalIndex}"></i>
          ` : ''}
          ${puedeCompletar ? `
            <i class="fa-solid fa-check" data-action="completar" data-index="${tareaGlobalIndex}" title="Completar tarea"></i>
          ` : ''}
          ${puedeAprobar ? `
            <i class="fa-solid fa-check-circle" data-action="aprobar" data-index="${tareaGlobalIndex}" title="Aprobar y cerrar tarea"></i>
            <i class="fa-solid fa-xmark" data-action="rechazar" data-index="${tareaGlobalIndex}" title="Rechazar completado"></i>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function agregarEventListenersTareas() {
  document.querySelectorAll('.task-card-icons i').forEach(icon => {
    icon.addEventListener('click', () => {
      const action = icon.dataset.action;
      const index = parseInt(icon.dataset.index);
      
      switch(action) {
        case 'editar':
          editarTarea(index);
          break;
        case 'eliminar':
          eliminarTarea(index);
          break;
        case 'completar':
          completarTarea(index);
          break;
        case 'aprobar':
          aprobarTarea(index);
          break;
        case 'rechazar':
          rechazarTarea(index);
          break;
      }
    });
  });
}

function filtrarTareasPorEstado(estado) {
  document.querySelectorAll('.filter-button').forEach(button => {
    button.classList.remove('active');
    if (button.dataset.estado === estado) {
      button.classList.add('active');
    }
  });

  // Mostrar/ocultar grupos según el filtro
  const grupos = document.querySelectorAll('.tasks-group');
  grupos.forEach(grupo => {
    if (estado === 'todas') {
      grupo.style.display = 'block';
    } else {
      grupo.style.display = grupo.id === `tareas-${estado}` ? 'block' : 'none';
    }
  });
}

// Guardar Tarea
function guardarTarea() {
  const nombreTarea = document.getElementById("task-name").value.trim();
  const lugarTarea = document.getElementById("task-location").value.trim();
  const descripcionTarea = document.getElementById("task-description").value.trim();
  const usuarioAsignado = document.getElementById("user-select").value;

  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

  // VALIDAR CAMPOS!
  let camposFaltantes = [];
  
  if (!nombreTarea) {
    document.getElementById("task-name").classList.add('input-error');
    camposFaltantes.push('Nombre de la tarea');
  }
  if (!lugarTarea) {
    document.getElementById("task-location").classList.add('input-error');
    camposFaltantes.push('Lugar de trabajo');
  }
  if (!descripcionTarea) {
    document.getElementById("task-description").classList.add('input-error');
    camposFaltantes.push('Descripción');
  }
  if (!usuarioAsignado) {
    document.getElementById("user-select").classList.add('input-error');
    camposFaltantes.push('Usuario asignado');
  }

  if (camposFaltantes.length > 0) {
    Swal.fire({
      title: 'Campos incompletos',
      html: `
        <div style="text-align: left;">
          <p>Por favor, completa los siguientes campos:</p>
          <ul style="list-style-type: none; padding-left: 0;">
            ${camposFaltantes.map(campo => `<li>• ${campo}</li>`).join('')}
          </ul>
        </div>
      `,
      icon: 'warning',
      confirmButtonColor: '#1E3A8A',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  const nuevaTarea = {
    nombre_tarea: nombreTarea,
    lugar: lugarTarea,
    descripcion: descripcionTarea,
    estado: "pendiente",
    asignada: usuarioAsignado,
    creador: usuarioActivo ? `${usuarioActivo.nombre} ${usuarioActivo.apellido}` : "Anónimo",
    fecha_creacion: new Date().toISOString(),
    fecha_asignacion: "",
    fecha_finalizacion: "",
    completada_por: "",
    fecha_completado: "",
    aprobada: false
  };

  limpiarFormulario();

  tareas.push(nuevaTarea);
  localStorage.setItem('tareas', JSON.stringify(tareas));
  
  const modal = document.getElementById('modal-overlay');
  modal.classList.add('hidden');
  mostrarTareas();
  actualizarNotificaciones();

  Swal.fire({
    title: '¡Tarea creada!',
    text: 'La tarea ha sido creada exitosamente',
    icon: 'success',
    confirmButtonColor: '#1E3A8A'
  });
}

function editarTarea(indice) {
  const tarea = tareas[indice];
  
  saveTaskButton.removeEventListener('click', guardarTarea);
  
  renderizarUsuarios();
  
  document.getElementById("task-name").value = tarea.nombre_tarea;
  document.getElementById("task-location").value = tarea.lugar;
  document.getElementById("task-description").value = tarea.descripcion;
  document.getElementById("user-select").value = tarea.asignada;
  
  modalOverlay.classList.remove('hidden');
  
  const editarTareaClick = () => {
    const nombreTarea = document.getElementById("task-name").value.trim();
    const lugarTarea = document.getElementById("task-location").value.trim();
    const descripcionTarea = document.getElementById("task-description").value.trim();
    const usuarioAsignado = document.getElementById("user-select").value;

    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    let camposFaltantes = [];
    
    if (!nombreTarea) {
      document.getElementById("task-name").classList.add('input-error');
      camposFaltantes.push('Nombre de la tarea');
    }
    if (!lugarTarea) {
      document.getElementById("task-location").classList.add('input-error');
      camposFaltantes.push('Lugar de trabajo');
    }
    if (!descripcionTarea) {
      document.getElementById("task-description").classList.add('input-error');
      camposFaltantes.push('Descripción');
    }
    if (!usuarioAsignado) {
      document.getElementById("user-select").classList.add('input-error');
      camposFaltantes.push('Usuario asignado');
    }

    if (camposFaltantes.length > 0) {
      Swal.fire({
        title: 'Campos incompletos',
        html: `
          <div style="text-align: left;">
            <p>Por favor, completa los siguientes campos:</p>
            <ul style="list-style-type: none; padding-left: 0;">
              ${camposFaltantes.map(campo => `<li>• ${campo}</li>`).join('')}
            </ul>
          </div>
        `,
        icon: 'warning',
        confirmButtonColor: '#1E3A8A',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    tareas[indice] = {
      ...tarea,
      nombre_tarea: nombreTarea,
      lugar: lugarTarea,
      descripcion: descripcionTarea,
      asignada: usuarioAsignado
    };

    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarTareas();
    actualizarNotificaciones();
    modalOverlay.classList.add('hidden');
    
    limpiarFormulario();
    
    saveTaskButton.removeEventListener('click', editarTareaClick);
    saveTaskButton.addEventListener('click', guardarTarea);

    Swal.fire({
      title: '¡Tarea actualizada!',
      text: 'La tarea ha sido modificada exitosamente',
      icon: 'success',
      confirmButtonColor: '#1E3A8A'
    });
  };
  
  saveTaskButton.addEventListener('click', editarTareaClick);
}

function eliminarTarea(index) {

  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1E3A8A',
    cancelButtonColor: '#DC2626',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      tareas.splice(index, 1);
      localStorage.setItem('tareas', JSON.stringify(tareas));
      mostrarTareas();
      actualizarNotificaciones();
      
      Swal.fire({
        title: '¡Eliminada!',
        text: 'La tarea ha sido eliminada correctamente',
        icon: 'success',
        confirmButtonColor: '#1E3A8A'
      });
    }
  });
}

function completarTarea(index) {
  const tarea = tareas[index];
  
  if (!tarea) return;
  
  if (tarea.estado === 'pendiente') {
    tarea.estado = 'completada';
    tarea.completada_por = `${usuarioActivo.nombre} ${usuarioActivo.apellido}`;
    tarea.fecha_completado = new Date().toISOString();
    
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarTareas();
    actualizarNotificaciones();
  }
}

function aprobarTarea(index) {
  const tarea = tareas[index];
  tarea.aprobada = true;
  tarea.fecha_finalizacion = new Date().toISOString();
  
  localStorage.setItem('tareas', JSON.stringify(tareas));
  mostrarTareas();
  actualizarNotificaciones();
}

function rechazarTarea(index) {
  const tarea = tareas[index];
  tarea.estado = 'pendiente';
  tarea.completada_por = "";
  tarea.fecha_completado = "";
  tarea.aprobada = false;
  tarea.fecha_finalizacion = "";
  
  localStorage.setItem('tareas', JSON.stringify(tareas));
  mostrarTareas();
  actualizarNotificaciones();
}

function renderizarUsuarios() {
  const selectElement = document.getElementById("user-select");
  selectElement.innerHTML = '<option value="">Seleccionar usuario...</option>';

  const usuariosColaboradores = usuarios.filter(usuario => usuario.cargo !== "supervisor");
  usuariosColaboradores.forEach(usuario => {
    const option = document.createElement("option");
    option.value = `${usuario.nombre} ${usuario.apellido}`;
    option.textContent = `${usuario.nombre} ${usuario.apellido}`;
    selectElement.appendChild(option);
  });
}

// Inicialización
document.getElementById('tareas-link').addEventListener('click', (e) => {
  e.preventDefault();
  mostrarTareas();
});

document.getElementById('empleados-link').addEventListener('click', (e) => {
  e.preventDefault();
  mostrarEmpleados();
});

// Event listeners para el formulario y botones
saveTaskButton.addEventListener('click', guardarTarea);
newTaskButton.addEventListener('click', () => {
  modalOverlay.classList.remove('hidden');
  renderizarUsuarios();
  limpiarFormulario();
});

closeModal.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
  limpiarFormulario();
});

// Event listener para el botón de borrar datos
clearDataButton.addEventListener('click', borrarDatos);

cargarUsuarios();

// Mostrar usuarios
function mostrarEmpleados() {
  actualizarMenuActivo('Empleados');
  
  document.getElementById('main-title').textContent = 'Empleados';
  document.getElementById('new-task-button').style.display = 'none';
  
  toggleContenedores('employees-container');

  const employeesContainer = document.getElementById('employees-container');
  employeesContainer.innerHTML = '';

  // Para mostrar el estado de las tareas del colaborador
  usuarios.forEach(usuario => {
    const tareasEmpleado = tareas.filter(tarea => 
      tarea.asignada === `${usuario.nombre} ${usuario.apellido}`
    );
    
    const tareasPendientes = tareasEmpleado.filter(tarea => tarea.estado === 'pendiente').length;
    const tareasCompletadas = tareasEmpleado.filter(tarea => 
      tarea.estado === 'completada' && !tarea.aprobada
    ).length;
    const tareasCerradas = tareasEmpleado.filter(tarea => tarea.aprobada).length;
    
    const isOcupado = tareasPendientes > 0;
    
    const employeeCard = document.createElement('div');
    employeeCard.className = 'employee-card';
    employeeCard.innerHTML = `
      <div class="employee-info">
        <img src="${usuario.foto}" alt="${usuario.nombre} ${usuario.apellido}" class="employee-avatar">
        <div class="employee-details">
          <h3 class="employee-name">${usuario.nombre} ${usuario.apellido}</h3>
          <p class="employee-role">${usuario.cargo}</p>
          <div class="employee-stats">
            <div class="stat-item">
              <span class="stat-value">${tareasEmpleado.length}</span>
              <span class="stat-label">Tareas Asignadas</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${tareasCompletadas}</span>
              <span class="stat-label">Tareas Completadas</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${tareasCerradas}</span>
              <span class="stat-label">Tareas Aprobadas</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${tareasPendientes}</span>
              <span class="stat-label">Tareas Pendientes</span>
            </div>
          </div>
          <div class="employee-status">
            <div class="status-indicator ${isOcupado ? 'ocupado' : ''}"></div>
            <span class="status-text">${isOcupado ? 'Ocupado' : 'Disponible'}</span>
          </div>
        </div>
      </div>
    `;
    employeesContainer.appendChild(employeeCard);
  });
}

function actualizarNotificaciones() {
  const tareasLink = document.getElementById('tareas-link');
  const tareasPendientes = tareas.filter(tarea => {
    if (usuarioActivo.cargo === 'supervisor') {
      return tarea.estado === 'completada' && !tarea.aprobada;
    } else {
      return tarea.asignada === `${usuarioActivo.nombre} ${usuarioActivo.apellido}` && 
             tarea.estado === 'pendiente';
    }
  }).length;

  // Remover notificación existente si ya hay una
  const notificacionExistente = tareasLink.querySelector('.notification-badge');
  if (notificacionExistente) {
    notificacionExistente.remove();
  }

  // Agregar nueva notificación si hay tareas pendientes
  if (tareasPendientes > 0) {
    const badge = document.createElement('span');
    badge.className = 'notification-badge';
    badge.textContent = '';
    tareasLink.appendChild(badge);
  }
}

function borrarDatos() {
  Swal.fire({
    title: '¿Estás seguro?',
    html: `
      <div style="text-align: left;">
        <p>Esta acción eliminará:</p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li>• Todas las tareas guardadas</li>
          <li>• Todo el historial de actividades</li>
          <li>• Todas las estadísticas</li>
        </ul>
        <p style="color: var(--color-red-dark); margin-top: 1rem;">
          <strong>¡ADVERTENCIA!</strong> Esta acción no se puede deshacer.
        </p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DC2626',
    cancelButtonColor: '#1E3A8A',
    confirmButtonText: 'Sí, borrar todo',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('tareas');
      tareas = [];
      
      // Actualizar la interfaz
      mostrarTareas();
      actualizarNotificaciones();
      
      Swal.fire({
        title: '¡Datos eliminados!',
        text: 'Todos los datos han sido eliminados correctamente',
        icon: 'success',
        confirmButtonColor: '#1E3A8A'
      });
    }
  });
}