const {  axios, auth, baseUrl, username, password, leadAccountID, projKey } = require('../jiraConfig/jiraConfig');


async function getUsers() {

  try {


    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/2/users',
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.log('error: ')
    console.log(error.response.data.errors)
  }
}

module.exports = {getUsers};