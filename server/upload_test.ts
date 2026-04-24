import { google } from 'googleapis';
import fs from 'fs';

async function upload() {
    console.log("Starting upload...");
    const credContent = JSON.parse(fs.readFileSync('./client_secret.json', 'utf8'));
    const creds = credContent.installed || credContent.web;
    const oauth2Client = new google.auth.OAuth2(creds.client_id, creds.client_secret, creds.redirect_uris[0]);
    
    const token = JSON.parse(fs.readFileSync('./youtube_token.json', 'utf8'));
    oauth2Client.setCredentials(token);
    
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    const res = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
            snippet: {
                title: "🔥 VORA AI Automated Trading Demo 🔥",
                description: "This is a live test of the VORA fully automated AI trader pipeline! Watch our bots execute trades in real-time. #Shorts #VoraFinance #AutoTrading",
                tags: ['Shorts', 'Trading', 'AI', 'Crypto'],
                categoryId: '27'
            },
            status: { privacyStatus: 'unlisted', selfDeclaredMadeForKids: false }
        },
        media: { body: fs.createReadStream('./standalone_test.mp4') }
    });
    console.log("\n=== UPLOAD SUCCESS ===");
    console.log("https://youtube.com/shorts/" + res.data.id);
}
upload().catch(console.error);
