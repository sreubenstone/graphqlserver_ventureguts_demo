require("dotenv").config();
import Expo from 'expo-server-sdk';
const knexConfig = require("./db/knex").development;
const knex = require("knex")(knexConfig);

let expo = new Expo();


const genericPush = async (userObject, body) => {

    const unreads = await knex.select().table('notifications').where({ user: userObject.id, read: null })


    const notification = {
        to: userObject.push_token,
        body: body,
        badge: unreads.length
    }
    if (!Expo.isExpoPushToken(userObject.push_token)) {
        console.error(`Push token ${userObject.push_token} is not a valid Expo push token`);
        return
    }
    const arrayM = [notification]
    let chunks = expo.chunkPushNotifications(arrayM);
    (async () => {
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log('ticketChunkL:', ticketChunk);

            } catch (error) {
                console.error('error:', error);
            }
        }
    })();
}



export { genericPush };