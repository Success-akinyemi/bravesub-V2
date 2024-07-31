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
let USERBUYDATA = false;
let USERBUYDATADATAPLAN = null;
let USERBUYDATAPHONENUMBER = null;
let USERBUYDATANETWORK = null;

// Airtime
let USERBUYAIRTIME = null;
let USERBUYAIRTIMEAMOUNT = null;
let USERBUYAIRTIMEPHONENUMBER = null
let USERBUYAIRTIMENETWORK = null

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
                    function getFormattedPhoneNumber(phoneNumber) {
                        let formattedNumber = '0' + phoneNumber.slice(3, phoneNumber.indexOf('@'));
                        return formattedNumber;
                    }
    
                    const formattedNumber = getFormattedPhoneNumber(numberWa);
                    const compareMessage = captureMessage.toLocaleLowerCase();
    
                    const checkNumber = await UserModel.findOne({ mobile: formattedNumber });
                    if (!checkNumber) {
                        await UserModel.create({
                            mobile: formattedNumber, username: senderName, password: userPass, createdSource: 'whatsapp', email: `${formattedNumber}@gmail.com`
                        });
                    }
    
                    const getUser = await UserModel.findOne({ mobile: formattedNumber });
                    const findChats = await WhatsappChatModel.findOne({ userId: formattedNumber });
                    const dataPlans = await DataPlansModel.find();
    
                    if (!findChats) {
                        await WhatsappChatModel.create({ userId: formattedNumber });
                    }
    
                    const findUserChat = await WhatsappChatModel.findOne({ userId: formattedNumber });
    
                    const chat = braveLite.startChat({
                        history: findUserChat.history,
                        generationConfig: {
                            maxOutputTokens: 1000,
                        },
                    });
    
                    const result = await chat.sendMessage(`
                        you are a sales rep for a company name Bravesub. a company that sells mobile airtime, internet data, buy cable tv subscription, and pay electricity bill. 
                        and and your name is BraveLite you are to maintain a quality chat with our users and their chat histroy you have with them. this is the new message: ${captureMessage}. 
                        the customer username is ${senderName} and a object of the database infomation in object form is ${getUser}. 
                        the information given to you is for you to use and process your reply must be good to keep the user going and continue using based on your conversation with the customer do not give out example of conversation as output it is a real life chat and you must continue to chat with user the information given to you is to make good decisions while chatting with the user.
                        
                        for buying of data our networks are: MTN, AIRTEL, GLO, 9Mobile, and Smile. the array of all our availble data plans are: ${dataPlans} to render data plans to the user when needed format the response from the array to the user. show only data plans of the network the user chooses showing the planName planType and then the price for each data plan as well as with the discountAllowed 
                        and important also analyze the the user chat to know what the user whats the service be rendered.
                        if you analyze and the user want to buy data in your response set:
                        an object in this form { USERBUYDATA: 'set to true after you have confirm from the user they want to proceed with the data purchase', USERBUYDATADATAPLAN: 'the dataCode same with the data plan the user choose', USERBUYDATANETWORK: 'the networkCode same with the data plan the user choose', USERBUYDATAPHONENUMBER: 'the phone number the user want to buy for' } only put the array in your response when you have analyze and collected the infomation for the array 
                    
                        for airtime our networks are: MTN code: 1, AIRTEL code: 2, GLO code: 3, 9Mobile code: 4, send only the network to the user you will use the code to assign which network the user picks.
                        ask for the amount of airtime the user wants to buy minimium of 50 naira and maximium of 50,000 naira. ask for the phone Number also the user wants to buy for
                        if you analyze and the user want to buy airtime in your response set:
                        an object in this form { USERBUYAIRTIME: 'set to true after you have confirm from the user they want to proceed with the airtime purchase', USERBUYAIRTIMEAMOUNT: 'the amount of airtime the user wants to buy', USERBUYAIRTIMENETWORK: 'the code that correspond with the network the user chooses', USERBUYAIRTIMEPHONENUMBER: 'the phone number the user want to buy for' } only put the array in your response when you have analyze and collected the infomation for the array 
                    
                    `);
                    const response = await result.response;
                    const text = response.text();
                    console.log('MESSAGE FROM GEMINI:', text);
                    
                    // Extract JSON string if it exists
                    const jsonStart = text.indexOf("{");
                    const jsonEnd = text.indexOf("}");
                    let trimmedMsg;
    
                    if (jsonStart !== -1 && jsonEnd !== -1) {
                        try {
                            let jsonString = text.substring(jsonStart, jsonEnd + 1);
                            trimmedMsg = text.substring(jsonStart, jsonEnd + 1);

                            console.log('JSON STRING OBJECT', jsonString)
                            //convert to proper json
                            jsonString = jsonString
                            .replace(/(\w+):/g, '"$1":')        
                            .replace(/'/g, '"'); 
                            console.log('PROPER JSON', jsonString)
                            const jsonObject = JSON.parse(jsonString);
                            // Assign values to the declared variables of data
                            USERBUYDATA = jsonObject.USERBUYDATA;
                            USERBUYDATADATAPLAN = jsonObject.USERBUYDATADATAPLAN;
                            USERBUYDATANETWORK = jsonObject.USERBUYDATANETWORK;
                            USERBUYDATAPHONENUMBER = jsonObject.USERBUYDATAPHONENUMBER;
                            
                            // Assign values to the declared variables of airtime
                            USERBUYAIRTIME = jsonObject.USERBUYAIRTIME
                            USERBUYAIRTIMEAMOUNT = jsonObject.USERBUYAIRTIMEAMOUNT
                            USERBUYAIRTIMEPHONENUMBER = jsonObject.USERBUYAIRTIMEPHONENUMBER
                            USERBUYAIRTIMENETWORK = jsonObject.USERBUYAIRTIMENETWORK

                            // CALL FUNCTIONS BASED ON LET VARIABLES COMPLETIONS (DATA)
                            if (USERBUYDATA === true && USERBUYDATADATAPLAN !== null && USERBUYDATANETWORK !== null && USERBUYDATAPHONENUMBER !== null && formattedNumber !== '') {
                                console.log('RESPONSE DATA (DATA)', USERBUYDATA, '\n', USERBUYDATADATAPLAN, '\n', USERBUYDATANETWORK, '\n', USERBUYDATAPHONENUMBER, '\n', formattedNumber);
                            }

                            // CALL FUNCTIONS BASED ON LET VARIABLES COMPLETIONS (DATA)
                            if (USERBUYAIRTIME === true && USERBUYAIRTIMEAMOUNT !== null && USERBUYAIRTIMEPHONENUMBER !== null && USERBUYAIRTIMENETWORK !== null && formattedNumber !== '') {
                                console.log('RESPONSE DATA (AIRTIME)', USERBUYAIRTIME, '\n', USERBUYAIRTIMEAMOUNT, '\n', USERBUYAIRTIMEPHONENUMBER, '\n', USERBUYAIRTIMENETWORK, '\n', formattedNumber);
                            }
    
                            // Remove JSON array from the final message
                            const finalMessage = text.replace(trimmedMsg, '').trim();
    
                            if (finalMessage) {
                                await sock.sendMessage(
                                    numberWa, 
                                    {
                                        text: finalMessage,
                                    }
                                );
                            }
                        } catch (error) {
                            console.error('Failed to parse JSON:', error);
                            await sock.sendMessage(numberWa, {
                                text: text,
                            });
                        }
                    } else {
                        // If no JSON string is found, send the original text
                        await sock.sendMessage(
                            numberWa, 
                            {
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
