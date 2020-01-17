require("dotenv").config();
import express from "express";
import schema from "./apollo";
import graphqlHTTP from "express-graphql";
import cron from "node-cron";
import cors = require("cors");
import authy from "./authFunction";
import bodyParser from "body-parser";
import { email_avatar } from "./random_avatars";
const knexConfig = require("./db/knex").development;
const knex = require("knex")(knexConfig);

const app = express();
const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true
};

app.use(cors(corsOptions));

const jsonParser = bodyParser.json();

app.use(
  "/graphql",
  graphqlHTTP(async req => {
    const authData = await authy(req);
    return {
      schema,
      context: authData,
      graphiql: true
    };
  })
);

const server = app.listen(process.env.PORT, () => {
  console.log(`Listening on http server.`);
});

// thread_chat cron
cron.schedule("*/2 * * * *", async () => {
  // get me an array of every chat in the main chat that has atleast one thread_comment
  // get me distinct milestones
  const distinct_threads = await knex.raw(
    "SELECT DISTINCT milestone FROM chats"
  );
  // filter out 1
  const distinct = distinct_threads.rows.filter(item => {
    return item.milestone !== 1;
  });

  for (const item of distinct) {
    // how many thread chats exist?
    const count = await knex.raw(
      `SELECT COUNT (chats.id) FROM chats WHERE milestone = ${item.milestone}`
    );
    const update = await knex
      .update({ thread_chats: count.rows[0].count })
      .table("chats")
      .where({ id: item.milestone });
  }
});

// reaction stats cron
cron.schedule("*/12 * * * *", async () => {
  const users = await knex.raw(
    "SELECT DISTINCT reactions.receiving_user from reactions"
  );
  for (const user of users.rows) {
    const reactions = await knex
      .select()
      .table("reactions")
      .where({ receiving_user: user.receiving_user });

    const type1 = reactions.filter(item => {
      return item.type === 1;
    });
    const type2 = reactions.filter(item => {
      return item.type === 2;
    });
    const type3 = reactions.filter(item => {
      return item.type === 3;
    });
    const type4 = reactions.filter(item => {
      return item.type === 4;
    });

    const update = await knex
      .update({
        reaction1: type1.length,
        reaction2: type2.length,
        reaction3: type3.length,
        reaction4: type4.length
      })
      .table("users")
      .where({ id: user.receiving_user });
  }
});

// daily_reactions cleared to 0 at 12 AM EST daily
cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("CLEAR DAILY_COUNT RUNNING AT 12 AM EST");
    const clear = await knex.update({ daily_reaction: 0 }).table("users");
  },
  { timezone: "America/New_York" }
);

// my_threads
cron.schedule("*/3 * * * *", async () => {
  // start off with any user that has commented anywere
  const list = await knex.raw("SELECT DISTINCT user_id from chats");
  // My Threads —> Thread I commented in, or a thread i started that has at-least one comment from anyone.
  for (const item of list.rows) {
    // (a) find every thread i've commented in --> search for distinct milestones where user_id is me
    const a = await knex.raw(
      `SELECT DISTINCT milestone from chats where user_id = ${item.user_id}`
    );
    // console.log('a:', a.rows)
    // (b) find every thread that I created that has atleast one comment
    const b = await knex.raw(
      `SELECT id, milestone, user_id, thread_chats FROM chats WHERE (user_id = ${item.user_id} AND milestone = 1 AND thread_chats > 0)`
    );
    // console.log('b:', b.rows)
    // Final Array: a) filter out milestone 1 and b)
    // final array is a unique list of chat id's period...that chad id is the milestone for the thread that gets passed in as the milestone
    let array: any = [];
    a.rows.forEach(element => {
      array.push(element.milestone);
    });
    b.rows.forEach(element => {
      array.push(element.id);
    });
    const uniq = [...new Set(array)];
    const final = uniq.filter(item => item !== 1);
    const stringified = JSON.stringify(final);
    const update = await knex
      .update({ my_threads: stringified })
      .table("users")
      .where({ id: item.user_id });
  }
});
