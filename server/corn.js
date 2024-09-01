import schedule from 'node-schedule';
import axios from 'axios';
import UserModel from './model/User.js';

// Function to generate a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to schedule the `sendMessage` job with a random interval
function scheduleSendMessageJob() {
  // Generate a random interval between 4 and 8 minutes
  const minutes = getRandomInt(4, 8);

  // Create a cron expression to run the job every `minutes` minutes
  const cronExpression = `*/${minutes} * * * *`;

  // Schedule the job using the generated cron expression
  const task = schedule.scheduleJob(cronExpression, async () => {
    try {
      await sendMessage(); // Call the sendMessage function

      // Reschedule with a new random interval after the job is executed
      scheduleSendMessageJob();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  console.log(`SendMessage job scheduled to run every ${minutes} minutes`);
}

// Function to send a message
const sendMessage = async () => {
  try {
    const res = await axios.get(`${process.env.NEBOUR_URL}/keep-alive`);
    console.log('ALIVE RESPONSE', res.data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Start the scheduling process
scheduleSendMessageJob();

