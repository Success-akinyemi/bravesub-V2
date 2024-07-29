import { DisconnectReason, useMultiFileAuthState, makeWASocket } from '@whiskeysockets/baileys'
import useMongoDBAuthState from '../../model/useMongoDBAuthState.js';
import mongoose from 'mongoose';
import UserModel from '../../model/User.js';
import { GoogleGenerativeAI } from '@google/generative-ai'
import WhatsappChatModel from '../../model/WhatsappUserMsg.js';

const braveLiteAI = new GoogleGenerativeAI(process.env.GEMINI_KEY)
//const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-pro' })
//const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-pro-vision' })
const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

//delare let variables monitor last chat of bot and get the key words intercept message flow and carry out transactions

const userPass = process.env.DEFAULT_PASSWORD

async function connectionLogic(){
    //For LOCALS
    //const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    //const collection = mongoose.connection.db('whatsapp_api').collection('auth_info_baileys')
    const collection = mongoose.connection.collection('auth_info_baileys');
    const { state, saveCreds } = await useMongoDBAuthState(collection)


    const sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true,
        auth: state
    })

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update || {};

        if(qr){
            console.log(qr)
        }

        if(connection === 'close'){
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut 
            
            if(shouldReconnect){
                connectionLogic()
            }
        }
    })

    sock.ev.on('messages.upsert', async ({messages, type}) => {
        try{
            if(type === 'notify'){
                if(!messages[0]?.key.fromMe){
                    const captureMessage = messages[0]?.message?.conversation;
                    //const captureMessage = messages[0]?.message?.imageMessage;

                    const numberWa = messages[0].key?.remoteJid
                    const senderName = messages[0]?.pushName

                    function getFormattedPhoneNumber(phoneNumber){
                        let formattedNumber = '0' + phoneNumber.slice(3, phoneNumber.indexOf('@'))

                        return formattedNumber
                    }

                    const formattedNumber = getFormattedPhoneNumber(numberWa)

                    const compareMessage = captureMessage.toLocaleLowerCase();

                    //console.log('MESSAGE INFO>>>', captureMessage, 'FROM>>>', senderName, 'NUMBER>>>', formattedNumber, 'MESAGES', messages)

                    //Check if number exist in db and save
                    const checkNumber = await UserModel.findOne({ mobile: formattedNumber })
                    if(!checkNumber){
                        const createUser = await UserModel.create({
                            mobile: formattedNumber, username: senderName, password: userPass, createdSource: 'whatsapp' 
                        })
                    }
                    const getUser = await UserModel.findOne({ mobile: formattedNumber })
                    const findChats = await WhatsappChatModel.findOne({ userId: checkNumber.mobile })
                    if(!findChats){
                        const createNewChat = await WhatsappChatModel.create({ userId: checkNumber.mobile })
                    }
                    const findUserChat = await WhatsappChatModel.findOne({ userId: checkNumber.mobile })

                    //AI
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
                        the information given to you is for you to use and process your reply must be good to keep the user going and continue using based on your conversation with the customer do not give out example of conversation as output it is a real life chat and you must continue to chat with user the information given to you is to make good decisions while chatting with the user
                    `);
                    const response = await result.response
                    const text = response.text()
                    if(text){
                        await sock.sendMessage(
                            numberWa,
                            {
                                text: `${text}`,
                            },
                        )
                    } 
                    findUserChat.history = chat.params.history
                    await findUserChat.save()
                }
            }
        } catch(error){
            console.log('UNABLE TO REPLY MESSAGE', error)
        }
        
        
    })


    sock.ev.on ('creds.update', saveCreds)
}

connectionLogic()