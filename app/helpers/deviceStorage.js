import { AsyncStorage } from 'react-native';

export const DeviceStorage = {
    async saveItem(key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    },
    async loadJWT() {
        try {

            let value = await AsyncStorage.getItem('id_token');
            // value = null;

            if (value !== null) {
                this.setState({
                    jwt: value,
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    },
    async deleteJWT() {
        try{
            await AsyncStorage.removeItem('id_token')
                .then(
                    () => {
                        this.setState({
                            jwt: ''
                        })
                    }
                );
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    }
};