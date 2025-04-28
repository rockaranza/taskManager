const taskContainer = document.getElementById("tasks-container");
const newTaskButton = document.getElementById("new-task-button");
const modalOverlay = document.getElementById("modal-overlay");
const closeModal = document.getElementById("close-modal");
const newTaskForm = document.getElementById("new-task-form");

/* USUARIOS */
const usuarios = [
  {
    nombre: "Carlos",
    apellido: "Ramírez",
    foto: "../images/Usuario1.png",
    cargo: "supervisor",
    tarea_asignada: "",
    tareas_resueltas: []
  },
  {
    nombre: "Ana",
    apellido: "Martínez",
    foto: "../images/Usuario2.png",
    cargo: "colaborador",
    tarea_asignada: "",
    tareas_resueltas: []
  },
  {
    nombre: "Luis",
    apellido: "Fernández",
    foto: "../images/Usuario3.png",
    cargo: "colaborador",
    tarea_asignada: "",
    tareas_resueltas: []
  },
  {
    nombre: "Sofía",
    apellido: "Pérez",
    foto: "../images/Usuario4.png",
    cargo: "colaborador",
    tarea_asignada: "",
    tareas_resueltas: []
  }
];

/* Listado de tareas */
const tareas = [
  // {
  //   nombre_tarea: "Limpieza de salas de clases",
  //   lugar: "Pabellón A",
  //   descripcion: "Barrido y trapeado de pisos, limpieza de pupitres y pizarras.",
  //   estado: "pendiente",
  //   asignada: "",
  //   creador: "María González",
  //   fecha_creacion: "2025-04-23",
  //   fecha_asignacion: "",
  //   fecha_finalizacion: ""
  // },
  // {
  //   nombre_tarea: "Desinfección de baños",
  //   lugar: "Sector B",
  //   descripcion: "Limpieza profunda y desinfección de sanitarios, lavamanos y espejos.",
  //   estado: "pendiente",
  //   asignada: "",
  //   creador: "Carlos Ramírez",
  //   fecha_creacion: "2025-04-23",
  //   fecha_asignacion: "",
  //   fecha_finalizacion: ""
  // },
  // {
  //   nombre_tarea: "Recolección de basura",
  //   lugar: "Patio central",
  //   descripcion: "Vaciar basureros, recoger residuos y dejar bolsas en el punto de acopio.",
  //   estado: "pendiente",
  //   asignada: "",
  //   creador: "María González",
  //   fecha_creacion: "2025-04-23",
  //   fecha_asignacion: "",
  //   fecha_finalizacion: ""
  // }
];

const tareasTerminadas = [];
const tareasEliminadas = [];

/* Mostrar tareas */
function mostrarTareas() {
  const tareasStorage = localStorage.getItem('tareas');
  let tareasParaRenderizar = [];

  if(tareasStorage) {
    tareasParaRenderizar = JSON.parse(tareasStorage);
  }

  taskContainer.innerHTML = '';

  if(tareasParaRenderizar.length > 0) {
    tareasParaRenderizar.forEach((tarea) => {
      taskContainer.innerHTML += `
        <div class="task-card">
          <div class="task-card-info">
            <h3>${tarea.nombre_tarea}</h3>
            <p>${tarea.descripcion}</p>
            <div class="status">${tarea.estado}</div>
            <div class="task-assigned">
              <span class="task-assigned-title">Asignado a:</span>
              <div class="task-assigned-user">
                ${tarea.asignada ? `
                  <span>${tarea.asignada}</span>` : `
                  <span class="task-assigned-user-empty">Sin asignar</span>
                `}
              </div>
            </div>
          </div>
          
          <div class="task-card-icons">
            <i class="fa-solid fa-pen"></i>
            <i class="fa-solid fa-trash"></i>
            <i class="fa-solid fa-eye"></i>
          </div>
        </div>
      `;
    });
  } else {
    taskContainer.innerHTML = `
    <h2>No hay tareas disponibles</h2>
    <p>Agrega una nueva tarea haciendo clic en el botón "Nueva Tarea".</p>
    `;
  }
}

/* Guardar Tarea */
function guardarTarea(event) {
  event.preventDefault(); // Evitar reinicio de la pagin
  const nombreTarea = document.getElementById("task-name").value;
  const lugarTarea = document.getElementById("task-location").value;
  const descripcionTarea = document.getElementById("task-description").value;
  const usuarioAsignado = document.getElementById("user-select").value;


  const nuevaTarea = {
    nombre_tarea: nombreTarea,
    lugar: lugarTarea,
    descripcion: descripcionTarea,
    estado: "pendiente",
    asignada: usuarioAsignado,
    creador: "Carlos Ramírez",
    fecha_creacion: new Date().toISOString().split('T')[0], // Fecha actual
    fecha_asignacion: "",
    fecha_finalizacion: ""
  };

  document.getElementById("task-name").value = "";
  document.getElementById("task-location").value = "";
  document.getElementById("task-description").value = "";

  tareas.push(nuevaTarea);
  tareasString = JSON.stringify(tareas);
  localStorage.setItem('tareas', tareasString);
  mostrarTareas();
  modalOverlay.classList.add('hidden');
}

function renderizarUsuarios() {
  const selectElement = document.getElementById("user-select");

  selectElement.innerHTML = '<option value=" ">Seleccionar usuario...</option>';

  // Me quedo solo con los usuarios colaboradores
  const usuariosColaboradores = usuarios.filter(usuario => usuario.cargo !== "supervisor");

  // Recorro el array para rendirizarlos
  usuariosColaboradores.forEach(usuario => {
    const option = document.createElement("option");
    option.value = `${usuario.nombre} ${usuario.apellido}`;
    option.textContent = `${usuario.nombre} ${usuario.apellido}`;
    selectElement.appendChild(option);
  });
}

/* Eliminar tareas */
/* Editar tareas */
/* Asignar tareas */
/* Marcar tareas como terminadas */
/* Mostrar tareas terminadas */


newTaskForm.addEventListener('submit', guardarTarea);
/* Modal para nueva tarea */
newTaskButton.addEventListener('click', () => {
  modalOverlay.classList.remove('hidden');
  renderizarUsuarios();
}
)
/* Cerrar modal */
closeModal.addEventListener('click', () => {
  modalOverlay.classList.add('hidden'); 
})

mostrarTareas();