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
            connection.query('Select ctr.Color, c.idCandidate, ctr.idCandidates_To_Race, c.First, c.Middle, c.Nickname, c.Last, c.Name_Suffix, ctr.FPTP_Votes_Total, ctr.RC_First_Place_Votes_Total, ctr.RC_Second_Place_Votes_Total, ctr.RC_Third_Place_Votes_Total from Candidates c Join Candidates_To_Race ctr ON ctr.idCandidate = c.idCandidate Where ctr.idRace = ? Order By ctr.FPTP_Votes_Total DESC, ctr.RC_First_Place_Votes_Total DESC, ctr.RC_Second_Place_Votes_Total DESC, ctr.RC_Third_Place_Votes_Total DESC;', idRace, function(err, rows, fields){
                connection.release();
                callback(err,rows,fields);

            });
        })
    }

    this.getWards = function(idRace,  callback){
         pool.getConnection(function(err,connection){
            connection.query('Call spColorWards(?)', idRace, function(err,rows,fields){ 
                connection.release();
                callback(err,rows,fields);
            });
        });       
    }

    this.getWardsHeatMap = function(idRace, idCandidate, callback){
        pool.getConnection(function(err,connection){
            connection.query('Call spColorWards_HeatMap(?, ?)', [idRace, idCandidate], function(err, rows, fields){
                connection.release();
                callback(err,rows,fields);
            });
        });        
    }

    this.getPrecinctsHeatMap = function(idRace, idCandidate, idWard, callback){
        pool.getConnection(function(err,connection){
            connection.query('Call spColorPrecincts_HeatMap(?, ?, ?)', [idRace, idCandidate, idWard], function(err, rows, fields){
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


    this.getPrecincts = function(idRace, idWard, callback) {
        pool.getConnection(function(err,connection){
            connection.query('Call spColorPrecincts(?, ?)', [idRace, idWard], function(err, rows, fields){
            //connection.query('Select * From Precincts where idWard = ?', idWard, function(err, rows, fields){
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


    this.getCandidate_SplashInfo = function(idCandidates_To_Race, callback){
        pool.getConnection(function(err,connection){
            connection.query('Call spCandidate_Splash_Page(?);', idCandidates_To_Race, function(err,rows,fields){
                connection.release();
                callback(err,rows,fields);
            })
        })
    }

    this.getCandidateContributions = function(idCandidates_To_Race, callback){
        pool.getConnection(function(err,connection){
            connection.query('Call spCandidate_Contributions(?);', idCandidates_To_Race, function(err,rows,fields){
                connection.release();
                callback(err,rows,fields);
            })
        })
    }

    this.getCandidateSectorInformation = function(idCommittee, callback){
        pool.getConnection(function(err,connection){
            connection.query('Select d.Sector, Sum(d.Money_Received_This_Period) as Total From Donations d Join Reports r on r.idReport = d.idReport Join Committees c on c.idCommittee = r.idCommittee where c.idCommittee = ? Group By d.Sector;', idCommittee, function(err, rows, fields){
                connection.release();
                callback(err,rows,fields);
            })
        })
    }

    this.getCandidateTimeline = function(idCommittee, callback){
        pool.getConnection(function(err,connection){
            connection.query('Select r.Report_Date, r.Report_Name, Sum(d.Money_Received_This_Period) as Total From Donations d Join Reports r on r.idReport = d.idReport Join Committees c on c.idCommittee = r.idCommittee where c.idCommittee = ? Group By r.idReport Order By r.Report_Date ASC;', idCommittee, function(err, rows, fields){
                connection.release();
                callback(err,rows,fields);
            })
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
