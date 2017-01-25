var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var GoogleMapsAPI = require('googlemaps');
var datalayer = require('../data/datalayer.js');
var moment = require('moment');
var MarkerWithLabel = require('markerwithlabel');
//var bootstrap_select = require('bootstrap-select');



//var nodemailer = require('nodemailer');
//var datalayer = require('../data/datalayer.js');

//google maps api
var publicConfig = {
    key: 'AIzaSyCiT0h95IpSJ4N3YNhyFnEcEHrv4ruz4SY',
    stagger_time: 1000,
    encode_polylines: false,
    secure: true
};


/* GET home page. */
router.get('/', function (req, res) {

    //initialize a google map
    var gmAPI = new GoogleMapsAPI(publicConfig);

    // geocode API
    var geocodeParams = {
        "address":    "121, Curtain Road, EC2A 3AD, London UK",
        "components": "components=country:GB",
        "bounds":     "55,-1|54,1",
        "language":   "en",
        "region":     "uk"
    };

    var geoCode;

    //gmAPI.geocode(geocodeParams, function(err, result){
        //console.log(result);
//        geoCode = result;
    
    datalayer.getElectionYears(function(err,rows,fields){
        if(!err){



            res.render('index', {title: 'Test', years: rows});
            console.log(rows);

        } else {
            console.log('Error while performing Query: ' + err);
        }
    });


 
});

/*GET autocomplte for home page search*/
router.get('/search', function (req, res) {
    // console.log("SEARCHING");
    // datalayer.matchPartialAddress(req.query.key, function (err, rows, fields) {
    //     if (err) throw err;
    //     var data = [];
    //     console.log(req.query.key);
    //     for (i = 0; i < rows.length; i++) {
    //         data.push(rows[i].Address);
    //     }
    //     res.end(JSON.stringify(data));
    // });
});

router.get('/getRaces/:raceID', function(req,res){
    //console.log(req.params.raceID);
    datalayer.getRaces(req.params.raceID, function(err,rows,fields){
        if(!err) {
            res.send({races: rows});
            //console.log(rows);
        } else {
            console.log('Error while performing Query: ' + err);
        }
    });
});

router.get('/getCandidates/:raceID', function(req, res){
    datalayer.getCandidates(req.params.raceID, function(err, rows, fields){
        if(!err){
            res.send({candidates: rows});
        } else {
            console.log('Error while performing Query: ' + err);
        }
    })
})

//returns the shape of the wards that are drawn on the map
router.get('/getWards/:electionID', function(req,res){
    //var electionDate = req.params.electionYear + "-12-31 23:59:59";
    var electionID = req.params.electionID;    

    //console.log(electionDate);
    datalayer.getWards(electionID, function(err,rows,fields){
        if(!err) {
            res.send({wards: rows});
            //console.log(rows);
        } else {
            console.log('Error while performing Query: ' + err);
        }
    });
});


//returns the center of the ward for the race selected
router.get('/getWardLocation/:raceID', function(req, res){
    var raceID = req.params.raceID;
    datalayer.getWardLocation(raceID, function(err,rows,fields){
        if(!err) {
            res.send({ward: rows});
            //console.log(rows);
        } else {
            console.log('Error while performing Query: ' + err);
        }
    });
});


//returns the precicnts for the requested ward
router.get('/getPrecincts/:wardID/:raceID', function (req, res) {
    var wardID = req.params.wardID
    var raceID = req.params.raceID 
    datalayer.getPrecincts(raceID, wardID, function (err, rows, fields) {
        if(!err){
            res.send({precincts: rows});
        } else {
            console.log('Error while performing Query: ' + err);
        }

    });
});


//returns the ward results for the mayor's race and the
//'all city council' button
router.get('/getResults_allWards/:raceID', function(req,res) {
    var raceID = req.params.raceID
    datalayer.getResults_allWards(raceID, function(err,rows,fields){
        if(!err){
            res.send({results: rows});
        } else {
            console.log('Error while performing getResults_allWards: ' + err);
        }
    })
});

//returns the results for one race in one ward (includes precinct break downs)
router.get('/getResults_wardView/:wardID/:raceID', function(req,res){
    var wardID = parseInt(req.params.wardID);
    var raceID = parseInt(req.params.raceID);

    datalayer.getResults_wardView(wardID, raceID, function(err,rows,fields){
        if(!err){
            res.send({ward_results: rows});
        } else {
            console.log('Error while performing getResults_WardView: ' + err);
        }
    })
})

router.get('/getResults_precinctView/:precinctID/:raceID', function(req,res){
    var precinctID = parseInt(req.params.precinctID);
    var raceID = parseInt(req.params.raceID);
    datalayer.getResults_precinctView(raceID, precinctID, function(err,rows,fields){
        if(!err){
            res.send({precinct_results: rows});
        } else {
            console.log('Error while performing getResults_precinctView: ' + err);
        }
    });
})


/* GET about page. */
router.get('/about', function (req, res) {
    // res.render('about', { title: 'About', path: req.path });
    // console.log(req.path);
});

/* GET contact page. */
router.get('/contact', function (req, res) {
    // res.render('contact', { title: 'Contact', path: req.path });
    // console.log(req.path);
});

/*POST contact page (for sending emails)*/
/*Source for this: https://blog.ragingflame.co.za/2012/6/28/simple-form-handling-with-express-and-nodemailer*/
router.post('/contact', function(req,res){
    // var mailOpts, smtpTrans;

    // smtpTrans = nodemailer.createTransport('SMTP', {
    //     service: 'Gmail',
    //     auth: {
    //         user: "minneapolis311calls@gmail.com",
    //         pass: "fri$ndgramming"
    //     }
    // });

    // mailOpts = {
    //     from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    //     to: 'minneapolis311calls@gmail.com',
    //     subject: '311 Minneapolis Inquiry from ' + req.body.name + " at " + req.body.email,
    //     text: req.body.message
    // };

    // smtpTrans.sendMail(mailOpts, function(error, response){
    //     if(!error){
    //         console.log('email sent to: ' + mailOpts.to);
    //         console.log('with this content: ' + mailOpts.text);
    //         res.render('contact', {msg: 'Success'});
    //     } else {
    //         console.log(error);
    //     }
    // });

});

module.exports = router;