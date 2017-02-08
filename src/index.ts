import { TwitWrapper, SearchResult } from "./TwitWrapper";
var fs = require('fs');

var T = new TwitWrapper({
        consumer_key: 'gP2Tuc7uygn95weeVzwlj6A2b',
        consumer_secret: 'o9onFEm6Oqvamz9ohPwx4UEPKmjRiyMe3vc7le7qCJLW6CvKPs',
        app_only_auth: true
    });

interface IndexEntry {
    userId: string,
    tweetId: string,
    tweetText: string,
    mentionedUserIds: string[]
}

var index: IndexEntry[] = [];

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
 
                // Store user timeline
                await storeTimeline(result.user.id_str);

                // Store timelines of mentioned users as well
                for (let mention of result.entities.user_mentions) {
                    await storeTimeline(mention.id_str);
                }

                // Update index (to connect search result with user files)
                updateIndex(result);
            }
        }

        results = await T.search(query, 100, nextMaxId, lang);
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

function updateIndex(result: SearchResult) {
    let entry: IndexEntry = {
        userId: result.user.id_str,
        tweetId: result.id_str,
        tweetText: result.text,
        mentionedUserIds: result.entities.user_mentions.map((value, index) => value.id_str)
    };

    if (index.length === 0) {
        if (fs.existsSync('out/index.json')) {
            index = JSON.parse(fs.readFileSync('out/index.json', 'utf8'));
        }
    }

    index.push(entry);

    fs.writeFileSync('out/index.json', JSON.stringify(index, null, 2), 'utf8');
}

test();