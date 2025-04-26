const taskContainer = document.getElementById("tasks-container");
const newTaskButton = document.getElementById("new-task-button");

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
function mostrarModal() {
}

/* Seleccionar tarea */
function seleccionarTarea() {
  let mensaje = "Selecciona una tarea:\n";
  tareas.forEach((tarea, index) => { // Recorremos el array para armar el menu que se mostrará al usuarip
    mensaje += `${index + 1}. ${tarea}\n`;
  });

  let seleccion = prompt(mensaje);
  let indice = parseInt(seleccion) - 1; /* Pasar de string a entero, restando 1 para tomar el indice correcto de la tarea */
  let tareaSeleccionada;

  /* Comprueba si la seleccion es correcta */
  if (indice >= 0 && indice < tareas.length) {
    tareaSeleccionada = tareas[indice];
    tareas.splice(indice, 1); // Eliminamos la tarea del array
    console.log("Tarea seleccionada: " + tareaSeleccionada);
    console.log(tareas);
  } else {
    tareaSeleccionada = null;
  }
  
  return tareaSeleccionada;
}

/* Tomar una tarea */
function tomarTarea(usuario) {
  if(usuario.tarea !== null) {
    alert(usuario.nombre + ", ya tienes una tarea asignada. Finalizala antes de volver a tomar una nueva.");
  } else {
    let asignarTarea = seleccionarTarea();
    if(asignarTarea) {
      usuario.tarea = asignarTarea;
      console.log("Tarea asignada");
      alert("Tarea seleccionada: " + usuario.tarea);
    } else {
      alert("La selección no es válida");
    }
  }
}

/* Iniciar Tarea */
function iniciarTarea(usuario) {
  if (usuario.tarea == null) {
    alert("Primero selecciona una tarea.");
  } else if (usuario.iniciada == null) {
    usuario.iniciada = new Date();
    alert("Tarea iniciada: " + usuario.tarea);
    console.log(usuario.iniciada);
  } else {
    alert("Ya comenzó una tarea");
  }
}

/* Finalizar Tarea */
function finalizarTarea(usuario) {
  if (usuario.iniciada == null) {
    alert("No hay tarea iniciada");
  } else {
    usuario.finalizada = new Date();
    usuario.tareasTerminadas.push(
      usuario.tarea + " || Iniciada: " + usuario.iniciada + " || Finalizada: " + usuario.finalizada
    );
    console.log(usuario.tareasTerminadas);
    alert("Tarea finalizada: " + usuario.tarea);
    usuario.tarea = null;
    usuario.iniciada = null;
    usuario.finalizada = null;
  }
}

/* Mostrar tareas disponibles */
function monstrarTareasDisponibles() {
  if(tareas.lenght == 0) {
    alert("No hay tareas disponibles");
  } else {
    let mensaje = "Tareas disponibles:\n";
    // Recorre el array para mostrar las tareas que hay disponibles
    tareas.forEach((tarea, index) => { 
      mensaje += `${index + 1}. ${tarea}\n`;
    });
    alert(mensaje);
    console.log("Tareas disponible: " + tareas);
  }
}

mostrarTareas();