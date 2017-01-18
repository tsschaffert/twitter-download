import twitWrapper from "./TwitWrapper";

var T = new twitWrapper({
    consumer_key: 'gP2Tuc7uygn95weeVzwlj6A2b',
    consumer_secret: 'o9onFEm6Oqvamz9ohPwx4UEPKmjRiyMe3vc7le7qCJLW6CvKPs',
    app_only_auth: true
});

T.search('banana since:2016-08-13', 100).then((data) => {
    console.log(data);
});