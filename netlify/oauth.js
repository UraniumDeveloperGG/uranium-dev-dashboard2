const CLIENT_ID = "1456318528377454624";
const CLIENT_SECRET = "7AG7LG9vyILlBQHITdjf0Y4_rO4aXNc7";
const REDIRECT_URI = "https://YOUR_NETLIFY_SITE.netlify.app/netlify/functions/oauth";

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: "Discord OAuth works!"
  };
};