function hello(){
    console.log("Hola");
}

var testeo = [
    {
        "name": "pablo",
        "phone": 12345
    },
    {
        "name": "pepe",
        "phone": 6789
    }
];

exports.Myhello = hello;
exports.VarTesteo = testeo;
