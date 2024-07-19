import { DisconnectReason, useMultiFileAuthState, makeWASocket } from '@whiskeysockets/baileys'
import useMongoDBAuthState from '../../model/useMongoDBAuthState.js';
import mongoose from 'mongoose';

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
                    const numberWa = messages[0].key?.remoteJid

                    const compareMessage = captureMessage.toLocaleLowerCase();

                    console.log('MESSAGE INFO>>>', captureMessage)

                    if(captureMessage === 'ping'){
                        await sock.sendMessage(
                            numberWa,
                            {
                                text: 'pong',
                            },
                            {
                                quoted: messages[0]
                            }
                        )
                    } 
                    if(captureMessage === 'hello'){
                        await sock.sendMessage(
                            numberWa,
                            {
                                text: 'yooo how are you',
                            },
                            {
                                quoted: messages[0]
                            }
                        )
                    } 
                }
            }
        } catch(error){
            console.log('UNABLE TO REPLY MESSAGE', error)
        }
        
        
    })


    sock.ev.on ('creds.update', saveCreds)
}

connectionLogic()