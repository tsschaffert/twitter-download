import twitWrapper from "./TwitWrapper";

async function test() {
    var T = new twitWrapper({
        consumer_key: 'gP2Tuc7uygn95weeVzwlj6A2b',
        consumer_secret: 'o9onFEm6Oqvamz9ohPwx4UEPKmjRiyMe3vc7le7qCJLW6CvKPs',
        app_only_auth: true
    });

    let results = await T.search('have been hacked', 10);

    for (let result of results.statuses) {
        if(!result.retweeted) {
            console.log(`** ${result.text} **`);
            let tweets = await T.getTimeline(result.user.screen_name, 10);
            for (let tweet of tweets) {
                console.log(tweet.text.trim());
            }
            console.log("\n");
        }
    }
}

test();
