const sendMailService = require('helper');

const processTrigger = async (msg, cfg, snapshot = {}) => {
  try {
    //const config = {host, port, secure, user, pass, from, to, subject, text} = cfg;
    console.log("iniciando envio de email...");
    console.log("Config=" + cfg);

    snapshot.lastUpdated = snapshot.lastUpdated || new Date();

      const result = await sendMailService(cfg);
      this.emit('data', result);
      snapshot.lastUpdated = new Date();
      console.log(`New snapshot: ${snapshot.lastUpdated}`);
      this.emit('snapshot', snapshot);
      this.emit('end');
  } catch (e) {
    console.log(`ERROR: ${e}`);
    this.emit('error', e);
  }
}

module.exports={process:processTrigger}