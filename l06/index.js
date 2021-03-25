/*
 * Modulos usados: express, body-parser
*/

var express = require("express");
var path = require("path");
var body_parser = require("body-parser");

var PORT = (process.env.PORT || 1607);
var BASE_API_PATH = "/api/v1"; //Path del recurso usuarios

var app = express();


app.use(body_parser.json());
app.use("/",express.static(path.join(__dirname + "/public")));   //Ruta estática

//Recurso: usuarios
var contacts = [
    {
        "name" : "Mateo",
        "phone": 618096294
    },
    {
        "name" : "Andres",
        "phone": 618096291
    },

];

//GET ../api/v1/contacts

//app.get(path.join(__dirname + BASE_API_PATH + "/contacts"), (req, res) => {
app.get(BASE_API_PATH + "/contacts", (req, res) => {

    res.send(JSON.stringify(contacts,null,2));   //JSON.stringify(objeto,callback para proc, json tuneado)
});

//POST ../api/v1/contacts
//Para hacer uso del post se utilizará la herramienta POSTMAN
app.post(BASE_API_PATH + "/contacts", (req, res) => {

    var newContact = req.body; //body-parser : req.body: json -> objeto
    console.log(`New contact added: <${JSON.stringify(newContact,null,2)}>`);
    contacts.push(newContact); //añado dato obtenido por el post a la colección contacts

    res.sendStatus(201);
});







app.listen(PORT, () =>{
    console.log("Server running at port: " + PORT);
});
