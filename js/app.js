//Campos de formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');
let editando;

class Citas {
    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita =>  cita.id !== id);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita ) //Si cita.id ==== citaActualizada.id es true, actualizamos cita, caso contrario devolvemos objeto original de cita

    }

}

class UI{ 
    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //Agregar clase en base al tipo de error

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')
        } else{
            divMensaje.classList.add('alert-success')
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //Quitar la alerta despues de 5 segundos
        setTimeout( () =>{
            divMensaje.remove()
        }, 5000)

    }

    imprimirCitas({citas}){ //mandamos a llamar el constructor this.citas con los datos  forma abreviada de { citas: citas }

        this.limpiarHTML();

        citas.forEach( cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            //scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;


            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
            <span class = "font-weight-bolder">Propietario: </span> ${propietario}
            `

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class = "font-weight-bolder">Telefono: </span> ${telefono}
            `

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class = "font-weight-bolder">Fecha: </span> ${fecha}
            `

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class = "font-weight-bolder">Hora: </span> ${hora}
            `

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
            <span class = "font-weight-bolder">Sintomas: </span> ${sintomas}
            `

            //Boton para eliminar esta cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = `Eliminar <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"             aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
            </svg>`   
            btnEliminar.onclick = () => eliminarCita(id);  
            
            //Añade un boton para eliminar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = `Editar <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"></path>
            </svg>` 
            btnEditar.onclick = () => cargarEdicion(cita);           

            //agrega los parrafos al divCitas.
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //agregar las citas al html
            contenedorCitas.appendChild(divCita);
        })
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

//Instancias
const ui = new UI();
const administrarCitas = new Citas(); 

//Registrar Eventos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita ); 
}
//Objetos con la informacion de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

//Agrega datos al objeto de cita
function datosCita(e){
    //En esta linea ingresamos al objeto y a la propiedad que tiene el mismo nombre que e.target.name
    citaObj[e.target.name] = e.target.value;

}

// Valida y agrega una nueva cita a la clase de citas

function nuevaCita(e){
    e.preventDefault();

    //Extraer la informacion del objeto de cita
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    //validar
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos so obligatorios', 'error')
        return
    }

    if(editando){
        ui.imprimirAlerta('Editado Correctamente');
        //Pasar al objeto de la clase a edicion
        administrarCitas.editarCita({...citaObj})

        //Regresar el texto del boton a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        //Quitando modo edicion
        editando = false;
      
    } else{
        //generar un id unico dentro del objeto citaObj
        citaObj.id = Date.now();

        //Creando una nueva cita {...citaObj} es la desestructuracion para crear una copa del objeto citasObj, no editamos directamente citasObj y cada cita en el array es un objeto independiente
        administrarCitas.agregarCita({...citaObj});

        //Mensaje de agregado correctamente
        ui.imprimirAlerta('Se agrego correctamente');
    }

 

    //Reiniciar el objeto para la validacion
    reiniciarObjeto();

    //reinciar formulario
    formulario.reset();

    //Mostrar HTML de las citas
    //ui.imprimirCitas(administrarCitas.citas);  
    ui.imprimirCitas(administrarCitas);
   
}

function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id){
    //Eliminar la cita
    administrarCitas.eliminarCita(id);

    //Muestre un mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente')

    //Refrescar las citas
    ui.imprimirCitas(administrarCitas)
}
//Carga los datos y el modo edicion
function cargarEdicion(cita) {
   //Extraer la informacion del objeto de cita
   const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    //Llenar los inputs

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;



    //Cambiar el text del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    editando = true;
}