firebase.initializeApp(firebaseConfig);

function registrar(){
    
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    console.log(email);
    console.log(password);

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(){
        verificar()
    })
    
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.code);
        console.log(error.message);
        // ...
      });
}

function iniciar(){

    var email2 = document.getElementById("email2").value;
    var password2 = document.getElementById("password2").value;

    console.log(email2);
    console.log(password2);

    firebase.auth().signInWithEmailAndPassword(email2, password2).catch(function(error) {

        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("error");
        mostrar.innerHTML = `
        <div class="container mt-5">
            <div class="alert alert-dark" role="alert">
                <h4 class="alert-heading">Error</h4>
                <hr>
                <p>El usuario o la contraseña no son correctos. Por favor intente de nuevo.</p>
            </div>
        </div>

        `;
        // ...
      });
}

function observer(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("inicio sesion")
            document.getElementById("tasks-show").style.display = "block";
            document.getElementById("dropdown").style.display = "block";
            var droptext = document.getElementById("dropdownText")
            var dropimg = document.getElementById("dropdownImg")

            if(user.displayName){
                droptext.innerHTML = `
                <p>Hi ${user.displayName}!</p>
            
            `;
            }else{
                droptext.innerHTML = `
                <p>Hi User!</p>
            
            `;
            }
                if(user.photoURL){
                    dropimg.innerHTML = `
                    <img src="${user.photoURL}" alt="Profile photo">
                    `;
                }else{
                    dropimg.innerHTML = `
                    <img src="assets/user.png" style="padding: 5px;" alt="Profile photo">
                    `;
                }


            mostrar.innerHTML = ``;
            
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
            
            console.log(user.emailVerified)
            

          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // ...
        } else {
          // User is signed out.
          console.log("no inicio sesion")
          document.getElementById("tasks-show").style.display = "none";
          document.getElementById("dropdown").style.display = "none";
         

          mostrar.innerHTML = `

          <section class="login-main" id="login-show">
          <div class="container d-flex justify-content-center">
              <div class="login-card">
                  <div class="card-content">
                      <div class="card-tit mb-5">
                          <h2>Login and start taking notes!</h2>
                      </div>
                      <form action="">
                          <input type="email" placeholder="Email" id="email2" class="form-control mb-4 log-email">
                          <input type="password" placeholder="Password" id="password2" class="form-control mb-2 log-pass">
                      </form>
                      <div class="forgot d-flex justify-content-end">
                          <a href="">Forgot password?</a>
                      </div>
                      <div class="google">
                          <button class="btn" onclick="google()" id="google"><i class="fab fa-google mr-1"></i>Sign in with Google</button>
                      </div>
                      <div class="register">
                          <p>Don´t have an account?<a href="" data-toggle="modal" data-target="#exampleModal"> Register</a></p>
                      </div>
                      <div class="btn-login">
                          <button class="btn" onclick="iniciar()">Login</button>
                      </div>
                  </div>
              </div>
          </div>
      </section>

            `;
          // ...
          
        }
      });
}
observer();



function cerrar(){
    firebase.auth().signOut()
    .then(function(){
        console.log("Saliendo...")
    })
    .catch(function(error){
        console.log(error)
    })
}

function verificar(){
    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function() {

    console.log("enviando correo")
    mostrar.innerHTML = `
        <div class="container mt-5">
            <div class="alert alert-dark" role="alert">
                <h4 class="alert-heading">Verifica tu email</h4>
                <hr>
                <p>Te enviamos un mail para que verifiques tu correo. Una vez verificado podras ingresar.</p>
            </div>
        </div>

        `;
    }).catch(function(error) {

    console.log("error correo")
});
}

function google(){
    document.getElementById("google").addEventListener("click",function(){
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(user){
            console.log("Google signin");
        }).catch(function(error){
            console.log(error);
        })
    })


}

// note

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


// dropdown
// function FunctionDropdown() {
//     document.getElementById("myDropdown").classList.toggle("show");
//   }
  
//   window.onclick = function(event) {
//     if (!event.target.matches('.dropbtn')) {
//       var dropdowns = document.getElementsByClassName("dropdown-content");
//       var i;
//       for (i = 0; i < dropdowns.length; i++) {
//         var openDropdown = dropdowns[i];
//         if (openDropdown.classList.contains('show')) {
//           openDropdown.classList.remove('show');
//         }
//       }
//     }
//   }