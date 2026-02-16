const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

const MY_NAME = 'Jeswin'; // 🔹 your name
const TARGET_GROUP = 'Hi'; // 🔹 exact group name

let lastReplyTime = 0;
//const COOLDOWN = 1000 * 60 * 10; 
//const COOLDOWN = 1000; // 1 second in ms
const COOLDOWN = 1000 * 60 * 60 * 24; // 24 hours in ms

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot is ready!');
});

// ------------------- MESSAGE HANDLER -------------------
client.on('message', async msg => {

    // only group messages
    if (!msg.from.endsWith('@g.us')) return;

    // ignore your own messages
    if (msg.fromMe) return;

    const chat = await msg.getChat();

    // only specific group
    if (chat.name !== TARGET_GROUP) return;

    const text = msg.body.toLowerCase().trim();

    // ----- DEBUG LOGS -----
    console.log(`\nMessage received in group "${chat.name}":`);
    console.log(`From: ${msg.author || msg.from}`);
    console.log(`Content: "${text}"`);

    // keyword detection
    const isOTMessage =
        text.includes('ot') &&
        text.includes('available');

    console.log(`Matches OT criteria: ${isOTMessage}`);

    if (!isOTMessage) return;

    // cooldown to avoid multiple replies
    const now = Date.now();
    if (now - lastReplyTime < COOLDOWN) {
        console.log('Cooldown active, not replying.');
        return;
    }

    lastReplyTime = now;

    // delay to look human
    setTimeout(async () => {
        console.log(`Replying with: ${MY_NAME}`);
        await msg.reply(MY_NAME);
    }, 2000);

});

client.initialize();
