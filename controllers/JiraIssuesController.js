
const {  axios, auth, baseUrl, username, password, leadAccountID, projKey } = require('../jiraConfig/jiraConfig');
const JiraUsersController = require('./JiraUsersController.js');
const JiraProjectsController = require('./JiraProjectsController');

function getCurrentDate() {
  const today = new Date();
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Europe/Dublin'
  };
  const [day, month, year] = today.toLocaleDateString('en-GB', options).split('/');
  const currentDate = `${year}-${month}-${day}`;
  return currentDate;
}




async function getIssues() {


  try {


    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/2/search',
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };
    const response = await axios.request(config);
    return response.data.issues; 
  } catch (error) {
    console.log('error: ')
    console.log(error.response.data.errors)
  }
}


/////



// async function getIssuesByProjectKey(projectKey) {
//   try {
//     const config = {
//       method: 'get',
//       url: `${baseUrl}/rest/api/2/search`,
//       headers: { 'Content-Type': 'application/json' },
//       auth: auth,
//       params: {
//         jql: `project=${projectKey}` // Filter issues by project key
//       }
//     };

//     const response = await axios.request(config);
//     return response.data.issues;
//   } catch (error) {
//     console.log('Error: ');
//     console.log(error.response.data.errors);
//     throw error;
//   }
// }





////


// const axios = require('axios');

async function searchIssuesInJira(projectKey) {

  const jiraBaseUrl = 'https://refinestudio.atlassian.net';
  const jqlQuery = `project=${projectKey} AND  status != "Done"`;


  try {
    const response = await axios.get(`${jiraBaseUrl}/rest/api/2/search`, {
      auth: {
        username: process.env.ATLASSIAN_USERNAME,
        password: process.env.ATLASSIAN_API_KEY
      },
      params: {
        jql: jqlQuery
      }
    });

    return response.data.issues;
  } catch (error) {
    if (error.response) {
      // Request was made and server responded with a status code
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Error setting up the request
      console.error('Error:', error.message);
    }

    throw error; // Rethrow the error to be handled by the caller
  }
}


///





async function getIssuesByUsersInAllProjects(deadlineParam = null) {
  try {
    const projects = await JiraProjectsController.getProjects(); // Call the getprojects function to retrieve all projects
    const users = await JiraUsersController.getUsers(); // Call the getusers function to retrieve all users

    const issuesByUser = {};

    for (const project of projects) {
      const issues = await searchIssuesInJira(project.key); // Call the getissues function for each project

      for (const issue of issues) 
      {
        const assignee = issue.fields.assignee;
        let deadline = '';
        let approvedHours = '';

        if (assignee) {
          const assigneeID = assignee.accountId;

          if (!issuesByUser[assigneeID]) {
            issuesByUser[assigneeID] = [];
          }
        if(project.key == 'ASTR'){
             deadline =  issue.fields.customfield_10074
             approvedHours = issue.fields.customfield_10075

        }
        else  if(project.key == 'VS121'){
            deadline =  issue.fields.customfield_10101
            approvedHours = issue.fields.customfield_10100
        }   
        else  if(project.key == 'CAD'){
            deadline =  issue.fields.customfield_10066
            approvedHours = issue.fields.customfield_10067
        }
        else  if(project.key == 'L2D'){
          deadline =  issue.fields.customfield_10089
          approvedHours = issue.fields.customfield_10090
      }
      else  if(project.key == 'CR'){
        deadline =  issue.fields.customfield_10047
        approvedHours = issue.fields.customfield_10081
    }
      else{
          deadline =  null,
          approvedHours = null

        }

        if (deadlineParam && deadline !== deadlineParam) {
          continue; // Skip the current issue if the deadline doesn't match
        }else{
          issuesByUser[assigneeID].push({
            issueKey: issue.key,
            projectKey: project.key,
            summary: issue.fields.summary,
            description: issue.fields.description,
            approvedHours: approvedHours,
            deadline: deadline

          });
        }
        }
      }
    }

    return issuesByUser;
  } catch (error) {
    console.log('Error: ');
    console.log(error);
    throw error;
  }
}


// async function getTodayStats(){

//   const todayDate= getCurrentDate();
//   const userWiseIssues = await getIssuesByUsersInAllProjects(todayDate);
//   const statsByUser = {}

//   for (const key in userWiseIssues) {
//        let user =  await JiraUsersController.getSingleUser(key);
//        let UserDisplayName = user.displayName;
//        statsByUser[UserDisplayName] = [];
//        let sumApprovedHours = 0;

//        const issues = userWiseIssues[key];
//        for (const issue of issues) {
//         sumApprovedHours += issue.approvedHours;
//       }

//     if(sumApprovedHours > 0){
//       statsByUser[UserDisplayName].push({
//         todayHours: sumApprovedHours,
//       });
//     }


//   }
  
//   return statsByUser;



//   // const filteredUserWiseIssuesByToday = userWiseIssues.filter(issue => issue.deadline === "2023-07-10");

//   // const users = await JiraUsersController.getUsers(); // Call the getusers function to retrieve all users




 
// }


async function getTodayStats() {
  const todayDate = getCurrentDate();
  console.log("today data", todayDate);
  const userWiseIssues = await getIssuesByUsersInAllProjects(todayDate);
  const statsByUser = {};

  for (const key in userWiseIssues) {
    let user = await JiraUsersController.getSingleUser(key);
    let userDisplayName = user.displayName;
    let sumApprovedHours = 0;

    const issues = userWiseIssues[key];
    for (const issue of issues) {
      sumApprovedHours += issue.approvedHours;
    }

    if (sumApprovedHours > 0) {
      statsByUser[userDisplayName] = {
        todayHours: sumApprovedHours
      };
    }
  }

  return statsByUser;
}


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

module.exports = {createIssue, getIssueByID, getIssues, deleteIssueByID, getIssuesByUsersInAllProjects, getTodayStats, searchIssuesInJira};