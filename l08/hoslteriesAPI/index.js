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

};