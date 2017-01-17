var DataLayer = function () {
    var mysql = require("mysql");
    var creds = //require("./_config.js");
        {
            host: 'elections.c44css47zkdo.us-west-2.rds.amazonaws.com',
            user: 'admin',
            password: '35THmeridian',
            database: 'election_results',
            connectionLimit: 10
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


    this.getPrecincts = function(callback) {
        pool.getConnection(function (err, connection) {
            // Use the connection
            connection.query('call spElectionResults_City_Total(3); ', function (err, rows, fields) {
            // And done with the connection.
                connection.release();
                callback(err, rows, fields);
            });
        })
    };

};

module.exports = new DataLayer();
