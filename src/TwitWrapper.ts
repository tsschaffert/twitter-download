var twit = require('twit');

export interface SearchWrapper { 
    statuses: SearchResult[],
    search_metadata: {
        max_id_str: string,
        query: string,
        count: number,
        next_results: string
    }
}

export interface SearchResult {
    created_at: string,
    id_str: string,
    text: string,
    retweeted: boolean,
    user: User,
    entities: {
        urls: Url[],
        hashtags: Hashtag[],
        user_mentions: User[]
    }
}

interface User {
    id_str: string,
    screen_name: string
}

interface Url {
    url: string,
    expanded_url: string
}

interface Hashtag {
    text: string
}

interface Tweet {
    created_at: string,
    id_str: string,
    text: string,
    user: {
        id_str: string
    }
}

export class TwitWrapper {
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
            if (result.data.errors && result.data.errors.length > 0) {
                throw result.data.errors;
            }

            return result.data;
        });
    }

    public getTimeline(userId: string, count: number = 200, maxId?: string, excludeReplies: boolean = true, includeRts: boolean = false, trimUser: boolean = true): Promise<Tweet[]> {
        return this.T.get('statuses/user_timeline', { user_id: userId, count: count, max_id: maxId, exclude_replies: excludeReplies, include_rts: includeRts, trim_user: trimUser }).then((result) => {
            if (result.data.errors && result.data.errors.length > 0) {
                throw result.data.errors;
            }

            return result.data;
        });
    }

     public async getTimelineSafe(userId: string, count: number = 200, maxId?: string, excludeReplies: boolean = true, includeRts: boolean = false, trimUser: boolean = true): Promise<Tweet[]> {
        let timelineResult = null;

        while (timelineResult === null) {
            timelineResult = await new Promise((resolve, reject) => {
                this.getTimeline(userId, count, maxId, excludeReplies, includeRts, trimUser).then((result) => {
                    resolve(result);
                }).catch((error) => {
                    console.log(error);

                    setTimeout(() => {
                        resolve(null);
                    }, 60000);
                });
            });
        }

        return timelineResult;
    }



    public showUser(userId: string): Promise<User> {
        return this.T.get('users/show', { user_id: userId }).then((result) => {
            if (result.data.errors && result.data.errors.length > 0) {
                throw result.data.errors;
            }

            return result.data;
        });
    }

    public getLimits(resources: string): Promise<User> {
        return this.T.get('application/rate_limit_status', { resources: resources }).then((result) => {
            if (result.data.errors && result.data.errors.length > 0) {
                throw result.data.errors;
            }

            return result.data;
        });
    }
}