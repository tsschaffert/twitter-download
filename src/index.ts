/*var ajax = require('request-promise-native');

var options = {
    uri: 'https://moped.ecampus.rwth-aachen.de/proxy/api/v2/version',
    qs: {
        test: 'Hi'
    },
    json: true // Automatically parses the JSON string in the response 
};

ajax(options).then((response) => {
    console.log(response.Data);
});*/
var twit = require('twit');

var T = new twit({
    consumer_key: 'gP2Tuc7uygn95weeVzwlj6A2b',
    consumer_secret: 'o9onFEm6Oqvamz9ohPwx4UEPKmjRiyMe3vc7le7qCJLW6CvKPs',
    app_only_auth: true
});

T.get('search/tweets', { q: 'banana since:2016-08-13', count: 100 }, function(err, data, response) {
  console.log(data)
});