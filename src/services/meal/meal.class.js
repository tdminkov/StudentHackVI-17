/* eslint-disable no-unused-vars */
const mongo = require("mongodb").MongoClient
const shortid = require("human-readable-ids").hri;
const errors = require('@feathersjs/errors')
const twilio = require('twilio');

// Mongo DB credentials
const uri = "mongodb://Admin:Admin@ds161939.mlab.com:61939/studenthack"

// Twilio credentials
const accountSid = 'AC37c9f423354374cad17b570325035cd0';
const authToken = '1bf04771502f0e9d2df1da5b54ce2f96';
let from_number = '+441509323478';

const tableFromUID = (uid, mealName) => {
  return new Promise((resolve, reject) => {
    let fedTable;
    mongo.connect(uri, function (err, db) {
      if (err) {
        reject(err)
      }

      db.collection("meals").findOne({
        mealName: mealName
      }, {}, (error, result) => {
        if (error) {
          reject(error)
        } else {
          console.log(result)
          fedTable = result.invited_tables.find((element) => {
            return element.UID === uid && !result.served_tables.map(elem => elem.UID).includes(uid)
          })

          db.close()
          resolve(fedTable)
        }
      })
    })
  })
}

const tablesToInvite = (mealName) => {
  return new Promise((resolve, reject) => {
    let invitedTables;
    let allTables;

    mongo.connect(uri, function (err, db) {
      if (err) {
        reject(err)
      }

      db.collection("tables").find().toArray((error, result) => {
        if (error) {
          reject(error)
        } else {
          allTables = result;
        }
      })

      db.collection("meals").findOne({
        mealName: mealName
      }, {
        invited_tables: 1,
        _id: 0
      }, (error, result) => {
        if (error) {
          reject(error)
        } else {
          invitedTables = result.invited_tables;
        }
        db.close();
        const returnable = Array.from(allTables.filter(x => !invitedTables.map(elem => elem.tableNo).includes(x.tableNo))).slice(0, 2)
        resolve(returnable)
      })
    })
  })
}

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
          db.close()
          if (error) {
            reject(error)
          } else {
            resolve("Great Success!")
          }
        })
      })
    })
  }

  update(mealId, data, params) {
    //params mode=invite or feed
    return new Promise((resolve, reject) => {
      mongo.connect(uri, async function (err, db) {
        if (err) {
          reject(err)
        }
        let mode = params.query.mode;
        if (mode == "invite") {
          // find 2 tables to invite
          const servedTable = tablesToInvite(data.mealName).then(names => {
            const invitedTables = names.map(elem => {
              return {
                tableNo: elem.tableNo,
                phones: elem.Phones,
                UID: shortid.random()
              }
            })

            // update database
            db.collection("meals").update({
                mealName: data.mealName
              }, {
                $push: {
                  invited_tables: {
                    $each: invitedTables.map(elem => {
                      return {
                        tableNo: elem.tableNo,
                        UID: elem.UID
                      }
                    })
                  }
                }
              },
              function (err, document) {
                resolve("Great Success!")
                db.close()
              })

            // send text message to tables

            // require the Twilio module and create a REST client
            const client = twilio(accountSid, authToken);

            invitedTables.forEach(table => {
              table.phones.forEach(number => {
                client.messages
                  .create({
                    to: number,
                    from: from_number,
                    body: `Come to the queue to get some ${data.mealName}. Your code is: ${table.UID}`,
                  })
                  .then(message => console.log('Successful, ' + message.sid))
                  .catch(err => console.log("Error: " + err));
              })
            })
          })
        } else if (mode == "feed") {
          let uid = data.uid;
          const servedTable = tableFromUID(uid, data.mealName).then(table => {
            if (table == null) {
              reject(new errors.Forbidden("UID not found or already used"))
            } else {
              db.collection("meals").update({
                  mealName: data.mealName
                }, {
                  $push: {
                    served_tables: table
                  }
                },
                function (err, document) {
                  resolve("Great Success!")
                  db.close()
                })
            }
          })
        }
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