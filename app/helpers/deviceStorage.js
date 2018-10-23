import { AsyncStorage } from 'react-native';

export const DeviceStorage = {
    async saveJWT(value) {
        return AsyncStorage.setItem('token_id', value);
    },
    async loadJWT() {
        return AsyncStorage.getItem('token_id');
    },
    async deleteJWT() {
        return AsyncStorage.removeItem('token_id');
    }
};