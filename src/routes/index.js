const {Router} = require('express');
const router = Router();
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const Request = require("request");

  function verifyToken(req, res, next){
    console.log('verifyToken');
    if(!req.headers.authorization){
      return res.status(401).send('401-Unauthorized');
    }
    console.log(req.headers.authorization.split(' ')[1]);
    //console.log('req.headers.authorization.split(" ")[1]'. req.headers.authorization.split(' ')[1]);

    const payload = jwt.verify(req.headers.authorization.split(' ')[1], 'JKey');
    console.log('payload',payload);
    req.userId =  payload._id;
    console.log(req.userId);
    next();

  }

  router.get('/',(req, res) => res.send('Home'));
                        //se agrega async para implementar metodos asincronos.
  router.post('/singup', async(req, res) => {
    // se necesitará express.json() para intepretar los datos que vienen del cuerpo de la petición.

    const { nombre, paterno, materno, usuario,email, password } = req.body;
    const newUser = new user ({ nombre, paterno, materno, email, password });

    //.save es un método asincrono, ocupo await para continuar con otros procesos en el servidor.
    await newUser.save();
    console.log('registro guardado',newUser);

    const token = jwt.sign({_id: newUser._id}, 'JKey');
    res.status(200).send({token});

  });

  router.post('/singin', async(req, res) => {
    const { usuario, password } = req.body;
    const usuariodb = await user.findOne({usuario});
    if (!usuariodb) return res.status(401).send('Usuario o contraseña erronea!');

    const token = jwt.sign({_id: usuariodb._id}, 'JKey');
    res.status(200).send({token});

  });

  router.get('/public', (req, res) =>{

    Request.get("https://rickandmortyapi.com/api", (error, response, body) => {
      if(error) {
          return console.dir(error);
      }
      console.dir(JSON.parse(body));
      res.status(200).send(JSON.parse(body));

    })

  });

  router.get('/private', verifyToken, (req, res) =>{

    Request.get("https://rickandmortyapi.com/api/character", (error, response, body) => {
      if(error) {
          return console.dir(error);
      }
      const {results} = JSON.parse(body);
      //console.dir(JSON.parse(body));
      res.status(200).send(results);

    })

  });


module.exports = router;
