var express = require('express');
var router = express.Router();
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("1006345318538-06u5fqd3sur2bthaea307jtjalc33f3r.apps.googleusercontent.com");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'landingPage' });
});

router.post('/login', function(req, res, next) {

  if ('email' in req.body && 'password' in req.body) {

      req.pool.getConnection(function(error,connection){
        if(error){
          console.log("connection error")
          console.log(error);
          res.sendStatus(500);
          return;
        }

        let query = "SELECT first_name,last_name,users_email FROM users WHERE users_email = ?;";
        connection.query(query,[email],function(error, rows, fields) {
          connection.release(); // release connection
          if (error) {
            console.log("query error")
            console.log(error);
            res.sendStatus(500);
            return;
          }

          if (rows.length > 0){
            console.log('success');
            //req.session.user = row[0];
            res.sendStatus(200);
          }else{
            console.log('bad login');
            res.sendStatus(401);
          }

          });

        // if(req.body.email in users && users[req.body.email].password === req.body.password){
        //   console.log('success with password');
        //   //req.session.user = users[req.body.username];
        //   res.sendStatus(200);
        // } else {
        //   console.log('bad login with password');
        //   res.sendStatus(401);
        // }

  }else if ('token' in req.body) {

        let email =null;
        async function verify() {
          const ticket = await client.verifyIdToken({
              idToken: req.body.token,
              audience: '1006345318538-06u5fqd3sur2bthaea307jtjalc33f3r.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
              // Or, if multiple clients access the backend:
              //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
          });
          const payload = ticket.getPayload();
          const userid = payload['sub'];
          console.log(userid)
          email = payload['email'];
          // email = payload['email'];
        }
        // verify().then(function).catch(console.error);//////
        verify().then(function(){

          req.pool.getConnection(function(error,connection){
            if(error){
              console.log("connection error")
              console.log(error);
              res.sendStatus(500);
              return;
            }

            let query = "SELECT first_name,last_name,users_email FROM users WHERE users_email = ?;";
            connection.query(query,[email],function(error, rows, fields) {
              connection.release(); // release connection
              if (error) {
                console.log("query error")
                console.log(error);
                res.sendStatus(500);
                return;
              }

              if (rows.length > 0){
                console.log('success');
                //req.session.user = row[0];
                res.sendStatus(200);
              }else{
                console.log('bad login');
                res.sendStatus(401);
              }

              });
            });
          }).catch(function(){
          res.sendStatus(401);
        });

  } else {
    console.log('bad request');
    res.sendStatus(400);
  }

});


module.exports = router;
