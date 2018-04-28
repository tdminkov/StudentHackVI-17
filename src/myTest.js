const mongo = require("mongodb").MongoClient;

const uri = "mongodb://Admin:Admin@ds161939.mlab.com:61939/studenthack";
mongo.connect(uri, function(err, db) {

    if (err) {
        console.log(err)
    }

    /* db.collection("testCollection").insertOne(
        {   mealName: "bamam",
            invited_tables: [
            {table_no: 23, table_meal_UID: 77}, {table_no: 24, table_meal_UID: 78}], 
        served_tables: [{table_no: 23, table_meal_UID: 77}]
    }, {}, (error, result) => {
    if (error) {
        console.error(error)
    } else {
        console.log("HURAAAAY!!")
    }
    }) */

  //  db.collection("testCollection").findOne({mealName: "bamam"}, function(err, document) {
  //      console.log(document)
  //  })
    db.collection("testCollection").updateOne(
        {mealName: "bamam"},
        { $set: {
            served_tables: [{table_no: 23, table_meal_UID: 77}, {table_no: 24, table_meal_UID: 78}]}}, 
        function(err, document) {
        console.log(document)
    })
    db.close()
})