﻿var config = {
    production: {
        //connection info to MySQL database
        database: {
            host: 'elections.c44css47zkdo.us-west-2.rds.amazonaws.com',
            user: 'admin',
            password: '35THmeridian',
            database: 'election_results',
            connectionLimit: 10
        },
        contactUsEmailPassword: 'ijustwanttoresearchhouses',
        wordpressPassword: 'crazynewpassword17!',
        zillowAPIKey: 'X1-ZWz199abp5hssr_282ek'
    }
};
module.exports = config;

