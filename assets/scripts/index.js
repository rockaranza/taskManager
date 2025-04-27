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
    cargo: "limpiador",
    tarea_asignada: "",
    tareas_resueltas: []
  },
  {
    nombre: "Luis",
    apellido: "Fernández",
    foto: "../images/Usuario3.png",
    cargo: "limpiador",
    tarea_asignada: "",
    tareas_resueltas: []
  },
  {
    nombre: "Sofía",
    apellido: "Pérez",
    foto: "../images/Usuario4.png",
    cargo: "limpiador",
    tarea_asignada: "",
    tareas_resueltas: []
  }
];

/* Listado de tareas */
const tareas = [
  {
    nombre_tarea: "Limpieza de salas de clases",
    lugar: "Pabellón A",
    descripcion: "Barrido y trapeado de pisos, limpieza de pupitres y pizarras.",
    estado: "pendiente",
    asignada: "",
    creador: "María González",
    fecha_creacion: "2025-04-23",
    fecha_asignacion: "",
    fecha_finalizacion: ""
  },
  {
    nombre_tarea: "Desinfección de baños",
    lugar: "Sector B",
    descripcion: "Limpieza profunda y desinfección de sanitarios, lavamanos y espejos.",
    estado: "pendiente",
    asignada: "",
    creador: "Carlos Ramírez",
    fecha_creacion: "2025-04-23",
    fecha_asignacion: "",
    fecha_finalizacion: ""
  },
  {
    nombre_tarea: "Recolección de basura",
    lugar: "Patio central",
    descripcion: "Vaciar basureros, recoger residuos y dejar bolsas en el punto de acopio.",
    estado: "pendiente",
    asignada: "",
    creador: "María González",
    fecha_creacion: "2025-04-23",
    fecha_asignacion: "",
    fecha_finalizacion: ""
  }
];

const tareasTerminadas = [];

/* Mostrar tareas */
function mostrarTareas() {
  taskContainer.innerHTML = ""; // Limpiar el contenedor de tareas
  tareas.forEach((tarea) => {
    const tareaDiv = document.createElement("div");
    tareaDiv.classList.add("task-card");
    tareaDiv.innerHTML = `
          <div class="task-card-info">
            <h3>${tarea.nombre_tarea}</h3>
            <p>${tarea.descripcion}</p>
            <div class="status">In Progress</div>
          </div>
          <div class="task-card-icons">
            <i class="fa-solid fa-pen"></i>
            <i class="fa-solid fa-trash"></i>
            <i class="fa-solid fa-eye"></i>
          </div>
      `;
    taskContainer.appendChild(tareaDiv);
  });
}

/* Modal para nueva tarea */
newTaskButton.addEventListener('click', () => {
  modalOverlay.classList.remove('hidden')
}
)
/* Cerrar modal */
closeModal.addEventListener('click', () => {
  modalOverlay.classList.add('hidden'); 
})

/* Guardar Tarea */
function guardarTarea(event) {
  event.preventDefault(); // Evitar reinicio de la pagin
  const nombreTarea = document.getElementById("task-name").value;
  const lugarTarea = document.getElementById("task-location").value;
  const descripcionTarea = document.getElementById("task-description").value;

  const nuevaTarea = {
    nombre_tarea: nombreTarea,
    lugar: lugarTarea,
    descripcion: descripcionTarea,
    estado: "pendiente",
    asignada: "",
    creador: "María González",
    fecha_creacion: new Date().toISOString().split('T')[0], // Fecha actual
    fecha_asignacion: "",
    fecha_finalizacion: ""
  };

  document.getElementById("task-name").value = "";
  document.getElementById("task-location").value = "";
  document.getElementById("task-description").value = "";

  tareas.push(nuevaTarea);
  mostrarTareas();
  modalOverlay.classList.add('hidden');
}
newTaskForm.addEventListener('submit', guardarTarea);



mostrarTareas();