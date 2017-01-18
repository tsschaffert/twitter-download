var twit = require('twit');

export default class TwitPromise {
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

    public get(path: string, params?: {}): Promise<any> {
        return new Promise((resolve, reject) => {
            this.T.get(path, params, (err, data, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    public post(path: string, params?: {}): Promise<any> {
        return new Promise((resolve, reject) => {
            this.T.post(path, params, (err, data, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}