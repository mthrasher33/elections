var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var GoogleMapsAPI = require('googlemaps');
var datalayer = require('../data/datalayer.js');
var moment = require('moment');
var MarkerWithLabel = require('markerwithlabel');
var dataLayer = require('../data/datalayer.js');

//var bootstrap_select = require('bootstrap-select');

/* GET candidate page page. */
router.get('/:idCandidates_To_Race', function (req, res) {
	//res.render('candidate', {title: 'Candidate Page', pageTitle: 'Kevin Reich'});
  
  //get everything from the candidate table, pertinent race results, and whether or not they have financial information (if there is a committee listed under their name)
    dataLayer.getCandidate_SplashInfo(req.params.idCandidates_To_Race, function(err,rows,fields){
    	if(!err){
    		console.log(rows[0][0]);
    		res.render('candidate', {title: 'Candidate Page', pageTitle: rows[0][0].First + ' ' + rows[0][0].Last, candidateInfo: rows[0][0]});
    	} else {
    		console.log('Error while performing Query: ' + err);
    	}
    });
   /* datalayer.getElectionYears(function(err,rows,fields){
        if(!err){
            res.render('index', {title: 'Test', years: rows});
            console.log(rows);

        } else {
            console.log('Error while performing Query: ' + err);
        }
    });*/


 
});


module.exports = router;