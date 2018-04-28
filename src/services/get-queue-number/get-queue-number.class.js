const mongo = require("mongodb").MongoClient;

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    const uri = "mongodb://Admin:Admin@ds161939.mlab.com:61939/studenthack";
    mongo.connect(uri, function(err, db) {

      if (err) {
        console.log(err)
      }

      db.collection("testCollection").insertOne({testVar: "sdafdsfdsafsadf"}, {}, (error, result) => {
        if (error) {
          console.error(error)
        } else {
          console.log("HURAAAAY!!")
        }
      })
      db.close();
   });
    return Promise.resolve(["first", "second"]);
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
