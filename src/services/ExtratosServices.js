import axios from 'axios';

export default class ExtratosServices {
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

    async getExtrato(idCliente, periodo, dataInicial = null, dataFinal = null) {

        // console.log("idCliente >>>> ", idCliente);
        // console.log("periodo >>>> ", periodo);
        const { data } = await this.axios.get('/GetExtrato', {
            params: {
                idCliente: idCliente,
                periodo: periodo,
                dataInicial: dataInicial,
                dataFinal: dataFinal
            }
        });
        //console.log("-> ", data)
        if(data){
            return data;
        }
        else
        {
            return null;
        }
    }

    async getLancamentosFuturos(idCliente) {

        console.log("idCliente >>>> ", idCliente);
        
        const { data } = await this.axios.get('/GetLancamentosFuturos', {
            params: {
                idCliente: idCliente
            }
        });

        console.log("-> ", data)
        
        if(data){
            return data;
        }
        else
        {
            return null;
        }
    }

}