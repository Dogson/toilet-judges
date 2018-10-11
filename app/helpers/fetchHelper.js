export class FetchHelper {
    static getQueryString(params) {
        let esc = encodeURIComponent;
        return Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');
    }

    static request(params) {
        let method = params.method || 'GET';
        let qs = '';
        let body;
        let headers = params.headers || {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        let url = params.url;
        let apiKey = params.apiKey || '';

        if (['GET', 'DELETE'].indexOf(method) > -1) {
            if (params.id) {
                qs = '/' + params.id + '/';
            }
            if (params.data) {
                qs = '?' + this.getQueryString(params.data);
            }
        }

        else {
            if (params.data) {
                body = JSON.stringify(params.data);
            }
        } // POST or PUT

        url = url + apiKey + qs;

        return fetch(url, {method, headers, body});
    }

    static get(params) {
        return this.request(Object.assign({method: 'GET'}, params))
    }

    static post(params) {
        return this.request(Object.assign({method: 'POST'}, params))
    }

    static put(params) {
        return this.request(Object.assign({method: 'PUT'}, params))
    }

    static delete(params) {
        return this.request(Object.assign({method: 'DELETE'}, params))
    }
}