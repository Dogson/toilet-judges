import {APP_CONFIG} from "../config/appConfig";
import {DeviceStorage} from "../helpers/deviceStorage";
import {FetchHelper} from "../helpers/fetchHelper";

export class AuthEndpoints {
    static login(email, password) {
        const url = APP_CONFIG.apiUrl;
        const apiKey = "login";
        return FetchHelper.post({
            url: url,
            apiKey: apiKey,
            data: {
                email: email,
                password: password
            }
        })
            .then((response) => {
                return response.json()
                    .then((data) => {
                        DeviceStorage.saveItem("id_token", data.token);
                        return data;
                    });
            })
            .catch((err) => {
                console.log(err);
        })
    }
}