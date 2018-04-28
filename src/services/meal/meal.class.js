/* eslint-disable no-unused-vars */
const mongo = require("mongodb").MongoClient;
const uri = "mongodb://Admin:Admin@ds161939.mlab.com:61939/studenthack";


class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    return new Promise((resolve, reject) => {
      mongo.connect(uri, function (err, db) {
        if (err) {
          reject(err)
        }
        db.collection("meals").find().toArray((error, result) => {
          if (error) {
            reject(error)
          } else {
            console.log(result)
            resolve(result)
          }
        })
        db.close()
      })
    })
  }

  get(mealName, params) {
    return new Promise((resolve, reject) => {
      mongo.connect(uri, function (err, db) {
        if (err) {
          reject(err)
        }
        db.collection("meals").findOne({
          mealName: mealName
        }, (error, result) => {
          if (error) {
            reject(error)
          } else {
            console.log(result)
            resolve(result)
          }
        })
        db.close()
      })
    })
  }

  create(data, params) {
    //{mealName: name}
    return new Promise((resolve, reject) => {
      mongo.connect(uri, function (err, db) {

        if (err) {
          reject(err)
        }
        db.collection("meals").insertOne({
          mealName: data.mealName,
          invited_tables: [],
          served_tables: []
        }, {}, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
        db.close()
      })
    })
  }

  update(mealName, data, params) {
    //params mode=invite or feed

    return new Promise((resolve, reject) => {


      mongo.connect(uri, function (err, db) {

        if (err) {
          reject(err)
        }

        let mode = params.query.mode;
        if (mode == "invite") {

          let newTables = data.new_tables;
          db.collection("meals").update({
              mealName: mealName
            }, {
              $push: {
                invited_tables: { $each: newTables }
              }
            },
            function (err, document) {
              resolve()
            })
          
          }
          else if (mode == "feed") {
            let newTable = data.feed;
            db.collection("meals").update({
                mealName: mealName
              }, {
                $push: {
                  served_tables: newTable
                }
              },
              function (err, document) {
                resolve()
              })
          }
          db.close()
      })
    })
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({
      id
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;