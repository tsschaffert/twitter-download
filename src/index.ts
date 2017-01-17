var ajax = require('request-promise-native');

var options = {
    uri: 'https://moped.ecampus.rwth-aachen.de/proxy/api/v2/version',
    qs: {
        test: 'Hi'
    },
    json: true // Automatically parses the JSON string in the response 
};

ajax(options).then((response) => {
    console.log(response.Data);
});