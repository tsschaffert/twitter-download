import twitWrapper from "./TwitWrapper";
var fs = require('fs');

var T = new twitWrapper({
        consumer_key: 'gP2Tuc7uygn95weeVzwlj6A2b',
        consumer_secret: 'o9onFEm6Oqvamz9ohPwx4UEPKmjRiyMe3vc7le7qCJLW6CvKPs',
        app_only_auth: true
    });

async function test() {
    searchComplete('have been hacked OR was hacked OR twitter hacked OR account hacked');
}

async function searchComplete(query: string, lang: string = 'en') {
    let results = await T.search(query, 100, undefined, lang);

    while(results.search_metadata.count > 0) {
        let nextMaxId = /max_id=([0-9]+)/.exec(results.search_metadata.next_results)[1];
        for (let result of results.statuses) {
            if(!result.retweeted) {
                console.log(`** ${result.text} **`);

                await storeTimeline(result.user.screen_name, result.user.id_str);
            }
        }

        results = await T.search(query, 100, nextMaxId, lang);
    }
}

async function storeTimeline(screenName: string, userId: string) {
    let tweets = [];
    let tweetResult = await T.getTimeline(screenName, 200);

    while (tweetResult.length > 0) {
        tweets = tweets.concat(tweetResult);

        let minId = tweetResult[0].id_str;
        
        for (let tweet of tweetResult) {
            if (tweet.id_str.length <= minId.length && tweet.id_str < minId) {
                minId = tweet.id_str;
            }
        }

        tweetResult = await T.getTimeline(screenName, 200, minId);
        if (tweetResult.length > 0) {
            tweetResult.splice(0, 1);
        }
    }    

    if (tweets.length > 0) {
        fs.writeFileSync(`out/${userId}.json`, JSON.stringify(tweets, null, 2));
    }
}

test();