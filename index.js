//imports
var express = require("express");
var path = require("path");
var Datastore = require('nedb');

const { json } = require("body-parser");




//Attributes
const PORT = (process.env.PORT || 1607);


//Start of the application
var app = express();
app.use(express.json());

var dbAir_Routes = new Datastore();
var dbCulturaBASE = new Datastore();
var dbHostelries = new Datastore();

//Static navigation
app.use("/", express.static(path.join(__dirname + "/public"))); 



/*#################################################    Resource: air_routes    ################################################################*/

//Import API
var airRoutesAPI = require('./airRoutesAPI');

airRoutesAPI.loadDB(app,dbAir_Routes);

airRoutesAPI.httpCRUD(app,dbAir_Routes);

/*#################################################    Resource: culturaBASE    ################################################################*/

//Import API
var culturaBASEAPI = require('./culturaBASEAPI');

culturaBASEAPI.loadDB(app, dbCulturaBASE);

culturaBASEAPI.httpCRUD(app,dbCulturaBASE);


/*#################################################    Resource: hostelries    ################################################################*/

//Import API
var hostelriesAPI = require('./hostelriesAPI');

//load data into DB
hostelriesAPI.loadDB(app,dbHostelries);

//CRUD
hostelriesAPI.httpCRUD(app,dbHostelries);


/*###############################################################################################################################################*/

//Runing server
app.listen(PORT, () =>{
    console.log("Server running at port:" + PORT);
});