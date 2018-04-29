/* eslint-disable no-unused-vars */
const mongo = require("mongodb").MongoClient;
const uri = "mongodb://Admin:Admin@ds161939.mlab.com:61939/studenthack"

const tableFromUID = (uid, mealName) => {
  return new Promise((resolve, reject) => {
    let fedTable;
    mongo.connect(uri, function (err, db) {
      if (err) {
        throw err
      }

      db.collection("meals").findOne({
        mealName: mealName
      }, {}, (error, result) => {
        if (error) {
          throw error
        } else {
          console.log(result)
          fedTable = result.invited_tables.find((element) => {
            return element.table_meal_UID === uid.table_meal_UID
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

  update(mealName, data, params) {
    //params mode=invite or feed
    return new Promise((resolve, reject) => {
        mongo.connect(uri, async function (err, db) {
            if (err) {
              reject(err)
            }
            let mode = params.query.mode;
            if (mode == "invite") {
              const servedTable = tablesToInvite(mealName).then(names => {
                  const invitedTables = names.map(elem => {return {tableNo: elem.tableNo, UID: 3}})
                  db.collection("meals").update({
                      mealName: mealName
                    }, {
                      $push: {
                        invited_tables: {
                          $each: invitedTables
                        }
                      }
                    },
                    function (err, document) {
                      resolve("Great Success!")
                      db.close()
                    })
                })
              }
              else if (mode == "feed") {
                let uid = data.feed;
                const servedTable = tableFromUID(uid, mealName).then(table => {
                  db.collection("meals").update({
                      mealName: mealName
                    }, {
                      $push: {
                        served_tables: table
                      }
                    },
                    function (err, document) {
                      resolve("Great Success!")
                      db.close()
                    })
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