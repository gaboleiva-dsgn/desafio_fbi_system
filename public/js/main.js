// Evento Submit en el boton del Formulario
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
  
      const response = await fetch('http://localhost:3000/SingIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      console.log("Valor de Response devuelto desde fetch GET /SingIn : ", response);
      const data = await response.json();
      //console.log("Valor de data extraido del response del fetch GET /SingIn : ", data);
  
      // Validacion en base a propiedad ok del response true/200 o false/401
      if (response.ok) {
  
        // almacenando o ingresando el token al LS  
        //console.log("Valor data.token = ", data.token);
  
        sessionStorage.setItem('jwtToken', data.token);
        
        alert('Acceso generado y guardado con exito '+ response.statusText);
        // Instertamos un html 
        document.getElementById('message').innerHTML = `
        <h1> Bienvenido ${email} </h1>
        <a id="ingresoRestringido" href="/restringida?token=${data.token}"> <p> Ir a la sección restringida </p></a>
            <script>
                sessionStorage.setItem('token', '${data.token}')
            </script>
        `;
        
  
      } else {
  
        // mensaje si Credenciales Invalidas
        alert("Error: "+response.status+" Autenticacion : " + data.message); 
  
      }
  
    } catch (error) {
      console.error('Error:', error);
    }
    
  });
  
  // Evento Click en el boton de Ruta Protegida
  document.getElementById('ingresoRestringido').addEventListener('click', async () => {
    // obeteniendo o sacando el token del LS, aqui la utilidad de tener el Token persistiendo    
    const token = sessionStorage.getItem('jwtToken');
  
    if (!token) {
      alert('No hay token disponible, debes loguearte por favor');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/restringida', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` //pasando el token requerido que esta en LS
        }
      });
  
      console.log("Valor Response devuelto desde fetch GET /restringida : ", response);
      
      // Validacion en base a propiedad ok del response true/200 o false/401
      if (response.ok) {
        const data = await response.json();
        console.log("data extraida del response del fetch GET /restringida : ", data);
        alert("Usuario "+data.user.username+": "+data.message);
      } else {
  
          switch (response.status) {
            case 403:
              alert("Error "+response.status+' Acceso Denegado falla en el Token' );
              break;
            case 404:
              alert('Error '+response.status+" "+ response.url+'  Ruta no encontrada' );
              break;  
          
            default:
              alert("Error Falla en el Token");
              break;
          }
        
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  