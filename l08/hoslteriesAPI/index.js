var BASE_HOSTELRIES_API_PATH = "/api/v1/hostelries";

module.exports.loadDB = (db) => {
    let initData = require ('./initialData');
    //db.insert(initData);
    db.insert(initData, (err, dataAdded) => {
        if(err){
            console.error('--HostelriesAPI:\n  ERROR : the data hasn´t inserted into DataBase!')
        }else{
            console.log('--HostelriesAPI:\n  Data inserted into DataBase')
        }
    })
};

module.exports.httpCRUD = (app, db) => {

    //####################################################    Requests of ../hostelries
    //GET
    app.get(BASE_HOSTELRIES_API_PATH, (req,res) => {
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
                        console.log(`--HostelriesAPI:\n  new resource <${newResource.district}/${newResource.year}> added`)
                        db.insert(newResource);
                        res
                        .status(201)
                        .json(newResource);
                    }else{
                        res.sendStatus(409);
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
                    .json(resourcesToSend);
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
                $set: {employee_staff: req.body.employee_staff,
                    establishment_open: req.body.establishment_open,
                    traveler_numer: req.body.traveler_numer}
            }, {}, (err, numReplaced) => {
                        if(err){
                            console.error(`--HostelriesAPI:\n  ERROR : <${err}>`);
                        }else{
                            if(numReplaced == 0){
                                res
                                .status(404)
                                .json({ message: "The resource you are looking for does not exist "});
                            }else{
                                res
                                .status(201)
                                .json(req.body)
                            }
                        }
                    }
            );

    });

};