const { google } = require('googleapis');
//const fs = require('fs');

// const credentials = JSON.parse(fs.readFileSync('client_secret.json'));
// const { client_secret, client_id, redirect_uris } = credentials.web;

// const oAuth2Client = new google.auth.OAuth2(
//   client_id, client_secret, redirect_uris[0]
// );

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

module.exports = {
  oAuth2Client
};