var BASE_HOSTELRIES_API_PATH = "/api/v1/hostelries";

module.exports.loadDB = (app, db) => {
    let initData = require ('./initialData');
    
    app.get(BASE_HOSTELRIES_API_PATH + "/loadInitialData", (req,res) => {

        //In case there are resources
        db.remove({},{ multi: true });

        db.insert(initData, (err, dataAdded) => {
            if(err){
                console.error('--HostelriesAPI:\n  ERROR : the data hasn´t inserted into DataBase!');
                res.sendStatus(500);
            }else{
                console.log('--HostelriesAPI:\n  Data inserted into DataBase')
                res
                .status(201)
                .json({ message : `<${dataAdded.length}> Resources has been inserted into DB`});
            }
        })
    });
};

module.exports.httpCRUD = (app, db) => {

    //####################################################    Requests of ../hostelries
    //GET
    app.get(BASE_HOSTELRIES_API_PATH, (req,res) => {
        /*
        console.log(req.query);
        //find the data to send
        db.find({}, (err, resources) => {
            if(err){
                console.error('--HostelriesAPI:\n  ERROR : accessing DB in GET(../hostelries)');
                res.sendStatus(500);
            }else{
                //res.send(JSON.stringify(resources,null,2));
                var resourcesToSend = resources.map( (r) =>{
                    delete r._id;   //   ==   delete r["_id"];
                    return r;
                });
                res
                .status(200)
                .json(resourcesToSend);
            }
        })*/

        var reqQuery = {};   //Json to save search and paginating params

        //Paginating
        //  - offset: a partir de que núm. de elementos quiero que los mande
        //  - limit: núm. de recursos de la página que quiero que mande
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

        //Search = filter
        if(req.query.district){
            reqQuery["district"] = req.query.district;
        }
        if(req.query.year){
            reqQuery["year"] = req.query.year;
        }
        if(req.query.employee_staff){
            reqQuery["employee_staff"] = parseInt(req.query.employee_staff);
        }
        if(req.query.establishment_open){
            reqQuery["establishment_open"] = parseInt(req.query.establishment_open);
        }
        if(req.query.traveler_numer){
            reqQuery["traveler_numer"] = parseInt(req.query.traveler_numer);
        }

        //console.log(reqQuery);
        db.find(reqQuery).sort({district:1,year:-1}).skip(offset).limit(limit).exec((err,resources) => {
            if(err){
                console.error('--HostelriesAPI:\n  ERROR : accessing DB in GET(../hostelries)');
                res.sendStatus(500);
            }else{
                //res.send(JSON.stringify(resources,null,2));
                var resourcesToSend = resources.map( (r) =>{
                    delete r._id;   //   ==   delete r["_id"];
                    return r;
                });
                res
                .status(200)
                .json(resourcesToSend);
            }
        })
    });

    //POST
    app.post(BASE_HOSTELRIES_API_PATH, (req,res) => {
        var newResource = req.body;
        //check if the resource to add exists
        db.find({ $and: [{district : newResource.district}, {year : newResource.year}]},
            (err, resourcesInDB) =>{
                if(err){
                    console.error('--HostelriesAPI:\n  ERROR : accessing DB in POST');
                    res.sendStatus(500);
                }else{
                    if(Object.keys(resourcesInDB).length == 0){

                        if(!newResource.district || !newResource.year ||!newResource.employee_staff || !newResource.establishment_open
                                || !newResource.traveler_numer || Object.keys(newResource).length != 5){

                                    console.error(`--HostelriesAPI:\n  Post fail -> [400]`);
                                    res
                                    .status(400)
                                    .json({message : 'Bad request, check json params.'})
                        }else{
                            console.log(`--HostelriesAPI:\n  new resource <${newResource.district}/${newResource.year}> added`);
                            db.insert(newResource);
                            res
                            .status(201)
                            .json(newResource);
                        }                        
                    }else{
                        console.error(`--HostelriesAPI:\n  Post fail -> [409]`);
                        res
                        .status(409)
                        .json({message: 'The resource exists!'});
                    }
                }
            }
        );
    });

    //PUT
    app.put(BASE_HOSTELRIES_API_PATH, (req,res) => {
        console.error('--HostelriesAPI:\n  ERROR : Method not allowed');
        res.sendStatus(405);
    });

    //DELETE
    app.delete(BASE_HOSTELRIES_API_PATH, (req,res) => {
        // Removing all documents with the 'match-all' query
        db.remove({}, { multi: true }, (err, numRemoved) => {
            if(err){
                console.error(`--HostelriesAPI:\n  ERROR : <${err}>`);
            }else{
                console.log(`--HostelriesAPI:\n  <${numRemoved}> Resources has been deleted`);
                res
                .status(200)
                .json({ message: `<${numRemoved}> Resources has been deleted`});
            }
        });

    });
    //####################################################################   Request per each resource

    app.get(BASE_HOSTELRIES_API_PATH + "/:urlDistrict", (req,res) => {

        var {urlDistrict} = req.params;        // == var urlDistrict = req.params.urlDistrict
        
        db.find({district : urlDistrict}, (err,resources) =>{
            if(err){
                console.error(`--HostelriesAPI:\n  ERROR : accessing DB in GET(../hostelries/${urlDistrict})`);
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

    app.get(BASE_HOSTELRIES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {

        var {urlDistrict} = req.params;        // == var urlDistrict = req.params.urlDistrict
        var {urlYear} = req.params;
        
        db.find({ $and: [{district : urlDistrict}, {year : urlYear}]}, (err,resources) =>{
            if(err){
                console.error(`--HostelriesAPI:\n  ERROR : accessing DB in GET(../hostelries/${urlDistrict})`);
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

    app.post(BASE_HOSTELRIES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {
        console.error('--HostelriesAPI:\n  ERROR : Method not allowed');
        res.sendStatus(405);
    });

    app.delete(BASE_HOSTELRIES_API_PATH + "/:urlDistrict", (req,res) => {
        var {urlDistrict} = req.params;

        db.remove({district: urlDistrict}, { multi: true }, (err, numRemoved) => {
            if(err){
                console.error(`--HostelriesAPI:\n  ERROR : <${err}>`);
            }else{
                if(numRemoved == 0){
                    res
                    .status(404)
                    .json({ message: `The collection <${urlDistrict}> doesn´t exist`});
                }else{
                    console.log(`--HostelriesAPI:\n  <${numRemoved}> Resources has been deleted`);
                    res
                    .status(200)
                    .json({ message: `<${numRemoved}> Resources have been deleted`});
                }
            }
        });
    });

    app.delete(BASE_HOSTELRIES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {
        var {urlDistrict} = req.params;
        var {urlYear} = req.params;

        db.remove({ $and: [{district: urlDistrict}, {year: urlYear}]}, {}, (err, numRemoved) => {
            if(err){
                console.error(`--HostelriesAPI:\n  ERROR : <${err}>`);
            }else{
                if(numRemoved == 0){
                    res
                    .status(404)
                    .json({ message: `<${urlDistrict}/${urlYear}> doesn´t exist`});
                }else{
                    console.log(`--HostelriesAPI:\n  <${urlDistrict}/${urlYear}> has been deleted`);
                    res
                    .status(200)
                    .json({ message: `<${urlDistrict}/${urlYear}> has been deleted`});
                }
            }
        });
    });

    //Select JSON format in  POSTMAN !!!!!!!!!!
    app.put(BASE_HOSTELRIES_API_PATH + "/:urlDistrict/:urlYear", (req,res) => {
        var {urlDistrict} = req.params;
        var {urlYear} = req.params;

        db.update({ $and: [{district: urlDistrict}, {year: urlYear}]},
            {
                /* In case to set all values of the resource
                $set: {district :req.body.district,
                    year : req.body.year,
                    employee_staff: req.body.employee_staff,
                    establishment_open: req.body.establishment_open,
                    traveler_numer: req.body.traveler_numer}
                */
                $set: {employee_staff: req.body.employee_staff,
                    establishment_open: req.body.establishment_open,
                    traveler_numer: req.body.traveler_numer}
            },
            {},
            (err, numReplaced) => {
                if(err){
                    console.error(`--HostelriesAPI:\n  ERROR : <${err}>`);
                    res.sendStatus(500);
                }else{
                    if(numReplaced == 0){
                        res
                        .status(404)
                        .json({ message: "The resource you are looking for does not exist "});

                    }else if(!req.body.district || !req.body.year || !req.body.employee_staff || !req.body.establishment_open
                                || !req.body.traveler_numer || Object.keys(req.body).length != 5){

                                    console.error(`--HostelriesAPI:\n  Put fail -> [400]`);
                                    res
                                    .status(400)
                                    .json({message : 'Bad request, check json params.'});

                    }else if (req.body.district != urlDistrict || req.body.year != urlYear){
                        console.error(`--HostelriesAPI:\n  Put fail -> [409]`);
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