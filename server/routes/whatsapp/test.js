const number = '09059309831'
const newNumber = '234' + number.slice(1);
console.log('newNumber', newNumber)

const number2 = '2349059309831@whqt'
const newNumber2 = number.slice('' , number2.indexOf('@'));
console.log('newNumber', newNumber2)

const number3 = '2349059309831'
const newNumber3 = '0' + number.slice(3);
console.log('newNumber', newNumber2)

const number4 = '09059309831'
const newNumber4 = '234' + number4.slice(1)
const whatsappNumber = newNumber4+'@s.whatsapp.net'
console.log('NEW WHATSAA', whatsappNumber)

import { config } from 'dotenv';
config();
import { GoogleGenerativeAI } from '@google/generative-ai';

const braveLiteAI = new GoogleGenerativeAI('AIzaSyAJGtqMFgf5XRsVh1ZB3iCk7duw9h1sg6o');
//const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const braveLite = braveLiteAI.getGenerativeModel({ model: 'gemini-pro' });

const message = 'Welcome susan to brave-sub your one stop data,  plug'
const query = `Based on this text: ${message} refactor and rewrite it to give a resonable output also add a corresponding emoji if neccessary`
const prompt = await braveLite.generateContent(query)
const response = await prompt.response;
const text = response.text();
console.log('MESSAGE FROM GEMINI:', text);