var DataLayer = function () {
    var mysql = require("mysql");
    var creds = //require("./_config.js");
        {
            host: 'elections.c44css47zkdo.us-west-2.rds.amazonaws.com',
            user: 'admin',
            password: '35THmeridian',
            database: 'election_results',
            connectionLimit: 100
        };

    var pool = mysql.createPool(creds);

    this.getElectionYears = function(callback) {
        pool.getConnection(function(err,connection){
            connection.query('Select Extract(YEAR From Date) As Year, idElection from Elections Order by Year Desc;', function(err, rows, fields){
                connection.release();
                callback(err,rows,fields);
            });
        });
    };

    this.getRaces = function(idElection, callback){
         pool.getConnection(function(err,connection){
            connection.query('Select DISTINCT t.Name from Races r Join Titles t on t.idTitles = r.idTitle Join Locations l on l.idLocations = r.idLocation Where r.idElection =?;', idElection, function(err, rows, fields){
                connection.release();
                callback(err,rows,fields);
            });
        });       
    }

    this.getWards = function(idElection, callback){
         pool.getConnection(function(err,connection){
            connection.query('Select w.Ward_Name, w.Year_Start, w.Year_End, w.Boundaries, e.Date from Elections e Join Wards w on w.idCity = e.idCity Where idElection = ? And e.Date BETWEEN w.Year_Start AND w.Year_End;', idElection, function(err,rows,fields){ 
                connection.release();
                callback(err,rows,fields);
            });
        });       
    }


    this.getPrecincts = function(callback) {
        pool.getConnection(function(err,connection){
            connection.query('call spElectionResults_City_Total(3); ', function(err, rows, fields){
                connection.release();
                callback(err,rows,fields);
            });
        });
    };



    // this.getPrecincts = function(callback) {
    //     pool.getConnection(function (err, connection) {
    //         // Use the connection
    //         connection.query('call spElectionResults_City_Total(3); ', function (err, rows, fields) {
    //         // And done with the connection.
    //             connection.release();
    //             callback(err, rows, fields);
    //         });
    //     })
    // };

};

module.exports = new DataLayer();
