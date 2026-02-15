const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

const MY_NAME = 'Jeswin'; // your bot reply
const TARGET_GROUP = 'Hi'; // exact WhatsApp group name

let lastReplyTime = 0;
const COOLDOWN = 1000 * 60 * 10; // 10 minutes

// Show QR in terminal
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Scan this QR code in WhatsApp.');
});

// Bot is ready
client.on('ready', () => {
    console.log('Bot is ready!');
});

// ---------------- MESSAGE HANDLER ----------------
client.on('message', async msg => {
    // Only group messages
    if (!msg.from.endsWith('@g.us')) return;

    // Ignore own messages
    if (msg.fromMe) return;

    const chat = await msg.getChat();

    // Only target group
    if (chat.name !== TARGET_GROUP) return;

    const text = msg.body.toLowerCase().trim();

    console.log(`Message in ${chat.name}: "${text}"`);

    // Detect keyword
    const isOTMessage = text.includes('ot') && text.includes('available');
    if (!isOTMessage) return;

    // Cooldown
    const now = Date.now();
    if (now - lastReplyTime < COOLDOWN) return;
    lastReplyTime = now;

    // Delay to look human
    setTimeout(async () => {
        console.log(`Replying with: ${MY_NAME}`);
        await msg.reply(MY_NAME);
    }, 2000);
});

// Initialize bot
client.initialize();
