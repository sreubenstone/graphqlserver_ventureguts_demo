import axios from 'axios';
const knexConfig = require("./db/knex").development;
const knex = require("knex")(knexConfig);

export default function getAuth(req) {
    return new Promise(async (resolve, reject) => {
        const fbToken = req.headers.fbtoken
        if (fbToken) { // has token from client
            const user = await knex.select().table('tokens').where({ fb_token: fbToken })
            if (user.length > 0) {// there is a user in sessions (tokens table)
                const status = {
                    user: user[0].user_id
                }
                resolve(status)
            } else {  // there is a token from client but no session data (in tokens table)

                try {
                    const response = await axios.get(`https://graph.facebook.com/me?access_token=${fbToken}&fields=id,email,location,first_name,last_name,birthday,picture.type(large)`)
                    const info = response.data
                    const email_check = await knex.select().table('users').where({ email: info.email, facebook_id: null })
                    if (email_check.length) { throw "this user already signed up with email/pw previously." }
                    const check = await knex.select().table('users').where({ facebook_id: info.id })
                    if (check.length > 0) { // user exists
                        // create session
                        const a = await knex.insert({ user_id: check[0].id, fb_token: fbToken }).table('tokens')
                        const status = {
                            user: check[0].id
                        }
                        resolve(status)
                    } else { // user does not exist (sign up) -- I THINK ERROR IS IN HERE
                        // create user, create session
                        const body = "I didn't fill my About Me out yet, but I'm probably an interesting person, with some Guts. 😁🧠💪."
                        const result = await knex.insert({ facebook_id: info.id, email: info.email, First_Name: info.first_name, Last_Name: info.last_name, user_avatar: info.picture.data.url, onboarded: false, about_me: body }).table('users').returning('*')
                        const b = await knex.insert({ user_id: result[0].id, fb_token: fbToken }).table('tokens').returning('*')
                        const status = {
                            user: result[0].id
                        }
                        resolve(status)
                    }

                } catch (error) {
                    console.log('ERROR IN THIS AUTH BLOCK:', error)
                    const status = { user: null }
                    resolve(status)
                }
            }
        } else {
            // user is logged out -- has no token from client
            console.log('here down')
            const status = { user: null }
            resolve(status)
        }
    }
    )
}





