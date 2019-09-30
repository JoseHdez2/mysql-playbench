let axios = require('axios');

const postSqlQuery = (request) => {
    axios.post('/user', {
        'query': request
    })
    .then(function (response) {
        console.log(response);
        return response;
    })
    .catch(function (error) {
        console.log(error);
        throw error;
    });
}