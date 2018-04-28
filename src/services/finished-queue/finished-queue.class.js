const twilio = require('twilio');

// Twilio Credentials
const accountSid = 'AC37c9f423354374cad17b570325035cd0';
const authToken = '1bf04771502f0e9d2df1da5b54ce2f96';
let from_number = '+441509323478';

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    // TODO: this needs to be the next table in the database
    let json = {
      number: 1,
      phoneNumbers: ['+447437379195', '+447375425870'],
      nextMeal: 'lunch'
    }

    // require the Twilio module and create a REST client
    const client = twilio(accountSid, authToken);

    json.phoneNumbers.forEach(number => {
      client.messages
      .create({
        to: number,
        from: from_number,
        body: `Come to the queue to get some ${json.nextMeal}`,
      })
      .then(message => console.log('Successful, ' + message.sid))
      .catch(err => console.log("Error: " + err));
    })

    return Promise.resolve([]);
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
