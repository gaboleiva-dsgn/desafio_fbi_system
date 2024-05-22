const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');

const leerAgentes = require('./data/agentes.js');
const agentes = leerAgentes.results;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor levantado y escuchando por el puerto ${PORT}`);
});

const secretKey = 'SuperClaveSecreta';

//middleware para recibir json
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'public', 'index.html'));
    res.sendFile(__dirname + '/index.html');
});

app.post('/SingIn', (req, res) => {
    const { email, password } = req.body;
    console.log("Valor de req.body: ", req.body);
    const secretAgent = agentes.find((a) => a.email === email && password === a.password);
  
    if (!secretAgent) {
      res.status(401).json({ message: 'No se encontró el agente con esas credenciales' });
    } else {
    const token = jwt.sign(secretAgent, secretKey, {expiresIn: '2m'}); 
    res.json({ token });
  }
  });

  app.get('/restringida',  (req, res) => {
    console.log("ingresando a la sección restringida");
    const token = req.query.token;
    if (!token) {
        res.status(401).send("No hay token, agente no esta Autorizado");
    } else {
        jwt.verify(token, secretKey, (err, data) => {
            err ? 
            res.status(403).send("Su clave secreta es inválida o ha expirado")
            : 
            res.status(200).send(`Bienvenido agente ${data.email} a la sección restringida`);
        });
    }
});