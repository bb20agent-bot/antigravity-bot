import axios from 'axios';

const bots = [
    { name: "BrownCTO", token: "8622279821:AAGuzheInoadpUpOdb8hvhkM8rJY1eXBHf0" },
    { name: "JoyCMO", token: "8267087384:AAFLLwirNsA1yK7e5amYtQ77wMxM6uEbG-E" }
];

const WEB_APP_URL = "https://voramini.com/app";

async function setupBots() {
    for (const bot of bots) {
        console.log(`Setting up ${bot.name}...`);
        try {
            // Set Menu Button
            await axios.post(`https://api.telegram.org/bot${bot.token}/setChatMenuButton`, {
                menu_button: {
                    type: "web_app",
                    text: "Open VORA",
                    web_app: { url: WEB_APP_URL }
                }
            });
            console.log(`✅ ${bot.name} Menu Button Set!`);
        } catch (e) {
            console.error(`❌ Failed to set ${bot.name} button:`, e.response?.data || e.message);
        }
    }
}

setupBots();
