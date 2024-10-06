const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
var base64 = require('js-base64').Base64;
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async');
const { setTimeout } = require('timers/promises'); // Import from timers/promises

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

async function getotp(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 15,
    });
    const messages = res.data.messages;
    if (!messages || messages.length === 0) {
        console.log('No messages found.');
        return;
    }




    let otp = null; // Declare the OTP variable

    for (const message of messages) {
        const currentemailid = message.id
        const currentemail = await gmail.users.messages.get({
            userId: 'me',
            id: currentemailid
        })



        const headers = currentemail.data.payload.headers
        console.log("Currently checking email with id : ", currentemailid)


        for (const item of headers) {
            if (item.name == 'Subject') {
                console.log('Subject Of Current Email :', item.value)
            }
            if (item.name == 'Subject' && item.value == 'transaction Password') {
                console.log(`this is a prabhu otp email`)
                const encodedmsg = currentemail.data.payload.body.data
                const decodedmsg = Buffer.from(encodedmsg, "base64").toString("ascii");

                const temp = decodedmsg.split("(OTP) is ")
                otp = temp[1].slice(0, 6)
                console.log("found the otp it's : ", otp)
                break;

            }



        }
        
        if (otp != null) {
            break;
        }


    }
    return otp
}









const otpFilePath = path.join(__dirname, 'most_recent_otp.txt');

async function getMostRecentOtp() {
    try {
        // Check if file exists by attempting to read it
        const otp = await fs.readFile(otpFilePath, 'utf8');
        return otp;
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File not found, return null
            return null;
        } else {
            console.error('Error reading most recent OTP:', error);
            return null;
        }
    }
}

// Utility function to save the most recent OTP to file asynchronously
async function saveMostRecentOtp(otp) {
    try {
        await fs.writeFile(otpFilePath, otp, 'utf8');
    } catch (error) {
        console.error('Error saving most recent OTP:', error);
    }
}

async function findotp() {
    try {
        let lastfetchedotp = null
        let returnvalue = null;
        const auth = await authorize();


        const startTime = Date.now();
        const maxTime = 300000;

        

        while (!returnvalue) {
            const otp = await getotp(auth); //marked line

            if (otp) {
                lastfetchedotp = await getMostRecentOtp()
         console.log("THIS IS THE LASTFETCHEDOTP RIGHT HERE",lastfetchedotp)
                if(lastfetchedotp == otp) {
                    console.log('Same OTP found, waiting for a new OTP...');
                }
                else
                {
                await saveMostRecentOtp(otp);
                console.log('OTP:', otp);
                returnvalue = otp;
                break;
                }
            }


            const elapsedTime = Date.now() - startTime;
            if (elapsedTime > maxTime) {
                console.log("Time limit exceeded, stopping OTP check.");
                break;
            }


            await setTimeout(6000);
        }

        return returnvalue;
    } catch (error) {
        console.error('Error fetching OTP:', error);
    }
}






module.exports = {
    authorize,
    getotp,
    findotp,
};
