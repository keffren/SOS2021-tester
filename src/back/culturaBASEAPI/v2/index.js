module.exports = function(app){
    var BASE_CULTURABASE_API_PATH2 = "/api/v2/culturaBASE";
    let initialData = require ('./initialData.js');

    var Datastore = require('nedb');
    const db = new Datastore();


    //####################################################    Load JSON into DB
    app.get(BASE_CULTURABASE_API_PATH2+ "/loadInitialData", (req,res)=>{
        db.remove({}, {multi:true});

        db.insert(initialData.JsonInitialData, (err,dataAdded)=>{
            if(err){
                console.error('Esto no funciona cabesita');
                res.sendStatus(500);
            }else{
                console.log('Info añadida a la DB');
                res.status(201).json({ message : `<${dataAdded.length}> Resources has been inserted into DB`});
            }

        })
    });
    
    //####################################################  HTTP CRUD
    //GET
    app.get(BASE_CULTURABASE_API_PATH2, (req,res) => {

        var dbquery = {};
        let offset = 0;
      
        let limit = Number.MAX_SAFE_INTEGER;
        var temporalSearch = false;
        

        if(req.query.offset){
            offset = parseInt(req.query.offset);
            //delete req.query.offset;
        }
        if(req.query.limit){
            limit = parseInt(req.query.limit);
            //delete req.query.limit;
        }



        //Busqueda, las querys les pasamos el valor que a priori va a ser un string

        if(req.query.district) dbquery["district"] = req.query.district;
        if(req.query.year) dbquery["year"] = req.query.year;
        //cuando estamos buscando un valor numerico al ser entero le tenemos que pasar un parseInt y sino un parseFloat
        if(req.query.fundraising) dbquery["fundraising"] = parseFloat(req.query.fundraising);
        if(req.query.spectator) dbquery["spectator"] = parseFloat(req.query.spectator);
        if(req.query.spending_per_view) dbquery["spending_per_view"] = parseFloat(req.query.spending_per_view);

        if(req.query.from && req.query.to){
            temporalSearch = true;
            dbquery["from"] = (req.query.from);
            dbquery["to"] = (req.query.to);
        }else{
            temporalSearch = false;
        } 

        
        //find the data to send
        if(temporalSearch){
            if(dbquery.from < dbquery.to){
                db.find({$and: [{year : {$gte:dbquery.from}},{year : {$lte:dbquery.to}}]},
                    (err,resources) =>{
                        if(err){
                            console.error('--HostelriesAPI:\n  ERROR : accessing DB in GET(../hostelries)');
                            res.sendStatus(500);
                        }else{
                            var resourcesToSend = resources.map( (r) =>{
                                delete r._id;   //   ==   delete r["_id"];
                                return r;
                            });
                            res
                            .status(200)
                            .json(resourcesToSend);
                        }
                    }
                )
            }
        }else{
            db.find(dbquery).sort({district:1, year: -1}).skip(offset).limit(limit).exec((err, resources) => {
                if(err){
                    console.error('No has hecho algo bien mirmano');
                    res.sendStatus(500);
                }else{
                    //res.send(JSON.stringify(resources,null,2));
                    var resourcesToSend = resources.map( (cb) =>{
                        delete cb._id;   //   Borramos el campo _id autogenerado por nedb;
                        return cb;
                    });
                    res.status(200).json(resourcesToSend);
                }
            })
        }
        
    });

    //POST

    app.post(BASE_CULTURABASE_API_PATH2, (req,res)=>{
        var newData = req.body;
        var district = req.body.district;
        var year = req.body.year; //lo tenemos pasado como string el valor, sino deberíamos usar un parseInt
        db.find({$and: [{district: newData.district}, {year: newData.year}]},

            (err, resources) =>{
                if(resources.length !=0){
                    console.log("El recurso ya existe");
                    res.sendStatus(409);
                }else if(!newData.district || !newData.year ||!newData.fundraising ||!newData.spectator || Object.keys(newData).length != 5){
                        console.log("El número de campos no es el correcto");
                        res.sendStatus(400);
                }else{
                    console.log(`--CB API:\n  new resource <${newData.district}/${newData.year}> added`)
                    db.insert(newData);
                    res.status(201).json(newData);
                }

            }
            /*(err, resourcesInDB)  =>{
                if(err){
                    console.error("Esto no va primo");
                    res.sendStatus(500);
                }else{
                    if(Object.keys(resourcesInDB).length==0){
                        console.log(`--CB API:\n  new resource <${newData.district}/${newData.year}> added`)
                        db.insert(newData);
                        res.status(201).json(newData);
                    }else{
                        res.sendStatus(409);
                    }
                }
            }*/
            );
    });

    //PUT que no funciona salta el error 405
    app.put(BASE_CULTURABASE_API_PATH2, (req,res)=>{
        console.error("No has metido el método correctamente mirmano");
        res.sendStatus(405);
    })

    //PUT bueno, recordad usar el formato JSON con el body a la hora de actualizarlo

    app.put(BASE_CULTURABASE_API_PATH2 + "/:urlDistrict/:urlYear", (req,res)=>{
        var {urlDistrict} = req.params;
        var{urlYear}=req.params;

        db.update({$and: [{district:urlDistrict}, {year:urlYear}]},

            //el set nos sirve para ver que atributos vamos a cambiar y pasarselos por el body de postman para que se actualice con los nuevos

            {$set: {fundraising: req.body.fundraising,
            spectator: req.body.spectator,
            spending_per_view: req.body.spending_per_view}},
            {}, (err, replaced)=>{
                if(err){
                    console.error(`--culturaBASE:\n  ERROR : <${err}>`)
                }else{
                    if(replaced==0){
                        res.status(404).json({message: `El recurso no existe`});
                    }else{
                        res.status(200).json(req.body);
                    }
                }
            }
            
        );
    })

    //DELETE

    app.delete(BASE_CULTURABASE_API_PATH2, (req,res)=>{
        db.remove({}, {multi:true}, (err, numRemoved)=>{
            if(err){
                console.error(`--culturaBASE:\n  ERROR : <${err}>`)
            }else{
                console.log(`--De culturaBASE:\n  <${numRemoved}> ha sido borrado`);
                res.status(200).json({ message: `<${numRemoved}> Resources has been deleted`});
            }
        })
    })

    //Request por recurso

    app.get(BASE_CULTURABASE_API_PATH2 + "/:urlDistrict", (req,res) => {

        var {urlDistrict} = req.params;        // == var urlDistrict = req.params.urlDistrict
        
        db.find({district : urlDistrict}, (err,resources) =>{
            if(err){
                console.error(`--CB:\n  ERROR : accessing DB in GET(../hostelries/${urlDistrict})`);
                res.sendStatus(500);
            }else{
                if(Object.keys(resources).length > 0){
                    var resourcesToSend = resources.map( (r) =>{
                        delete r._id;   //   ==   delete r["_id"];
                        return r;
                    });
                    res
                    .status(200)
                    .json(resourcesToSend);
                }else{
                    res
                    .status(404)
                    .send('The resource doesn´t exist.');
                }
            }
        })
    });

    app.get(BASE_CULTURABASE_API_PATH2 + "/:urlDistrict/:urlYear", (req,res) => {

        var {urlDistrict} = req.params;        // == var urlDistrict = req.params.urlDistrict
        var {urlYear} = req.params;
        
        db.find({ $and: [{district : urlDistrict}, {year : urlYear}]}, (err,resources) =>{
            if(err){
                console.error(`--CB:\n  ERROR : accessing DB in GET(../hostelries/${urlDistrict})`);
                res.sendStatus(500);
            }else{
                if(Object.keys(resources).length > 0){
                    var resourcesToSend = resources.map( (r) =>{
                        delete r._id;   //   ==   delete r["_id"];
                        return r;
                    });
                    res
                    .status(200)
                    .json(resourcesToSend[0]); //Devolverlo como objeto y no en un array
                }else{
                    res
                    .status(404)
                    .send('The resource doesn´t exist.');
                }
            }
        })
    });

    app.post(BASE_CULTURABASE_API_PATH2 + "/:urlDistrict/:urlYear", (req,res) => {
        console.error('--CB:\n  ERROR : Method not allowed');
        res.sendStatus(405);
    });

    app.delete(BASE_CULTURABASE_API_PATH2 + "/:urlDistrict", (req,res) => {
        var {urlDistrict} = req.params;

        db.remove({district: urlDistrict}, { multi: true }, (err, numRemoved) => {
            if(err){
                console.error(`--CULTURABASEAPI:\n  ERROR : <${err}>`);
            }else{
                if(numRemoved == 0){
                    res
                    .status(404)
                    .json({ message: `The collection <${urlDistrict}> doesn´t exist`});
                }else{
                    console.log(`--CULTURABASE:\n  <${numRemoved}> Resources has been deleted`);
                    res
                    .status(200)
                    .json({ message: `<${numRemoved}> Resources have been deleted`});
                }
            }
        });
    });

    app.delete(BASE_CULTURABASE_API_PATH2 + "/:urlDistrict/:urlYear", (req,res) => {
        var {urlDistrict} = req.params;
        var {urlYear} = req.params;

        db.remove({ $and: [{district: urlDistrict}, {year: urlYear}]}, {}, (err, numRemoved) => {
            if(err){
                console.error(`--CULTURABASE:\n  ERROR : <${err}>`);
            }else{
                if(numRemoved == 0){
                    res
                    .status(404)
                    .json({ message: `<${urlDistrict}/${urlYear}> doesn´t exist`});
                }else{
                    console.log(`--CULTURABASE:\n  <${urlDistrict}/${urlYear}> has been deleted`);
                    res
                    .status(200)
                    .json({ message: `<${urlDistrict}/${urlYear}> has been deleted`});
                }
            }
        });
    });






};