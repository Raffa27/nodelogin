//www.webdeasy.de

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require("uuid");
const taskMiddleware = require('../middleware/tasks.js');

const db = require('../lib/db.js'); 
const userMiddleware = require("../middleware/users.js");

// http://192.168.178.130:3000/api/sign-up
router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
    db.query(
      'SELECT id FROM users WHERE LOWER(username) = LOWER(?)',
      [req.body.username],
      (err, result) => {
        if (result && result.length) {
          // error
          return res.status(409).send({
            message: 'This username is already in use!',
          });
        } else {
          // username not in use
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                message: err,
              });
            } else {
              db.query(
                'INSERT INTO users (id, username, password, registered) VALUES (?, ?, ?, now());',
                [uuid.v4(), req.body.username, hash],
                (err, result) => {
                  if (err) {
                    return res.status(400).send({
                      message: err,
                    });
                  }
                  return res.status(201).send({
                    message: 'Registered!',
                  });
                }
              );
            }
          });
        }
      }
    );
  });

// http://localhost:3000/api/login wir möchten überprüfen ob der User Registriert ist und vergeben einen JWT
router.post('/login', (req, res, next) => {
    db.query(`SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`, 
    (err, result) => {
        if(err) {
            throw err;
            return res.status(400).send({
                message: err,
            });
        }
        if(!result.length) {
            return res.status(400).send({
                message: 'Username or password incorrect!',
            });
        }
        bcrypt.compare(req.body.password, result[0]['password'], (bErr, bResult) => {
            if(bErr) {
                throw bErr;
                return res.status(400).send({
                    message: 'Username or password incorrect!',
                });
            }
            if(bResult) { // Password match, dann wird der JWT vergeben
                const token = jwt.sign(
                    {
                    username: result[0].username,
                    userId: result[0].id,
                    }, 
                    "SECRETKEY",                 //process.env.SECRETKEY
                    { expiresIn: "7d" }
                );  
                db.query(
                    `UPDATE users SET last_login = now() WHERE id = ${result[0].id};`
                );
               return res.status(200).send({
                    message: 'Logged in!',
                    token,
                    user: result[0],
               });
            }
            return res.status(401).send(  {
                message: "Username or password incorrect!",
            });
        }
        
    )
    }
  )
})


// http://192.168.178.130:3000/api/secret-route
router.get('/secret-route', (req, res, next) => {
    
})

router.get('/tasks', userMiddleware.isLoggedIn, taskMiddleware.getTasks);
router.post('/tasks', userMiddleware.isLoggedIn, taskMiddleware.addTask);
router.put('/tasks/:id', userMiddleware.isLoggedIn, taskMiddleware.updateTask);
router.delete('/tasks/:id', userMiddleware.isLoggedIn, taskMiddleware.deleteTask);

module.exports = router;