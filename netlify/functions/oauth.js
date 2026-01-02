const fetch = require("node-fetch");

// === HARDCODED ALLOWED IDS ===
const allowedIDs = [
    "1386822974518198272",     // replace with your ID
    "1386822974518198272"   // replace with your sister's ID
];

// === Discord App Info ===
const clientId = "1456318528377454624";      
const clientSecret = "7AG7LG9vyILlBQHITdjf0Y4_rO4aXNc7"; 
const redirectUri = "https://uraniumdev.netlify.app/.netlify/functions/oauth"; 

exports.handler = async (event, context) => {
    const code = event.queryStringParameters?.code;

    // Step 1: redirect user to Discord login if no code yet
    if (!code) {
        return {
            statusCode: 302,
            headers: {
                Location: `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`
            }
        };
    }

    try {
        // Step 2: exchange code for access token
        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri,
                scope: "identify"
            })
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Step 3: get user info
        const userResponse = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const userData = await userResponse.json();
        const userID = userData.id;

        // Step 4: check if user is allowed
        if (!allowedIDs.includes(userID)) {
            return {
                statusCode: 403,
                body: "You are not allowed to access this dashboard."
            };
        }

        // Step 5: welcome allowed user
        return {
            statusCode: 200,
            body: `Welcome to Uranium.Dev Dashboard, ${userData.username}!`
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: "Something went wrong."
        };
    }
};