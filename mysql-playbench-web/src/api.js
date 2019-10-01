let axios = require('axios');

let url = "http://localhost:3000"

const createSqlConn = async (config) => {
    try {
        return axios.post(`${url}/sql/connection`, config)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const postSqlQuery = async (connId, request) => {
    axios.post(`${url}/sql/${connId}/query`, {
        'query': request
    })
    .then(function (response) {
        console.log(response.data);
        return response.data;
    })
    .catch(function (error) {
        console.log(error);
        throw error;
    });
}


const getTables = async (connId) => {
    try {
        return axios.get(`${url}/sql/${connId}/tables`)
    } catch (error) {
        console.log(error);
        throw error;
    }
}


module.exports = {createSqlConn, postSqlQuery, getTables};