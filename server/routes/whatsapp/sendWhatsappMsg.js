import { DisconnectReason, useMultiFileAuthState, makeWASocket } from '@whiskeysockets/baileys';
import useMongoDBAuthState from '../../model/useMongoDBAuthState.js';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

const braveLiteAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
//const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-pro' });

export async function sendWhatsappMsg({phoneNumber, message, useAI}) {
    const collection = mongoose.connection.collection('auth_info_baileys');
    const { state, saveCreds } = await useMongoDBAuthState(collection);

    const number = phoneNumber
    console.log('sendWhatsappMsg NUMBER', phoneNumber)
    const newNumber = '234' + phoneNumber?.slice(1)
    const whatsappNumber = newNumber+'@s.whatsapp.net'

    let AIResponse;

    if(useAI){
        const query = `Based on this text: ${message} refactor and rewrite it to give a resonable output also add a corresponding emoji if neccessary`
        const prompt = await braveLite.generateContent(query)
        const response = await prompt.response;
        AIResponse = response.text();
    }

    const sock = makeWASocket({
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
                sendWhatsappMsg(whatsappNumber, useAI ? AIResponse : message); // Reconnect and resend the message
            }
        }
    });


    try {
        await sock.sendMessage(
            whatsappNumber,
            {
                text: useAI ? AIResponse : message,
            }
        );
    } catch (error) {
        console.log('UNABLE TO SEND DM MESSAGE', error);
        await sock.sendMessage(
            process.env.WHATSAPPNUMBER, 
            {
                text: `ERROR FORM WHATSAPP UNABLE TO SEND DM>>> '\n' ${error}`,
            }
        );
    }

    sock.ev.on('creds.update', saveCreds);
}
