let axios = require('axios');

let url = "http://localhost:3000"

const createSqlConn = (config) => {
    axios.post(`${url}/sql/connection`, config)
    .then(function (response) {
        console.log(response);
        return response;
    })
    .catch(function (error) {
        console.log(error);
        throw error;
    });
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
    axios.get(`${url}/sql/${connId}/tables`)
    .then(function (response) {
        console.log(response.data);
        return response.data;
    })
    .catch(function (error) {
        console.log(error);
        throw error;
    });
}


module.exports = {createSqlConn, postSqlQuery, getTables};