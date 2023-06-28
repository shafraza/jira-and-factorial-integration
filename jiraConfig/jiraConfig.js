var axios = require('axios');
require('dotenv').config();

const username = process.env.ATLASSIAN_USERNAME
const password = process.env.ATLASSIAN_API_KEY
const domain = process.env.DOMAIN
const leadAccountID = process.env.LEAD_ACCT_ID
const projKey = process.env.PROJECT_KEY
const auth = {
  username: username,
  password: password
};
const baseUrl = 'https://' + domain + '.atlassian.net';


module.exports = {
    axios,
    auth,
    baseUrl,
    username,
    password,
    leadAccountID,
    projKey

  };