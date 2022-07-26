var nodemailer = require('nodemailer');

const express = require('express');
const { request } = require('express');

const app = express();
app.use(express.json());

var hostReq = "";
var portReq = "";
var secureReq = true;
var userReq = "";
var passReq = "";
var fromReq = "";
var toReq = "";
var subjectReq = "";
var textReq = "";

app.post('/', async(req, res)=>{
    hostReq = req.body.host;
    portReq = req.body.port;
    secureReq = req.body.secure;
    userReq = req.body.user;
    passReq = req.body.pass;
    fromReq = req.body.from;
    toReq = req.body.to;
    subjectReq = req.body.subject;
    textReq = req.body.text;
  
    try{
      const result = await sendMailService();
      console.log(result);
      res.json(result);
    }
    catch(err){
      res.status(500).json(err);
    }
  })

  app.listen(3031, ()=>{});

  async function sendMailService(){
    return new Promise(function(resolve, reject) {
      try{
        var transporter = nodemailer.createTransport({
          //Para GMail ---> host: 'smtp.gmail.com', port: 465,
          //Para Outlook ---> "host":"smtp.gmail.com", "port":465
            host: hostReq,
            port: portReq,
            secure: secureReq,
            auth: {
              user: userReq,
              pass: passReq
            },
            tls: {
              ciphers:'SSLv3'
          }
        });
        
        var mailOptions = {
          from: fromReq,
          to: toReq,
          subject: subjectReq,
          text: textReq
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            reject(error);
          } else {
            resolve({response:'Correo enviado: ' + info.response});
          }
          transporter.close();
        });
    }
    catch(err){
      reject(err);
    }
  });
}