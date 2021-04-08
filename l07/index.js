var express = require("express");
var bodyParser = require("body-parser");

//Importar libreria 
var lib = require("./lib");
//Ejecutar function de lib
lib.Myhello();
//Ejecutar objeto de lib
console.log(JSON.stringify(lib.VarTesteo,null,2))

var contactAPI = require("./contactAPI");

var PORT = (process.env.PORT || 1607);


var app = express();
app.use(bodyParser.json());

contactAPI.register(app);


app.listen(PORT,()=>{
    console.log(`Server ready at ${PORT}!`);
});
