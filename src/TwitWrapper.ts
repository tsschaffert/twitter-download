var twit = require('twit');

interface SearchWrapper { 
    statuses: SearchResult[],
    search_metadata: {
        max_id_str: string,
        query: string,
        count: number,
        next_results: string
    }
}

interface SearchResult {
    created_at: string,
    id_str: string,
    text: string,
    retweeted: boolean,
    user: {
        id: number,
        id_str: string,
        screen_name: string
    }
}



export default class TwitWrapper {
    private T: any;

    constructor(config: {
        consumer_key: string,
        consumer_secret: string,
        app_only_auth?: boolean,
        access_token?: string,
        access_token_secret?: string
        timeout_ms?: number
    }) {
        this.T = new twit(config);
    }

    public search(query: string, count: number = 100, maxId?: string, lang: string = 'en'): Promise<SearchWrapper> {
        return this.T.get('search/tweets', { q: query, count: count, lang: lang, max_id: maxId, result_type: 'recent' }).then((result) => {
            return result.data;
        });
    }

    public getTimeline(user: string | number, count: number = 200, maxId?: string, excludeReplies: boolean = true, includeRts: boolean = false, trimUser: boolean = true): Promise<{
        created_at: string,
        id_str: string,
        text: string,
        user: {
            id: number,
            id_str: string
        }
    }[]> {
        let userId: number = null;
        let screenName: string = null;
        if (typeof user === 'number') {
            userId = user;
        } else {
            screenName = user;
        }
        return this.T.get('statuses/user_timeline', { user_id: userId, screen_name: screenName, count: count, max_id: maxId, exclude_replies: excludeReplies, include_rts: includeRts, trim_user: trimUser }).then((result) => {
            return result.data;
        });
    }
}