const {  axios, auth, baseUrl, username, password, leadAccountID, projKey } = require('../jiraConfig/jiraConfig');

async function getProjects() {

  try {

    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/3/project/recent',
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


async function createProject(projectName) {

  try {

 

    //Body to pass into POST REST API Request
    const data = {
      key: projKey,
      name: projectName,
      projectTypeKey: 'software',
      "leadAccountId": leadAccountID
    };

    //Auth is our username and API Key
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };
    //use axios to make post request
    const response = await axios.post(`${baseUrl}/rest/api/3/project`, data, config);
    return response.data.key;

  } catch (error) {
    console.log('error: ')
    console.log(error.response.data.errors)
  }

}

module.exports = {createProject, getProjects};