import axios from 'axios';
const request = axios.create({
    baseURL: 'http://localhost:5000/',
});

export const addressRequest = axios.create({
    baseURL: 'https://provinces.open-api.vn/api/',
});
export default request;
