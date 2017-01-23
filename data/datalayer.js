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
            connection.query('Select DISTINCT t.Name, c.City As Location, r.idRace from Races r Join Titles t on t.idTitles = r.idTitle Join Locations l on l.idLocations = r.idLocation Join Cities c on c.idCities = l.idCity Where r.idElection =? UNION Select DISTINCT t.Name, w.Ward_Name, r.idRace from Races r Join Titles t on t.idTitles = r.idTitle Join Locations l on l.idLocations = r.idLocation Join Wards w  on w.idWard = l.idWard Where r.idElection =?;', [idElection,idElection], function(err, rows, fields){
                connection.release();
                callback(err,rows,fields);
            });
        });       
    }

    this.getCandidates = function(idRace, callback){
        pool.getConnection(function(err,connection){
            connection.query('Select c.idCandidate, ctr.idCandidates_To_Race, c.First, c.Middle, c.Nickname, c.Last, c.Name_Suffix, ctr.FPTP_Votes_Total, ctr.RC_First_Place_Votes_Total, ctr.RC_Second_Place_Votes_Total, ctr.RC_Third_Place_Votes_Total from Candidates c Join Candidates_To_Race ctr ON ctr.idCandidate = c.idCandidate Where ctr.idRace = ? Order By ctr.FPTP_Votes_Total DESC, ctr.RC_First_Place_Votes_Total DESC, ctr.RC_Second_Place_Votes_Total DESC, ctr.RC_Third_Place_Votes_Total DESC;', idRace, function(err, rows, fields){
                connection.release();
                callback(err,rows,fields);

            });
        })
    }

    this.getWards = function(idElection, callback){
         pool.getConnection(function(err,connection){
            connection.query('Select w.idWard, w.Ward_Name, w.Year_Start, w.Year_End, w.Boundaries, w.Center, e.Date from Elections e Join Wards w on w.idCity = e.idCity Where idElection = ? And e.Date BETWEEN w.Year_Start AND w.Year_End;', idElection, function(err,rows,fields){ 
                connection.release();
                callback(err,rows,fields);
            });
        });       
    }

    this.getWardLocation = function(idRace, callback){
        pool.getConnection(function(err,connection){
            connection.query('Select w.Center from Races r Join Locations l on l.idLocations = r.idLocation Join Wards w on w.idWard = l.idWard where r.idRace = ?;', idRace, function(err,rows,fields){
                connection.release();
                callback(err,rows,fields);
            });
        });
    }


    this.getPrecincts = function(idWard, callback) {
        pool.getConnection(function(err,connection){
            connection.query('Select * From Precincts where idWard = ?', idWard, function(err, rows, fields){
                connection.release();
                callback(err,rows,fields);
            });
        });
    };


    this.getResults_allWards = function(idRace, callback) {
        pool.getConnection(function(err,connection){
            connection.query('Call spRaceResults_ByRace_ByWard(?);', idRace, function(err, rows, fields){
                connection.release();
                callback(err, rows, fields);
            });
        })
    }

    this.getResults_wardView = function(idRace, idWard, callback) {
        pool.getConnection(function(err,connection){
            connection.query('Call spWard_View(?, ?)', [idRace, idWard], function(err, rows, fields){
                connection.release();
                callback(err,rows,fields);
            });
        })
    }

    this.getResults_precinctView = function(idRace, idPrecinct, callback){
        pool.getConnection(function(err,connection){
            connection.query('Call spPrecinct_View(?,?)', [idRace, idPrecinct], function(err, rows, fields){
                connection.release();
                callback(err,rows,fields);
            });
        })
    }



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
