import { DisconnectReason, useMultiFileAuthState, makeWASocket } from '@whiskeysockets/baileys';
import useMongoDBAuthState from '../../model/useMongoDBAuthState.js';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

const braveLiteAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
// const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-pro' });
const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function connectionLogic() {
    // For LOCALS
    // const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    // const collection = mongoose.connection.db('whatsapp_api').collection('auth_info_baileys')
    const collection = mongoose.connection.collection('auth_info_baileys');
    const { state, saveCreds } = await useMongoDBAuthState(collection);

    const sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true,
        auth: state,
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update || {};

        if (qr) {
            console.log(qr);
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect) {
                connectionLogic();
            }
        }
    });

    try {
        await sock.sendMessage(
            //phone number i will pass,
            {
                text: {/**mesdsage i will send */},
            }
        );
    } catch (error) {
        console.log('UNABLE TO SEND DM MESSAGE', error);
        await sock.sendMessage(
            process.env.WHATSAPPNUMBER, 
            {
            text: `ERROR FORM WHATSAPP UNABLE TO SEND DM>>> '\n' ${error}`,
        });
    }
    

    sock.ev.on('creds.update', saveCreds);
}

connectionLogic();