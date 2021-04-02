//imports
var express = require("express");
var path = require("path");
//var bodyParser = require("body-parser");
const { json } = require("body-parser");


//Attributes
const PORT = (process.env.PORT || 1607);
const BASE_API_PATH = "/api/v1";

//Start of the application
var app = express();
app.use(express.json());


//Static navigation
app.use("/", express.static(path.join(__dirname + "/public")));      // index -> main

//Recursos: air_routes, cultyraBASE, hostelries

/*#################################################    Recurso: air_routes    ################################################################*/

var r_culturaBASE = [
    {
        "district": "Andalucia",
        "year": 2019,
        "fundraising": 88.3,
        "spectator": 16.4,
        "spending-per-view": 5.4
    },
    {
        "district": "Madrid",
        "year": 2019,
        "fundraising": 134.3,
        "spectator": 20.7,
        "spending-per-view": 6.5
    }
];

app.get(BASE_API_PATH + "/culturaBASE", (req,res)=>{

    res.send(JSON.stringify(r_culturaBASE, null, 2));
});

//DELETE
app.delete(BASE_API_PATH + "/culturaBASE", (req, res) => {
    r_culturaBASE = [];
    res.sendStatus(200);
});


/*#################################################    Recurso: hostelries   ################################################################*/
var r_hostelries = [
    {
        "district"           :   "Andalucia",
        "year"              :   "2020",
        "employee_staff"    :   182681,
        "establishment_open":   17140,
        "traveler_numer"    :   6841779
    },
    {
        "district"           :   "Andalucia",
        "year"              :   "2019",
        "employee_staff"    :   435130,
        "establishment_open":   29557,
        "traveler_numer"    :   19869536
    },
    {
        "district"           :   "Catalonia",
        "year"              :   "2020",
        "employee_staff"    :   147190,
        "establishment_open":   14751,
        "traveler_numer"    :   5787656
    }

];


//Requests of ../hostelries
//GET
app.get(BASE_API_PATH + "/hostelries", (req,res) => {
    res.send(JSON.stringify(r_hostelries,null,2));
});

//POST
app.post(BASE_API_PATH + "/hostelries", (req,res) => {
    var newResource = req.body;
    console.log(`New resource added: <${JSON.stringify(newResource,null,2)}>`);
    r_hostelries.push(newResource);

    res.sendStatus(201);
});
//PUT
app.put(BASE_API_PATH + "/hostelries", (req,res) => {
    
    console.log(`Error: Use put method at collector object `);
    res.sendStatus(405);
});
//DELETE
app.delete(BASE_API_PATH + "/hostelries",(req,res) => {
    //res.send("DELETE Request Called");
    r_hostelries = [];
    res.sendStatus(200);
});

//Request per each resource -> ../Andalucia/2020
app.get(BASE_API_PATH + "/hostelries/Andalucia/2020", (req,res) => {
    ls_res = [];

    for (var i = 0 ; i < r_hostelries.length; i++){
        if(r_hostelries[i].district == "Andalucia"){
            if(r_hostelries[i].year == 2020){
                ls_res.push(r_hostelries[i]);
            }
        }
    };

    res.send(JSON.stringify(ls_res,null,2));
});

app.get(BASE_API_PATH + "/hostelries/:district/:year", (req,res) => {
    const {district} = req.params.district;
    const {year} = req.params.year;
    console.log(JSON.stringify(district,null,2));
    

});

app.post(BASE_API_PATH + "/hostelries/Andalucia/2020", (req,res) => {
    console.log(`Error: Use post method at element of collector `);
    res.sendStatus(405);
});


/*
districs_r_hostelries = [];
for (var i = 0 ; i < r_hostelries.length; i++){

    var url = BASE_API_PATH + "/hostelries";
    var firstField = r_hostelries[i].distric;

    if (!districs_r_hostelries.includes(firstField)){
        districs_r_hostelries.push(firstField);

        //create navigation
        app.get(BASE_API_PATH + "/"+ firstField, (req,res) => {
            res.send(JSON.stringify(r_hostelries[i],null,2));
        });
    }
    console.log(firstField);
    console.log(districs_r_hostelries);

}*/



//Server running

app.listen(PORT, () =>{
    console.log("Server running at port:" + PORT);
});
