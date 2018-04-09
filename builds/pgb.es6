// Check https://github.com/phonegap-build/pgb-api/blob/master/CHEATSHEET.md

const pgb = require('pgb-api')();

pgb.addAuth('your-api-token');
pgb.getApps()
    .then(console.log)
    .catch(console.error);
