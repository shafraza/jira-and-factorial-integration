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
    users = response.data;
    const filteredUsers = users.filter(user => user.accountType === 'atlassian');


    return filteredUsers;
  } catch (error) {
    console.log('error: ')


    console.log(error.response.data.errors)
  }
}
async function getSingleUser(accountId) {

  try {


    const config = {
      method: 'get',
      url: baseUrl + `/rest/api/2/user?accountId=${accountId}`,
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };
    const response = await axios.request(config);

   return response.data;
  } catch (error) {
    console.log('error: ')
    console.log(error.response)
  }
}
module.exports = {getUsers,getSingleUser};