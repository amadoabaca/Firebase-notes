const db = firebase.firestore();

const taskform = document.getElementById('task-form');
const taskContainer = document.getElementById('tasks-container');

let editStatus = false;
let id = '';

const saveTask = (title, description) =>
    db.collection('tasks').doc().set({
        title,
        description
    });

// funcion que treae de firebase todas las tareas que esten en una coleccion
const getTasks = () => db.collection('tasks').get();

// funcion para actualizar las tareas cada vez que un dato cambie ejecutanco callback
const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback); 


const deleteTasks = id => db.collection('tasks').doc(id).delete();


const getTask = (id) => db.collection('tasks').doc(id).get();


const updateTask = (id, updatedTask) => 
    db.collection("tasks").doc(id).update(updatedTask);

// añade un evento a la ventana, cuando el dom cargue el content ejecuta el evento onGetTasks. guarda la respuesta en constante y actualiza aut
window.addEventListener('DOMContentLoaded',async (e) => {
    onGetTasks((querySnapshot) => {
        taskContainer.innerHTML = '';
        querySnapshot.forEach(doc => {

            const task = doc.data();
            task.id = doc.id;    

            // añade los datos en el div del html para listar las tareas
            taskContainer.innerHTML += `<div class="col-lg-3 col-md-6 col-sm-6 card-tasks">
                <div class="card card-body mt-2">
                <h3 class="h5">${task.title}</h3>
                <p>${task.description}</p>
                <div class="card-tasks__btns">
                    <button class="btn btn-edit float-right" data-id="${task.id}">Edit</button>
                    <button class="btn btn-delete float-right" data-id="${task.id}">Delete</button>
                </div>
                </div>
                </div>`;

            // seleccionas los id de los button delete y ejecuta la funcion delete especificando los id
            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    await deleteTasks(e.target.dataset.id)
                })
            });

            // edit
            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await getTask(e.target.dataset.id);
                    const task = doc.data();

                    editStatus = true;
                    id = doc.id;

                    taskform['task-title'].value = task.title;
                    taskform['task-description'].value = task.description;
                    taskform['btn-task-form'].innerText = 'Update';
                })
            })

        });
    });
});

taskform.addEventListener('submit', async (e) =>{
    e.preventDefault();

    const title = taskform['task-title'];
    const description = taskform['task-description'];

    if (!editStatus) {
        await saveTask(title.value, description.value);
    } else {
        await updateTask(id, {
            title: title.value,
            description: description.value
        });

        editStatus = false;
        id = '';
        taskform['btn-task-form'].innerText = 'Save';
    }


    taskform.reset();
    title.focus();
})

// textarea height ajustable

var textarea = document.querySelector('textarea');

textarea.addEventListener('keydown', autosize);
             
function autosize(){
  var el = this;
  setTimeout(function(){
    el.style.cssText = 'height:auto; padding:5';
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
  },0);
}