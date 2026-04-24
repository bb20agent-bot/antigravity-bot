import { google } from 'googleapis';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const TOKEN_PATH = './youtube_token.json';

const codeArg = process.argv[2];

fs.readFile('./client_secret.json', 'utf8', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content));
});

function authorize(credentials: any) {
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    // fallback redirect_uris if missing
    const r_uris = redirect_uris && redirect_uris.length ? redirect_uris : ["http://localhost"];
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, r_uris[0]);

    if (codeArg) {
        oAuth2Client.getToken(codeArg, (err: any, token: any) => {
            if (err) return console.error('Token Error:', err);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('🎉 youtube_token.json SUCCESS!');
            });
        });
    } else {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        fs.writeFileSync('auth_url.txt', authUrl);
        console.log('URL written to auth_url.txt');
    }
}
