const {  axios, auth, baseUrl, username, password, leadAccountID, projKey } = require('../jiraConfig/jiraConfig');

async function getIssues() {

  try {


    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/2/search',
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

//creates an issue in Jira Cloud using REST API 
async function createIssue(projectKey, issueType, summary, description) {

  try {


    const data = {
      fields: {
        project: { key: projectKey },
        summary: summary,
        description: description,
        issuetype: { name: issueType }
      }
    };
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };
    const response = await axios.post(`${baseUrl}/rest/api/2/issue`, data, config);
    return response.data.key;

  } catch (error) {
    console.log('error: ')
    console.log(error.response.data.errors)
  }
}



async function getIssueByID(issueKey) {

  try {


    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/2/issue/' + issueKey,
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

async function deleteIssueByID(issueKey) {

  try {


    const config = {
      method: 'delete',
      url: baseUrl + '/rest/api/2/issue/' + issueKey,
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

module.exports = {createIssue, getIssueByID, getIssues, deleteIssueByID};