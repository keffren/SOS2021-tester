var BASE_AIR_ROUTES_API_PATH = "/api/v1/air_routes";

module.exports.loadDB = (app, db) => {
    let initData = require ('./initialData');
    
    app.get(BASE_AIR_ROUTES_API_PATH + "/loadInitialData", (req,res) => {

        //In case there are resources
        db.remove({},{ multi: true });

        db.insert(initData, (err, dataAdded) => {
            if(err){
                console.error('--airRoutesAPI:\n  ERROR : the data hasn´t inserted into DataBase!');
                res.sendStatus(500);
            }else{
                console.log('--airRoutesAPI:\n  Data inserted into DataBase')
                res
                .status(201)
                .json({ message : `<${dataAdded.length}> Resources has been inserted into DB`});
            }
        })
    });
};

module.exports.httpCRUD = (app, db) => {

    //####################################################    Requests of ../airRoutes
    //GET
    app.get(BASE_AIR_ROUTES_API_PATH, (req,res) => {

        var reqQuery = {};   //Save queries and data

        //paginacion
        //  - offset: a partir de que numero de elementos quiero ver
        //  - limit: numero de recursos que quiero ver
        let offset = 0;
        let limit = Number.MAX_SAFE_INTEGER;
		
        if (req.query.offset) {
            offset = parseInt(req.query.offset);
            delete req.query.offset;
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
            delete req.query.limit;
        }

        //busqueda
        if(req.query.district){
            reqQuery["district"] = req.query.district;
        }
        if(req.query.year){
            reqQuery["year"] = req.query.year;
        }
        if(req.query.flight){
            reqQuery["flight"] = parseInt(req.query.flight);
        }
        if(req.query.passenger){
            reqQuery["passenger"] = parseInt(req.query.passenger);
        }
        if(req.query.merchandise){
            reqQuery["merchandise"] = parseInt(req.query.merchandise);
        }

        //console.log(reqQuery);
        /*Sobre sort-> Te ordena los resultados por {}
            si el elemento es :1 es ascendentemente (alfabeticamente)
            si el elemento es :-1 es descendentemente (al reves)
        Sobre skip-> Similar al offset (docs que se salta para empezar a mostrarte)
        Sobre limit-> Como el limit de arriba. Docs a mostrar
        Sobre exec-> Manera alternativa al clasico callback de Pablo
        */
       
        db.find(reqQuery).sort({district:1,year:-1}).skip(offset).limit(limit).exec((err,resources) => {
            if(err){
                console.error('--airRoutesAPI:\n  ERROR : accessing DB in GET(../air_routes)');
                res.sendStatus(500);
            }else{
                //res.send(JSON.stringify(resources,null,2));
                var resourcesToSend = resources.map( (r) =>{
                    delete r._id;  
                    return r;
                    //Mejor que filtrar los 5 elementos (mucho espacio)
                });
                res
                .status(200)
                .json(resourcesToSend);
            }
        })
    });

    //POST
    app.post(BASE_AIR_ROUTES_API_PATH, (req,res) => {
        var newResource = req.body;
        //check if the resource to add exists
        db.find({ $and: [{district : newResource.district}, {year : newResource.year}]},
            (err, resourcesInDB) =>{
                if(err){
                    console.error('--airRoutesAPI:\n  ERROR : accessing DB in POST');
                    res.sendStatus(500);
                }else{
                    if(Object.keys(resourcesInDB).length == 0){

                        if(!newResource.district || !newResource.year ||!newResource.flight || !newResource.passenger
                                || !newResource.merchandise || Object.keys(newResource).length != 5){

                                    console.error(`--airRoutesAPI:\n  Post fail -> [400]`);
                                    res
                                    .status(400)
                                    .json({message : 'Bad request, check json params.'})
                        }else{
                            console.log(`--airRoutesAPI:\n  new resource <${newResource.district}/${newResource.year}> added`);
                            db.insert(newResource);
                            res
                            .status(201)
                            .json(newResource);
                        }                        
                    }else{
                        console.error(`--airRoutesAPI:\n  Post fail -> [409]`);
                        res
                        .status(409)
                        .json({message: 'The resource exists!'});
                    }
                }
            }
        );
    });

    //PUT
    app.put(BASE_AIR_ROUTES_API_PATH, (req,res) => {
        console.error('--airRoutesAPI:\n  ERROR : Method not allowed');
        res.sendStatus(405);
    });

    //DELETE
    app.delete(BASE_AIR_ROUTES_API_PATH, (req,res) => {
        // Removing all documents with the 'match-all' query
        db.remove({}, { multi: true }, (err, numRemoved) => {
            if(err){
                console.error(`--airRoutesAPI:\n  ERROR : <${err}>`);
            }else{
                console.log(`--airRoutesAPI:\n  <${numRemoved}> Resources has been deleted`);
                res
                .status(200)
                .json({ message: `<${numRemoved}> Resources has been deleted`});
            }
        });

    });
    //####################################################################   Request per each resource

    //GET DISTRICT
    app.get(BASE_AIR_ROUTES_API_PATH + "/:urlDistrict", (req,res) => {

        var {urlDistrict} = req.params;        // == var urlDistrict = req.params.urlDistrict
        
        db.find({district : urlDistrict}, (err,resources) =>{
            if(err){
                console.error(`--airRoutesAPI:\n  ERROR : accessing DB in GET(../air_routes/${urlDistrict})`);
                res.sendStatus(500);
            }else{
                if(Object.keys(resources).length > 0){
                    var resourcesToSend = resources.map( (r) =>{
                        delete r._id;   
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

    //GET DISTRICT & YEAR
    app.get(BASE_AIR_ROUTES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {

       

        var {urlDistrict} = req.params;        
        var {urlYear} = req.params;

        db.find({ $and: [{district : urlDistrict}, {year : urlYear}]}, (err,resources) =>{
            if(err){
                console.error(`--airRoutesAPI:\n  ERROR : accessing DB in GET(../air_routes/${urlDistrict})`);
                res.sendStatus(500);
            }else{
                if(Object.keys(resources).length > 0){
                    var resourcesToSend = resources.map( (r) =>{
                        delete r._id;   
                        return r;
                    });
                    res
                    .status(200)
                    .json(resourcesToSend[0]);  //Devolverlo como objeto y no en un array
                }else{
                    res
                    .status(404)
                    .send('The resource doesn´t exist.');
                }
            }
        })
    });

    //POST DISTRICT & YEAR
    app.post(BASE_AIR_ROUTES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {
        console.error('--airRoutesAPI:\n  ERROR : Method not allowed');
        res.sendStatus(405);
    });

    //DELETE DISTRICT
    app.delete(BASE_AIR_ROUTES_API_PATH + "/:urlDistrict", (req,res) => {
        var {urlDistrict} = req.params;

        db.remove({district: urlDistrict}, { multi: true }, (err, numRemoved) => {
            if(err){
                console.error(`--airRoutesAPI:\n  ERROR : <${err}>`);
            }else{
                if(numRemoved == 0){
                    res
                    .status(404)
                    .json({ message: `The collection <${urlDistrict}> doesn´t exist`});
                }else{
                    console.log(`--airRoutesAPI:\n  <${numRemoved}> Resources has been deleted`);
                    res
                    .status(200)
                    .json({ message: `<${numRemoved}> Resources have been deleted`});
                }
            }
        });
    });

    //DELETE DISTRICT & YEAR
    app.delete(BASE_AIR_ROUTES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {
        var {urlDistrict} = req.params;
        var {urlYear} = req.params;

        db.remove({ $and: [{district: urlDistrict}, {year: urlYear}]}, {}, (err, numRemoved) => {
            if(err){
                console.error(`--airRoutesAPI:\n  ERROR : <${err}>`);
            }else{
                if(numRemoved == 0){
                    res
                    .status(404)
                    .json({ message: `<${urlDistrict}/${urlYear}> doesn´t exist`});
                }else{
                    console.log(`--airRoutesAPI:\n  <${urlDistrict}/${urlYear}> has been deleted`);
                    res
                    .status(200)
                    .json({ message: `<${urlDistrict}/${urlYear}> has been deleted`});
                }
            }
        });
    });

  //PUT DISTRICT & YEAR 
    app.put(BASE_AIR_ROUTES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {
        var {urlDistrict} = req.params;
        var {urlYear} = req.params;

        db.update({ $and: [{district: urlDistrict}, {year: urlYear}]},
            {
                // Actualizar todos los recursos del doc
                /* $set: {district :req.body.district,
                    year : req.body.year,
                    flight: req.body.flight,
                    passenger: req.body.passenger,
                    merchandise: req.body.merchandise} */
                

                //Actualizar solo los 3 personales
                $set: {flight: req.body.flight,
                    passenger: req.body.passenger,
                    merchandise: req.body.merchandise}
            },
            {},
            (err, numReplaced) => {
                if(err){
                    console.error(`--airRoutesAPI:\n  ERROR : <${err}>`);
                    res.sendStatus(500);
                }else{
                    if(numReplaced == 0){
                        res
                        .status(404)
                        .json({ message: "The resource you are looking for does not exist "});

                    }else if(!req.body.district || !req.body.year || !req.body.flight || !req.body.passenger
                                || !req.body.merchandise || Object.keys(req.body).length != 5){

                                    console.error(`--airRoutesAPI:\n  Put fail -> [400]`);
                                    res
                                    .status(400)
                                    .json({message : 'Bad request, check json params.'});

                    }else if (req.body.district != urlDistrict || req.body.year != urlYear){
                        console.error(`--airRoutesAPI:\n  Put fail -> [409]`);
                        res
                        .status(409)
                        .json({message : 'Conflict, check the resource identifier.'});  

                    }else{
                        res
                        .status(200)
                        .json(req.body);
                    }
                }
            }
        );
    });
};