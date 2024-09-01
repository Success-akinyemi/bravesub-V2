import { DisconnectReason, useMultiFileAuthState, makeWASocket } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'

async function connectionLogic() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state
    });

    sock.ev.on('connection.update', async (update) => {
        console.log('Connection Update:', update);
        const { connection, lastDisconnect, qr } = update || {};

        if (qr) {
            console.log('QR Code Data:', qr);
        }

        if (connection === 'close') {
            console.error('Connection closed:', lastDisconnect);
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            
            if (shouldReconnect) {
                console.log('Attempting to reconnect...');
                setTimeout(() => connectionLogic(), 5000); 
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

connectionLogic();
