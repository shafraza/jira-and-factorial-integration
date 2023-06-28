const express = require('express');
const app = express();

require('dotenv').config();
// 
const JiraIssuesController = require('./controllers/JiraIssuesController.js');
const JiraProjectsController = require('./controllers/JiraProjectsController.js');
const JiraTransitionsController = require('./controllers/JiraTransitionsController.js');
const JiraUsersController = require('./controllers/JiraUsersController.js');




const getRecentProjects = async () => {
  const recentProjects = await JiraProjectsController.getProjects();
  return recentProjects;
}

const getIssuesFunc = async () => {
  const issues = await JiraIssuesController.getIssues();
  return issues;
}


const getTransitionsFunc = async (issueKey) => {
  const transitions = await JiraTransitionsController.getTransitions(issueKey);
  return transitions;
}

const getIssueByIDFunc = async (issueKey) => {
  const issue = await JiraIssuesController.getIssueByID(issueKey);
  return issue;
}

const deleteIssueByIDFunc = async (issueKey) => {
  const issue = await JiraIssuesController.deleteIssueByID(issueKey);
  return issue;
}

const getUsersFunc = async () => {
  const users = await JiraUsersController.getUsers();
  return users;
}


app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsersFunc();
    res.status(200).json(users);

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to get issue' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await getRecentProjects();
    res.status(200).json(projects);

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to get issue' });
  }
});


app.get('/api/issues', async (req, res) => {
  try {
    const issues = await getIssuesFunc();
    res.status(200).json(issues);

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to get issue' });
  }
});
app.get('/api/issues/:issueKey', async (req, res) => {
  try {
    const issueKey = req.params.issueKey;
    const issue = await getIssueByIDFunc(issueKey);
    res.status(200).json(issue);

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to get issue' });
  }
});


app.get('/api/issues/transitions/:issueKey', async (req, res) => {
  try {
    const issueKey = req.params.issueKey;
    const transition = await getTransitionsFunc(issueKey);
    res.status(200).json(transition);

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to get issue' });
  }
});

app.get('/api/issues/delete/:issueKey', async (req, res) => {
  try {
    const issueKey = req.params.issueKey;
    const issue = await deleteIssueByIDFunc(issueKey);
    res.status(200).json(`Successfully deleted issue with key: ${issueKey}`);

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to get issue' });
  }
});

app.get('/', async (req, res) => {
  res.status(200).json("Hello World !!! Your Jira and Factorialhr integration service is live");

});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


app.post('/api/factorial/create-task', async (req, res) => {
  try {

   
    const axios = require('axios');

const url = 'https://api.factorialhr.com/api/v1/core/tasks';
const apiKey = '93c88f905bfa76fa56d985bdf533e19400f78de732344df8e314eb735ea42c81';

const data = {
  name: 'Task Create By Jira Automation',
  due_on: '2023-07-18',
  content: 'I am the task created by Jira Automation',
};

const headers = {
  'x-api-key': apiKey
};

axios.post(url, data, { headers })
  .then(response => {

    res.status(200).json(`Task Created Successfully: ${response.data.name}`);
  })
  .catch(error => {
    console.error('Error creating task:', error.response.data);
  });



  } catch (error) {
    console.error('Error:', error.message);
  }
});
