import { DisconnectReason, useMultiFileAuthState, makeWASocket } from '@whiskeysockets/baileys';
import useMongoDBAuthState from '../../model/useMongoDBAuthState.js';
import mongoose from 'mongoose';
import UserModel from '../../model/User.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import WhatsappChatModel from '../../model/WhatsappUserMsg.js';
import DataPlansModel from '../../model/DataPlans.js';
import * as controllers from '../../controllers/whatsapp/whatsapp.controllers.js'
import schedule from 'node-schedule'
import qrcode from 'qrcode-terminal'

const braveLiteAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
//const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-pro' });
// const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-pro-vision' });
const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

// Declare variables to monitor the last chat of the bot and get the keywords, intercept message flow, and carry out transactions
let USECASHBACK = false;

// Data
let USERBUYDATA = false;
let USERBUYDATADATAPLAN = null;
let USERBUYDATAPHONENUMBER = null;
let USERBUYDATANETWORK = null;

// Airtime
let USERBUYAIRTIME = false;
let USERBUYAIRTIMEAMOUNT = null;
let USERBUYAIRTIMEPHONENUMBER = null
let USERBUYAIRTIMENETWORK = null

//fund account
let USERFUNDACCOUNT = false
let USERFUNDACCOUNTAMOUNT = null

