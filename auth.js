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
        // Handle Errors here.
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
            aparece(user);
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
          mostrar.innerHTML = `
        
            `;
          // ...
          
        }
      });
}
observer();

function aparece(user){
    var user = user;
    var mostrar = document.getElementById("mostrar");
    if(user.emailVerified){
        mostrar.innerHTML = `
        <div class="container mt-5">
            <div class="alert alert-dark" role="alert">
                <h4 class="alert-heading">Bienvenido! ${user.email}</h4>
                <p>Ahora podés comenzar a tomar notas!</p>
                <hr>
                <a href="note.html">
                <button class="btn btn-dark mt-3 mb-3">Empezar</button>
                </a>
                <button onclick="cerrar()" class="btn btn-danger mt-3 mb-3">Cerrar Sesion</button>
            </div>
        </div>

        `;
    }
    
}

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