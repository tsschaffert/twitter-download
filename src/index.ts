import { TwitWrapper, SearchResult } from "./TwitWrapper";
const fs = require('fs');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'query', type: String, multiple: false, defaultOption: true }
];

var T = new TwitWrapper({
    consumer_key: 'gP2Tuc7uygn95weeVzwlj6A2b',
    consumer_secret: 'o9onFEm6Oqvamz9ohPwx4UEPKmjRiyMe3vc7le7qCJLW6CvKPs',
    app_only_auth: true
});

function main(options) {
    if (options.query === undefined) {
        console.error("Search query is needed.");
        process.exit(1);
        return;
    }

    searchComplete(options.query, null);
}

async function searchComplete(query: string, lang: string = 'en') {
    let results = await T.search(query, 100, undefined, lang);

    while(results.search_metadata.count > 0) {       
        for (let result of results.statuses) {
            if(!result.retweeted) {
                console.log(`** ${result.text} **`);
 
                // Store user timeline
                await storeTimeline(result.user.id_str);
            }
        }

        if (results.search_metadata.next_results) {
            let nextMaxId = /max_id=([0-9]+)/.exec(results.search_metadata.next_results)[1];
            results = await T.search(query, 100, nextMaxId, lang);
        } else {
            break;
        }
        
    }
}

async function storeTimeline(userId: string) {
    var filename = `out/${userId}.json`;
    if (!fs.existsSync(filename)) {
        let tweets = [];
        let tweetResult = await T.getTimelineSafe(userId, 200);

        while (tweetResult.length > 0) {
            tweets = tweets.concat(tweetResult);

            let minId = tweetResult[0].id_str;
            
            for (let tweet of tweetResult) {
                if (tweet.id_str.length <= minId.length && tweet.id_str < minId) {
                    minId = tweet.id_str;
                }
            }

            tweetResult = await T.getTimelineSafe(userId, 200, minId);
            if (tweetResult.length > 0) {
                tweetResult.splice(0, 1);
            }
        }    

        fs.writeFileSync(`out/${userId}.json`, JSON.stringify(tweets, null, 2), 'utf8');
    }
}

main(commandLineArgs(optionDefinitions))