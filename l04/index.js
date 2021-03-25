//Implementación de modulos

//cool-ascii-faces
var cool = require("cool-ascii-faces");
console.log("Test del modulo cool: " + cool());

//express -> devuelve una función constructora
var express = require("express");
var app = express();
var port = 10000;

app.get("/cool",(request, response) => {
    response.send(cool());
    console.log.apply("New request to /cool has arrived");
});

app.listen(port, () => {
    console.log("Server ready listening on port: " + port);
});