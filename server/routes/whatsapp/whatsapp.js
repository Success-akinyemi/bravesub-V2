import { DisconnectReason, useMultiFileAuthState, makeWASocket } from '@whiskeysockets/baileys'
import useMongoDBAuthState from '../../model/useMongoDBAuthState.js';
import mongoose from 'mongoose';

async function connectionLogic(){
    //For LOCALS
    //const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const collection = mongoose.connection.db('whatsapp_api').collection('auth_info_baileys')
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

    sock.ev.on('messages.upsert', (messageInfo) => {
        console.log('MESSAGE INFO>>>', messageInfo)
    })


    sock.ev.on ('creds.update', saveCreds)
}

connectionLogic()