const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Initialize client
const client = new Client({
    authStrategy: new LocalAuth(), // persist session
    puppeteer: {
        headless: true, // run in cloud
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// ---------------- CONFIG ----------------
const MY_NAME = 'Jeswin';      // Bot reply
const TARGET_GROUP = 'Hi';     // Exact WhatsApp group name
const COOLDOWN = 1000 * 60 * 10; // 10 minutes
let lastReplyTime = 0;

// ---------------- QR CODE ----------------
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Scan this QR code in WhatsApp.');
});

// ---------------- READY ----------------
client.on('ready', () => {
    console.log('Bot is ready!');
});

// ---------------- MESSAGE HANDLER ----------------
client.on('message', async msg => {
    try {
        // Only group messages
        if (!msg.from.endsWith('@g.us')) return;

        // Ignore own messages
        if (msg.fromMe) return;

        const chat = await msg.getChat();

        // Only target group
        if (chat.name !== TARGET_GROUP) return;

        const text = msg.body.toLowerCase().trim();
        console.log(`Message in "${chat.name}": "${text}"`);

        // Keyword detection
        const isOTMessage = text.includes('ot') && text.includes('available');
        if (!isOTMessage) return;

        // Cooldown check
        const now = Date.now();
        if (now - lastReplyTime < COOLDOWN) {
            console.log('Cooldown active. Not replying.');
            return;
        }
        lastReplyTime = now;

        // Delay to appear human
        setTimeout(async () => {
            console.log(`Replying with: ${MY_NAME}`);
            await msg.reply(MY_NAME);
        }, 2000);

    } catch (err) {
        console.error('Error processing message:', err);
    }
});

// ---------------- INITIALIZE BOT ----------------
client.initialize();
