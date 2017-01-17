var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var GoogleMapsAPI = require('googlemaps');
var datalayer = require('../data/datalayer.js');


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

/*POST to check if user input is in database*/
router.post('/getPrecincts', function (req, res) {
    // console.log("POST METHOD:");
    // console.log(req.body.typeahead) //returns what the user typed in the box

    //connect to database and search the input in the address column
    datalayer.getPrecincts(req.body.typeahead, function (err, rows, fields) {
        if(!err){
            res.render('index', {precincts: rows});
            console.log(rows);

        } else {
            console.log('Error while performing Query: ' + err);
        }

    });



   


});
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