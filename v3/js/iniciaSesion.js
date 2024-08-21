/*
    Funcionalidades para el manejo de formularios de login y registro. Incluye:
    - Cambio entre vistas de login y registro.
    - Validación de longitud de campos de entrada.
    - Eliminación de cookies existentes.
    - Envío de datos de login y registro a la API.
    - Manejo de respuestas de la API y actualización de la interfaz de usuario basada en el estado de las cookies.
*/

function switchToRegister() {
    console.log('SwitchToRegister');
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.register-container').style.display = 'block';
}

function switchToLogin() {
    document.querySelector('.register-container').style.display = 'none';
    document.querySelector('.login-container').style.display = 'block';
}

function validateLength(inputId, minLength, errorId, errorMessage) {
    document.getElementById(inputId).addEventListener('input', function() {
        var inputValue = this.value;
        var errorElement = document.getElementById(errorId);
        
        if (inputValue.length >= minLength) {
            errorElement.textContent = ''; // Si es válido, borra el mensaje de error
        } else {
            errorElement.textContent = errorMessage; // Muestra el mensaje de error
        }
    });
}

// Aplicar la función a los campos específicos
validateLength('password', 10, 'password-error', 'La contraseña debe tener al menos 10 caracteres');
validateLength('email', 5, 'gmail-error', 'El correo debe tener al menos 5 caracteres');
validateLength('new-password', 10, 'n-password-error', 'La contraseña debe tener al menos 10 caracteres');
validateLength('new-email', 5, 'n-gmail-error', 'El correo debe tener al menos 5,@..,.2');
validateLength('new-username', 10, 'name-error', 'El Usuario debe tener al menos 10 caracteres');



const cookies = document.cookie
    .split(';')
    .map(ck => ck.trim().split('=')[0].concat('=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'))
cookies.forEach(ck => {
    document.cookie = ck
})

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    console.log("adentro de login");

    const correo = document.getElementById('email').value
    const password = document.getElementById('password').value

    const datosPeticion = { correo, password };

    try {
        const res = await fetch('http://localhost:3000/usuarios/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });

        const result = await res.json()
        console.log(result);
        console.log('hola err2');
        if (res.ok) {
            alert('Inicio de sesion exitoso')
            document.cookie = `idUsuario=${result.data[0].id}; path=/`
            document.cookie = `nombre=${result.data[0].nombre}; path=/`
            document.cookie = `tipoUsuario=${result.data[0].tipousuario}; path=/`
            window.location.assign("../index.html")
        } else {
            alert(`Error: ${result.error}`)
        }
    } catch (err) {
        //alert(`Error: ${err.message}`)
        alert(`Error: Datos invalidos`)
        console.log('hola err');
    }
})
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault()

    const nombre = document.getElementById('new-username').value
    const correo = document.getElementById('new-email').value
    const password = document.getElementById('new-password').value
    const tipoUsuario = document.getElementById('admin-user').checked ? 'administrador' : 'normal'

    // validaciones
    const emailRegex = /^[a-zA-Z0-9_-]{5,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const minLargoRegex = /^.{10,}$/;
    //const numerosRegex = /^[0-9]+$/;

    try {

        if (!emailRegex.test(correo)) {
            throw new Error('Correo con caracteres no validos, ingrese un correo como: "cuenta@correo.com".');
        }
        if (!minLargoRegex.test(nombre)) {
            throw new Error('Caracteres insuficientes para el nombre.');
        }
        if (!minLargoRegex.test(password)) {
            throw new Error('Caracteres insuficientes para la contraseña.');
        }

        const datosPeticion = { nombre , correo, password, tipoUsuario };
        const res = await fetch('http://localhost:3000/usuarios/sign-up/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });

        const result = await res.json();
        if (res.ok) {
            alert('Registro exitoso')
            window.location.assign("../html/inicia_sesion.html")
        } else {
            alert(`Error: Datos invalidos o campos vacios`)
        }
    } catch (err) {
         alert(`Error: ${err.message}`)
         //alert(`Error: Datos invalidos o campos vacios`)
    }
})

if (document.cookie) {
    document.getElementById('to-mis-cursos').innerHTML = '<a href="./html/3_login.html">Mis Cursos</a>'

    if (document.cookie.split(';')[2].trim().split('=')[1] === 'administrador') {
        document.getElementById('nombre-admin').innerHTML =
            `<a href="./html/5.html">${document.cookie.split(';')[1].trim().split('=')[1]}</a>`
    }

    document.getElementById('inicio-sesion-btn').style.display = 'none'
    document.getElementById('signup-sesion-btn').innerHTML = 'Cerrar Sesión'
}
else {
    document.getElementById('to-mis-cursos').style.display = 'none'
}