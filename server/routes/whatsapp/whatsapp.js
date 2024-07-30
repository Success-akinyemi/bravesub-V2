import { DisconnectReason, useMultiFileAuthState, makeWASocket } from '@whiskeysockets/baileys';
import useMongoDBAuthState from '../../model/useMongoDBAuthState.js';
import mongoose from 'mongoose';
import UserModel from '../../model/User.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import WhatsappChatModel from '../../model/WhatsappUserMsg.js';
import DataPlansModel from '../../model/DataPlans.js';

const braveLiteAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
// const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-pro' });
// const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-pro-vision' });
const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Declare variables to monitor the last chat of the bot and get the keywords, intercept message flow, and carry out transactions
// Data
let USERBUYDATA = '';
let USERBUYDATADATAPLAN = '';
let USERBUYDATAPHONENUMBER = '';
let USERBUYDATANETWORK = '';

// Airtime
let USERBUYAIRTIME = '';

const userPass = process.env.DEFAULT_PASSWORD;

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

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        try {
            if (type === 'notify') {
                if (!messages[0]?.key.fromMe) {
                    const captureMessage = messages[0]?.message?.conversation;
                    const numberWa = messages[0].key?.remoteJid;
                    const senderName = messages[0]?.pushName;
    
                    // Rest of your message handling logic...
    
                    const result = await chat.sendMessage(`... your message content ...`);
                    const response = await result.response;
                    const text = response.text();
                    console.log('MESSAGE FROM GEMINI:', text);
                    
                    // Extract JSON string if it exists
                    const jsonStart = text.indexOf("[");
                    const jsonEnd = text.indexOf("]");
                    let dataArray;
    
                    if (jsonStart !== -1 && jsonEnd !== -1) {
                        try {
                            const jsonString = text.substring(jsonStart, jsonEnd + 1);
                            console.log('JSON STRING', jsonString)
                            // Proper JSON formatting
                            const validJsonString = jsonString
                                .replace(/([A-Za-z0-9]+):/g, '"$1":') // Enclose keys in double quotes
                                .replace(/'/g, '"'); // Enclose string values in double quotes
    
                            console.log('JSON DATA INFO', validJsonString)
                            dataArray = JSON.parse(validJsonString);
                            console.log('DATA ARRAY INFO', dataArray)
    
                            // Assign values to the declared variables
                            USERBUYDATA = dataArray[0].USERBUYDATA;
                            USERBUYDATADATAPLAN = dataArray[0].USERBUYDATADATAPLAN;
                            USERBUYDATANETWORK = dataArray[0].USERBUYDATANETWORK;
                            USERBUYDATAPHONENUMBER = dataArray[0].USERBUYDATAPHONENUMBER;
    
                            // CALL FUNCTIONS BASED ON LET VARIABLES COMPLETIONS
                            if (USERBUYDATA === true && USERBUYDATADATAPLAN && USERBUYDATANETWORK && USERBUYDATAPHONENUMBER && formattedNumber) {
                                console.log('RESPONSE DATA', USERBUYDATA, '\n', USERBUYDATADATAPLAN, '\n', USERBUYDATANETWORK, '\n', USERBUYDATAPHONENUMBER, '\n', formattedNumber);
                            }
    
                            // Remove JSON array from the final message
                            const finalMessage = text.replace(jsonString, '').trim();
    
                            if (finalMessage) {
                                await sock.sendMessage(numberWa, {
                                    text: finalMessage,
                                });
                            }
                        } catch (error) {
                            console.error('Failed to parse JSON:', error);
                            await sock.sendMessage(numberWa, {
                                text: text,
                            });
                        }
                    } else {
                        // If no JSON string is found, send the original text
                        await sock.sendMessage(numberWa, {
                            text: text,
                        });
                    }
    
                    // Update chat history
                    findUserChat.history = chat.params.history;
                    await findUserChat.save();
                }
            }
        } catch (error) {
            console.log('UNABLE TO REPLY MESSAGE', error);
        }
    });
    

    sock.ev.on('creds.update', saveCreds);
}

connectionLogic();
