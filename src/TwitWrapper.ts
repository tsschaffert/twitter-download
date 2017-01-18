var twit = require('twit');

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

    public search(query: string, count: number): Promise<any> {
        return this.T.get('search/tweets', { q: query, count: count }).then((result) => {
            return result.data;
        });
    }
}