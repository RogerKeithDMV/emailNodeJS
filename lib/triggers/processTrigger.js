var nodemailer = require('nodemailer');

const log = require('../../helpers/logger');
const rabbitmq = require('rabbitmqcg-nxg-oih');

const ERROR_PROPERTY = 'Error missing property';

module.exports.process = async function processTrigger(msg, cfg, snapshot = {}){
    try {

        log.info("Inside processTrigger()");
        log.info("Msg=" + JSON.stringify(msg));
        log.info("Config=" + JSON.stringify(cfg));
        log.info("Snapshot=" + JSON.stringify(snapshot));

        let properties = {
          host: null,
          port: null,
          secure: null,
          user: null,
          pass: null,
          from: null,
          to: null,
          subject: null,
          text: null
        };

        let{data}=msg;

        if(!data){
          this.emit('', '${ERROR_PROPERTY} data');
          throw new Error('${ERROR_PROPERTY} data');
        }

        Object.keys(properties).forEach((value) => {
          if (data.hasOwnProperty(value)) {properties[value] = data[value];} 

          else if (cfg.hasOwnProperty(value)) {properties[value] = cfg[value];} 

          else {
              log.error(`${ERROR_PROPERTY} ${value}`);
              throw new Error(`${ERROR_PROPERTY} ${value}`);
          }
        });

          log.info("host: "+properties.host);
          log.info("port: "+properties.port);
          log.info("secure: "+properties.secure);
          log.info("user: "+properties.user);
          log.info("pass: "+properties.pass);
          log.info("from: "+properties.from);
          log.info("to: "+properties.to);
          log.info("subject: "+properties.subject);
          log.info("text: "+properties.text);

          /*let _data= new Promise(function(resolve, reject) {
            try{
          let transporter = nodemailer.createTransport({
          //Para GMail ---> host: 'smtp.gmail.com', port: 465,
          //Para Outlook ---> "host":"smtp-mail.outlook.com", "port":465
            host: properties.host,
            port: properties.port,
            secure: properties.secure,
            auth: {
              user: properties.user,
              pass: properties.pass
            },
            tls: {
              ciphers:'SSLv3'
          }
        });
      
        let mailOptions = {
          from: properties.from,
          to: properties.to,
          subject: properties.subject,
          text: properties.text
        };
      
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            log.error("respuesta error: "+error);
            reject ({response:error});
          } else {
            log.info("respuesta bien: "+info.response);
            resolve ({response:'Correo enviado: ' + info.response});
          }

          transporter.close();
        });
      }
      catch(err){
        reject(err);
      }
    });*/

    let _data = await sendMailService(properties);

        

        this.emit('data', {_data});
        log.info("respuesta: ",{_data});

        this.emit('snapshot', snapshot);

        log.info('Finished email execution');
        this.emit('end');
    } catch (e) {
        log.error(`ERROR: ${e}`);
        this.emit('error', e);
        await rabbitmq.producerErrorMessage(msg.toString(), e.toString());
    }

    finally{
      //transporter.close();
      log.info('Finished email execution');
    }
};

async function sendMailService(properties){
  return new Promise(function(resolve, reject) {
    try{
      var transporter = nodemailer.createTransport({
        //Para GMail ---> host: 'smtp.gmail.com', port: 465,
        //Para Outlook ---> "host":"smtp.gmail.com", "port":465
          host: properties.host,
          port: properties.port,
          secure: properties.secure,
          auth: {
            user: properties.user,
            pass: properties.pass
          },
          tls: {
            ciphers:'SSLv3'
        }
      });
      
      var mailOptions = {
        from: properties.from,
        to: properties.to,
        subject: properties.subject,
        text: properties.text
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
