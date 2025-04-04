const usuario = {
  nombre: "Juan",
  apellido: "Pérez",
  tarea: null,
  iniciada: null,
  finalizada: null,
  tareasTerminadas: [],
};

/* Listado de tareas que el usuario puede seleccionar */
const tareas = ["Tarea 1", "Tarea 2", "Tarea 3", "Tarea 4", "Tarea 5"];
const tareasTerminadas = [];


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
function tomarTarea() {
  if(usuario.tarea !== null) { // Comprueba que no exista una tarea asignada sin terminar.
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
function iniciarTarea() {
  if (usuario.tarea == null) {
    alert("Primero selecciona una tarea.");
  } else if (usuario.iniciada == null) {
    usuario.iniciada = new Date(); // Capturo la fecha del sistema para conocer cuando comenzo la tarea.
    alert("Tarea iniciada: " + usuario.tarea);
    console.log(usuario.iniciada);
  } else {
    alert("Ya comenzó una tarea");
  }
}

/* Finalizar Tarea */
function finalizarTarea() {
  if (usuario.iniciada == null) {
    alert("No hay tarea iniciada");
  } else {
    usuario.finalizada = new Date();
    usuario.tareasTerminadas.push(usuario.tarea + " || Iniciada: " + usuario.iniciada + " || Finalizada: " + usuario.finalizada);
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

/* Menu de usuario */
function menuUsuario() {
  let controlMenu = true;
  do {
    let menu = prompt(`
      Bienvenido. Seleccione una opcion:
      1. Tomar tarea
      2. Iniciar tarea
      3. Finalizar tarea
      4. Ver tareas disponibles
      5. Salir
      `);

    switch (menu) {
      case "1":
        tomarTarea();
        break;
      case "2":
        iniciarTarea();
        break;
      case "3":
        finalizarTarea();
        break;
      case "4":
        monstrarTareasDisponibles();
        break;
      case "5":
        controlMenu = false;
        alert("Saliendo...");
        break;
      default:
        alert("Opcion no valida");
    }
  } while (controlMenu);
}

menuUsuario();