//referal
let USERREFERRED = false
let USERREFERREE = null

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
            console.log('QR CODE DATA',qr);
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
                    console.log('WHATSAPPNUMBER', numberWa)
                    const senderName = messages[0]?.pushName;
                    function getFormattedPhoneNumber(phoneNumber) {
                        let formattedNumber = '0' + phoneNumber.slice(3, phoneNumber.indexOf('@'));
                        return formattedNumber;
                    }
    
                    const formattedNumber = getFormattedPhoneNumber(numberWa);
                    //const compareMessage = captureMessage.toLocaleLowerCase();
                    
                    let checkNumber
                    const checkMobile = await UserModel.findOne({ mobile: formattedNumber });
                    const checkNumberWhatsappNumber = await UserModel.findOne({ whatsappNumber: formattedNumber });
                    checkNumber = checkMobile ? checkMobile : checkNumberWhatsappNumber
                    if (!checkNumber) {
                        const newUser = await UserModel.create({
                            mobile: formattedNumber, username: senderName, password: userPass, createdSource: 'whatsapp', email: `${formattedNumber}@gmail.com`, verified: true, whatsappNumber: formattedNumber
                        });
                        
                        //create a whatsapp referal link for user
                        const whatsRefLink = `https://wa.me/2349033626014?text=Hello%20BraveLite%20I%20was%20referred%20by%20userId%3A${newUser._id}`
                        newUser.whatsappReferralLink = whatsRefLink;
                        await newUser.save();

                        const referralLink = `${process.env.CLIENT_URL}/register?ref=${newUser._id}`;
                        newUser.referralLink = referralLink;
                        await newUser.save();
                    }
                    /**
                     * 
                    if(!checkNumber.referralLink){
                        const referralLink = `${process.env.CLIENT_URL}/register?ref=${checkNumber._id}`;
                        checkNumber.referralLink = referralLink;
                        await checkNumber.save();   
                    }
                    if(!checkNumber.whatsappReferralLink){
                        const whatsRefLink = `https://wa.me/2349033626014?text=Hello%20BraveLite%20I%20was%20referred%20by%20userId%3A${checkNumber._id}`
                        checkNumber.whatsappReferralLink = whatsRefLink;
                        await checkNumber.save();
                    }
                     */
    
                    const getUser = await UserModel.findOne({ mobile: formattedNumber });
                    const findChats = await WhatsappChatModel.findOne({ userId: formattedNumber });
                    const dataPlans = await DataPlansModel.find();
    
                    if (!findChats) {
                        await WhatsappChatModel.create({ userId: formattedNumber });
                    }
    
                    const findUserChat = await WhatsappChatModel.findOne({ userId: formattedNumber });
                    if(findUserChat){
                        console.log('USERR CHAT FOUND', findUserChat.userId)
                    }
                    const chat = braveLite.startChat({
                        history: findUserChat.history,
                        generationConfig: {
                            maxOutputTokens: 1000,
                        },
                    });

                    const firstPrompt = `
                        you are a sales rep for a company name Bravesub. a company that sells mobile airtime, internet data, buy cable tv subscription, and pay electricity bill. 
                        and and your name is BraveLite you are to maintain a quality chat with our users and their chat histroy you have with them. this is the new and current user message: ${captureMessage}. 
                        the customer username is ${getUser?.username ? getUser?.username : senderName} and a object of the database infomation of the customer in object form is ${getUser}. 
                        the information given to you is for you to use and process. your reply must be good to keep the user going and continue using based on your conversation with the customer do NOT give out example of conversation as output it is a real life chat and you must continue to chat with user the information given to you is to make good decisions while chatting with the user.
                        DO NOT GIVE OUT CHAT EXAMPLES AS OUTPUT, ONLY REPLY TO THE USER MESSAGE SENT TO YOU ONLY.
                        
                        for buying of data our networks are: MTN, AIRTEL, GLO, 9Mobile, and Smile. the array of all our availble data plans are: ${dataPlans} to render data plans to the user when needed format the response from the array to the user. show only data plans of the network the user chooses showing the planName planType and then the price for each data plan as well as with the cashBack the user will get added to their cashPoint. if a network is not in the array and a user asked for just tell them it is not available.
                        and important also analyze the the user chat to know what the user whats the service be rendered.
                        if you analyze and the user want to buy data in your response set:
                        an object in this form { USERBUYDATA: 'set to true after you have confirm from the user they want to proceed with the data purchase and the user has enough acctBalance to pay for the price or enough cashPoint to pay. if not enough funds tell the user they have insuffcient with their current acctBalance funds and will they like to fund their account', USERBUYDATADATAPLAN: 'the dataCode same with the data plan the user choose', USERBUYDATANETWORK: 'the networkCode same with the data plan the user choose', USERBUYDATAPHONENUMBER: 'the phone number the user want to buy for always ask for it', USECASHBACK: 'set to true if the user wants to use their cash point balance to pay for the service' } only put the array in your response when you have analyze and collected the infomation for the array 
                        then tell them to please wait a moment while you process their request

                        for airtime our networks are: MTN code: 1, AIRTEL code: 2, GLO code: 3, 9Mobile code: 4, send only the network to the user you will use the code to assign which network the user picks.
                        ask for the amount of airtime the user wants to buy minimium of 50 naira and maximium of 50,000 naira. ask for the phone Number also the user wants to buy for
                        if you analyze and the user want to buy airtime in your response set:
                        an object in this form { USERBUYAIRTIME: 'set to true after you have confirm from the user they want to proceed with the airtime purchase and the user has enough acctBalance to pay for the price or enough cashPoint to pay. if not enough funds tell the user they have insuffcient with their current acctBalance funds and will they like to fund their account', USERBUYAIRTIMEAMOUNT: 'the amount of airtime the user wants to buy', USERBUYAIRTIMENETWORK: 'the code that correspond with the network the user chooses', USERBUYAIRTIMEPHONENUMBER: 'the phone number the user want to buy for always ask for it', USECASHBACK: 'set to true if the user wants to use their cash point balance to pay for the service' } only put the array in your response when you have analyze and collected the infomation for the array 
                        then tell them to please wait a moment while you process their request

                        if you analyze and the user want to fund their account in your response set:
                        an object in this form { USERFUNDACCOUNT: 'set to true after you have confirm the user want to fund their account', USERFUNDACCOUNTAMOUNT: 'the amount the user wants to fund their account with ask them for it'  }
                        then tell them to please wait a moment while you process their request. you do not have any other payment method only ask for the data needed to fill the json
                    
                        if you analyze and the user message talks about been reffered by someone their message will contain the userId of the person that referred the in your response set:
                        an object in this form { USERREFERRED: true, USERREFERREE: 'the userId of the person that referred them contain in the message'  }

                        before finalyzing the json of any service the user want always ensure the user has enough balance in their account balance to pay for the services or if their cashPoint balance is enough to pay for the service ask them if they want to use their cashPoint balance
                        some few this to know should incase a customers ask;
                        - an account has been created for them the very moment the start to chat with you.
                        - the comapany website link is: ${process.env.CLIENT_URL}
                        - the login link is: ${process.env.CLIENT_URL}/login
                        - the signup link is: ${process.env.CLIENT_URL}/register
                        - they can do all the service they need just by chatting with you
                    `

                    const secondPrompt = `
                        based on your very first prompt given to you in the chat histroy to work with it, the current customer details in object form is: ${getUser} and customer username is ${senderName} continue workig with the first prompt as guide also with the current updated data. the new customer message is: ${captureMessage}
                        always remember to keep track of the conversation and analyze the chat to fill the corresponding json object appropriately as stated in the first prompt
                    `
    
                    const result = await chat.sendMessage(findUserChat.history.length > 0 ? secondPrompt : firstPrompt );
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
                            USECASHBACK = jsonObject.USECASHBACK

                            // Assign values to the declared variables of airtime
                            USERBUYAIRTIME = jsonObject.USERBUYAIRTIME
                            USERBUYAIRTIMEAMOUNT = jsonObject.USERBUYAIRTIMEAMOUNT
                            USERBUYAIRTIMEPHONENUMBER = jsonObject.USERBUYAIRTIMEPHONENUMBER
                            USERBUYAIRTIMENETWORK = jsonObject.USERBUYAIRTIMENETWORK
                            USECASHBACK = jsonObject.USECASHBACK

                            // Assign values to the declared variables of account funding
                            USERFUNDACCOUNT = jsonObject.USERFUNDACCOUNT
                            USERFUNDACCOUNTAMOUNT = jsonObject.USERFUNDACCOUNTAMOUNT

                            // Assign values to the declared variables of account funding
                            USERREFERRED = jsonObject.USERREFERRED
                            USERREFERREE = jsonObject.USERREFERREE

                            // CALL FUNCTIONS BASED ON LET VARIABLES COMPLETIONS (DATA)
                            async function handleData(){
                                if (USERBUYDATA === true && (USERBUYDATADATAPLAN !== null && USERBUYDATADATAPLAN !== '') && (USERBUYDATANETWORK !== null && USERBUYDATANETWORK !==  '') && (USERBUYDATAPHONENUMBER !== null && USERBUYDATAPHONENUMBER !== '') && formattedNumber !== '') {
                                    console.log('RESPONSE DATA (DATA)', USERBUYDATA, '\n', USERBUYDATADATAPLAN, '\n', USERBUYDATANETWORK, '\n', USERBUYDATAPHONENUMBER, '\n', formattedNumber);
                                    try {
                                        const responseMsg = await controllers.buyData({
                                            userConfirm:USERBUYDATA,
                                            planCode: USERBUYDATADATAPLAN,
                                            networkCode: USERBUYDATANETWORK,
                                            phoneNumber: USERBUYDATAPHONENUMBER,
                                            userId: formattedNumber,
                                            useCashBack: USECASHBACK
                                        })
                                        console.log('DATA RESPONSE MESSAGE>>>:', responseMsg);
                                        await sock.sendMessage(
                                            numberWa,
                                            {
                                                text: responseMsg,
                                            }
                                        );
                                        USERBUYDATA = false;
                                        USERBUYDATADATAPLAN = null;
                                        USERBUYDATAPHONENUMBER = null;
                                        USERBUYDATANETWORK = null;
                                    } catch (errorMsg) {
                                        console.log('DATA ERROR MESSAGE>>>:', errorMsg);
                                        await sock.sendMessage(
                                            numberWa,
                                            {
                                                text: `Uanble to process your request ${senderName}. Please try again`,
                                            }
                                        );   
                                        USERBUYDATA = false;
                                        USERBUYDATADATAPLAN = null;
                                        USERBUYDATAPHONENUMBER = null;
                                        USERBUYDATANETWORK = null;
                                    }
                                }
                            }
                            handleData()

                            // CALL FUNCTIONS BASED ON LET VARIABLES COMPLETIONS (DATA)
                            async function handleAirtime(){
                                if (USERBUYAIRTIME === true && (USERBUYAIRTIMEAMOUNT !== null && USERBUYAIRTIMEAMOUNT !== '') && (USERBUYAIRTIMEPHONENUMBER !== null && USERBUYAIRTIMEPHONENUMBER !==  '') && (USERBUYAIRTIMENETWORK !== null && USERBUYAIRTIMENETWORK !== '') && formattedNumber !== '') {
                                    console.log('RESPONSE DATA (AIRTIME)', USERBUYAIRTIME, '\n', USERBUYAIRTIMEAMOUNT, '\n', USERBUYAIRTIMEPHONENUMBER, '\n', USERBUYAIRTIMENETWORK, '\n', formattedNumber);
                                    try {
                                        const responseMsg = await controllers.buyAirtime({
                                            userConfirm: USERBUYAIRTIME,
                                            airtimeAmount: USERBUYAIRTIMEAMOUNT,
                                            phoneNumber: USERBUYAIRTIMEPHONENUMBER,
                                            networkCode: USERBUYAIRTIMENETWORK,
                                            userId: formattedNumber,
                                            useCashBack: USECASHBACK
                                        })
                                        console.log('AIRTIME RESPONSE MESSAGE>>>:', responseMsg);
                                        if(responseMsg){
                                            await sock.sendMessage(
                                                numberWa,
                                                {
                                                    text: responseMsg,
                                                }
                                            );
                                        }
                                        USERBUYAIRTIME = false;
                                        USERBUYAIRTIMEAMOUNT = null;
                                        USERBUYAIRTIMEPHONENUMBER = null
                                        USERBUYAIRTIMENETWORK = null
                                    } catch (errorMsg) {
                                        console.log('AIRTIME ERROR MESSAGE>>>:', errorMsg);
                                        await sock.sendMessage(
                                            numberWa,
                                            {
                                                text: `Uanble to process your request ${senderName}. Please try again`,
                                            }
                                        );
                                        USERBUYAIRTIME = false;
                                        USERBUYAIRTIMEAMOUNT = null;
                                        USERBUYAIRTIMEPHONENUMBER = null
                                        USERBUYAIRTIMENETWORK = null
                                    }
                                }
                            }
                            handleAirtime()

                            // CALL FUNCTIONS BASED ON LET VARIABLES COMPLETIONS (FUND ACCOUNT)
                             async function handleFunding() {
                                if (USERFUNDACCOUNT === true && (USERFUNDACCOUNTAMOUNT !== null && USERFUNDACCOUNTAMOUNT !==  '') && formattedNumber !== '') {
                                    console.log('RESPONSE DATA (ACCOUNT FUNDING)', USERFUNDACCOUNT, '\n', USERFUNDACCOUNTAMOUNT, formattedNumber);
                                    try {
                                        const responseMsg = await controllers.fundAccount({
                                            userConfirm: USERFUNDACCOUNT,
                                            amount: USERFUNDACCOUNTAMOUNT,
                                            userId: formattedNumber
                                        });
                                        if(responseMsg){
                                            await sock.sendMessage(
                                                numberWa,
                                                {
                                                    text: responseMsg,
                                                }
                                            );
                                        }
                                        USERFUNDACCOUNT = false
                                        USERFUNDACCOUNTAMOUNT = null
                                    } catch (errorMsg) {
                                        await sock.sendMessage(
                                            numberWa,
                                            {
                                                text: `Uanble to process your request ${senderName}. Please try again`,
                                            }
                                        );
                                        USERFUNDACCOUNT = false
                                        USERFUNDACCOUNTAMOUNT = null
                                    }
                                }
                            }                            
                            handleFunding();

                            // CALL FUNCTIONS BASED ON LET VARIABLES COMPLETIONS (USER REFERRED BY SOMEONE)
                            async function handleReferral() {
                                if (USERREFERRED === true && (USERREFERREE !== null && USERREFERREE !== '') && formattedNumber !== '') {
                                    console.log('RESPONSE DATA (REFERRAL)', USERREFERRED, '\n', USERREFERREE, formattedNumber);
                                    try {
                                        const responseMsg = await controllers.handleReferral({
                                            userConfirm: USERREFERRED,
                                            referreeId: USERREFERREE,
                                            userId: formattedNumber
                                        });
                                        console.log('REFERRAL RESPONSE MESSAGE>>>:', responseMsg);
                                        if(responseMsg){
                                            await sock.sendMessage(
                                                numberWa,
                                                {
                                                    text: responseMsg,
                                                }
                                            );
                                        }
                                        USERREFERRED = false
                                        USERREFERREE = null
                                    } catch (errorMsg) {
                                        console.log('REFERRAL ERROR MESSAGE>>>:', errorMsg);
                                        await sock.sendMessage(
                                            numberWa,
                                            {
                                                text: `Uanble to process your request ${senderName}. Please try again`,
                                            }
                                        );
                                        USERREFERRED = false
                                        USERREFERREE = null
                                    }
                                }
                            }                            
                            handleReferral();
                            
    
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

            //KEEP ALIVE MESSAGE
            /**
             const sendMessage = async () => {
                 await sock.sendMessage(
                     process.env.WHATSAPPNUMBER, 
                     {
                     text: `Hello success keeping alive message`,
                 });
             }
             * 
             */
            // const job = schedule.scheduleJob('*/3 * * * *', () => {
            //    sendMessage();
            // });
            
        } catch (error) {
            console.log('UNABLE TO REPLY MESSAGE', error);
            await sock.sendMessage(
                process.env.WHATSAPPNUMBER, 
                {
                text: `ERROR FORM WHATSAPP BOT SUCCESS '\n' ${error}`,
            });
        }
    });
    

    sock.ev.on('creds.update', saveCreds);
}

connectionLogic();
