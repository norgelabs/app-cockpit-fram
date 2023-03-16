import axios from 'axios';

export default class ClienteServices {
    constructor() {
        const cnn = this.axios = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Methods":"GET,PUT,POST,DELETE,PATCH,OPTIONS"
            }
        });
    }

    async get() {

        const { data } = await this.axios.get('/GetClientes');

        if(data){
            //console.log("retorno cliente api ", data);
            return data;
        }
        else
        {
            return null;
        }
    }

}