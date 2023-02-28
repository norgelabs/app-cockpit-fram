import axios from 'axios';
import { split } from 'lodash';

import { addDays } from '../utils/formatTime';

export default class RentabilidadeServices {
    constructor() {
        const cnn = this.axios = axios.create({
            baseURL: "http://localhost:7142/api",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Methods":"GET,PUT,POST,DELETE,PATCH,OPTIONS"
            }
        });
    }

    async get(idCliente, tipo, dataInicial = null, dataFinal = null) {

        const { data } = await this.axios.get('/GetRentabilidade', {
            params: {
                idCliente: idCliente,
                tipo: tipo,
                dataInicial: dataInicial,
                dataFinal: dataFinal
            }
        });
        console.log("-------->>>>", data)
        if(data){
            return data;
        }
        else
        {
            return '-';
        }
    }

}