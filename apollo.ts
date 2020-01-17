require("dotenv").config();
import { RedisPubSub } from "graphql-redis-subscriptions";
import { genericPush } from "./push_notifications";
import { avatar } from "./random_avatars";
import avatar_updater from "./UserAvatarUpdater";
const { gql, withFilter, UserInputError } = require("apollo-server");
const knexConfig = require("./db/knex").development;
const knex = require("knex")(knexConfig);
const { makeExecutableSchema } = require("graphql-tools");
const redis = require("redis");
const client = redis.createClient({
  port: process.env.REDDISPORT,
  host: process.env.REDDISHOST,
  password: process.env.REDDISPW
});
const pubsub = new RedisPubSub({
  publisher: client,
  subscriber: client
});
const CHAT_SENT_TOPIC = "newChat";
const Mixpanel = require("mixpanel");
const mixpanel = Mixpanel.init("d06de371bc5fc33e5ce31430ecf7dc7e");

const typeDefs = gql`
  type User {
    First_Name: String
    Last_Name: String
    about_me: String
    goal: String
    id: Int
    score: Int
    alias_name: String
    alias_avatar: String
    moderator: Boolean
    trophy: Boolean
    email: String
    user_avatar: String
    push_token: String
    facebook_id: String
    onboarded: Boolean
    stop: Boolean
    tags: [Tag]
    reaction1: Int
    reaction2: Int
    reaction3: Int
    reaction4: Int
    muted: Boolean
    daily_reaction: Int
    discussions: [Chat]
  }

  type Tag {
    id: Int
    body: String
  }

  type Chat {
    id: Int
    user: User
    snippit_id: Int
    body: String
    starred: Boolean
    starred_by: Int
    starrer: User
    anony: Boolean
    created_at: String
    thread_updated: String
    last_updated: Time
    time_stamp: Time
    reactions: [Reaction]
    thread_chats: Int
    destiny_type: Int
    category: Int
    admin_tag: String
    is_boosted: Boolean
    mod_boosted: Boolean
    b_id: Int
    b_body: String
    b_First_Name: String
    b_Last_Name: String
    b_user_avatar: String
    b_alias_avatar: String
    b_alias_name: String
    b_anony: Boolean
    b_thread_chats: Int
    alert: Int
    experiment: Experiment
    project: String
  }

  type Experiment {
    id: Int
    user_id: Int
    user: User
    title: String
    description: String
    hypothesis: String
    chat_id: Int
    phase: Int
    conversation_id: Int
    moderator_id: Int
    moderator: User
    type: Int
    data: String
    conclusion: String
    direction: String
    market: String
  }

  type Reaction {
    id: Int
    user_id: Int
    chat_id: Int
    type: Int
  }

  type Time {
    stamp: String
  }

  type Notification {
    id: Int
    user: Int
    project: Int
    milestone: Int
    challenge: Int
    body: String
    project_name: String
    read: Boolean
    type: Int
    image: String
    created_at: String
    time_stamp: Time
    post: String
    is_boosted: Boolean
  }

  type Query {
    getAuth: User
    getProfile(user_id: Int): User
    tagList: [Tag]
    getChat(milestone: Int, cursor: Int): [Chat]
    getNotifications: [Notification]
    getChallenges: [Chat]
    getExperiments: [Chat]
    getExperiment(chat_id: Int): Experiment
    getStarred: [Chat]
    leaderBoard: [User]
    leaderBoardInfo: String
    myThreads: [Chat]
    getChatCard(chat_id: Int): Chat
  }

  type Mutation {
    createExperiment: Chat
    submitReaction(chat_id: Int, type: Int): Reaction
    userTags(input: tagInput): User
    saveProfile(about_me: String, goal: String, onboard: Boolean): User
    sendChat(
      milestone: Int
      body: String
      group: Boolean
      preset: Boolean
      mention: Int
      anony: Boolean
      destiny_type: Int
      category: Int
      interviewee: String
      learn: String
    ): Chat
    set_pushToken(push_token: String): User
    onBoard: User
    markRead: [Notification]
    saveAlias(alias_name: String): User
    muteUser(id: Int): User
    modBoost(id: Int): Chat
    fakeBot(
      bot_id: Int
      milestone: Int
      body: String
      destiny_type: Int
      password: String
      alert: Int
    ): Chat
    updateAvatars(pw: String): String
    migrateUser(old_id: Int, new_id: Int, pw: String): String
  }

  type Subscription {
    chatSent(connection: Int): Chat
  }

  input tagInput {
    tags: [Tags]
  }

  input Tags {
    id: Int
  }
`;

const resolvers = {
  Query: {
    getAuth: async (parents, args, ctx) => {
      console.log("Apollo GQL Server CTX Object:", ctx);
      if (ctx.user === null) {
        console.log("user is logged out");
        return { id: null };
      } else {
        console.log("user is logged in");
        const user = await knex
          .select()
          .table("users")
          .where({ id: ctx.user });
        if (process.env.PROD === "true") {
          mixpanel.track("getAuth", { distinct_id: ctx.user });
          // create or update a user in Mixpanel
          mixpanel.people.set(`${ctx.user}`, {
            $first_name: `${user[0].First_Name}`,
            $last_name: `${user[0].Last_Name}`,
            $email: `${user[0].email}`
          });
        }
        const now = Date.now();
        const updateTime = await knex
          .update({ last_online: `${now}` })
          .table("users")
          .where({ id: ctx.user })
          .returning("*");
        return user[0];
      }
    },

    getProfile: async (parents, args, ctx) => {
      if (ctx.user === null) {
        return null;
      } else {
        const result = await knex
          .select()
          .table("users")
          .where({ id: args.user_id });
        return result[0];
      }
    },

    getChatCard: async (parents, args, ctx) => {
      if (ctx.user === null) {
        return null;
      } else {
        const result = await knex
          .select()
          .table("chats")
          .where({ id: args.chat_id });
        return result[0];
      }
    },

    tagList: async (parents, args, ctx) => {
      if (ctx.user === null) {
        return null;
      } else {
        const result = await knex.select().table("tags");
        return result;
      }
    },

    getNotifications: async (parents, args, ctx) => {
      if (ctx.user === null) {
        return null;
      } else {
        const result = await knex
          .select()
          .table("notifications")
          .where({ user: ctx.user })
          .orderBy("created_at", "desc")
          .limit(35);
        const mark_loaded = await knex
          .update({ loaded: true })
          .table("notifications")
          .where({ user: ctx.user });
        return result;
      }
    },

    getChat: async (parents, args, ctx) => {
      if (ctx.user === null) {
        return null;
      } else {
        if (!args.cursor) {
          const result = await knex.raw(
            `SELECT * FROM chats WHERE milestone = ${args.milestone} ORDER BY created_at DESC limit 15`
          );
          return result.rows.reverse();
        }
        const result = await knex.raw(
          `SELECT * FROM chats WHERE milestone = ${args.milestone} AND id < ${args.cursor} ORDER BY created_at DESC limit 5`
        );
        return result.rows.reverse();
      }
    },

    myThreads: async (parents, args, ctx) => {
      if (ctx.user === null) {
        return null;
      } else {
        const user = await knex
          .select()
          .table("users")
          .where({ id: ctx.user });
        const my_threads_string = user[0].my_threads;
        if (!my_threads_string) {
          return null;
        }
        const my_threads = JSON.parse(my_threads_string);
        // return from chats an array of rows
        let chats: any = [];
        for (const item of my_threads) {
          const thread = await knex
            .select()
            .table("chats")
            .where({ id: item });
          chats.push(thread[0]);
        }
        const sorted = chats.sort(function(a, b) {
          return b.thread_updated - a.thread_updated;
        });

        return sorted;
      }
    }
  },

  Mutation: {
    userTags: async (parent, { input }, ctx) => {
      if (ctx.user === null) {
        return null;
      } else {
        //console.log('tag input:', input)
        input.tags.forEach(async tag => {
          const result = await knex
            .insert({ user_id: ctx.user, tag_id: tag.id })
            .table("tagged")
            .returning("*");
        });
        const user = await knex
          .select()
          .table("users")
          .where({ id: ctx.user });
        return user[0];
      }
    },

    saveProfile: async (parent, args, ctx) => {
      if (ctx.user === null) {
        return null;
      } else {
        if (args.onboard) {
          const result = await knex
            .update({ goal: args.goal })
            .table("users")
            .where({ id: ctx.user });
        }
        const result = await knex
          .update({ about_me: args.about_me, goal: args.goal })
          .table("users")
          .where({ id: ctx.user });
        return result[0];
      }
    },

    onBoard: async (parent, args, ctx) => {
      if (ctx.user === null) {
        return null;
      } else {
        // console.log('hitting here dog')
        const result = await knex
          .update({ onboarded: true })
          .table("users")
          .where({ id: ctx.user })
          .returning("*");
        return result;
      }
    },

    markRead: async (parent, args, ctx) => {
      if (ctx.user === null) {
        return null;
      } else {
        const result = await knex
          .update({ read: true })
          .table("notifications")
          .where({ user: ctx.user, loaded: true })
          .returning("*");
        // console.log('MARKING READ RESULT', result)
        return result;
      }
    },

    modBoost: async (parent, args, ctx) => {
      if (ctx.user === null) {
        return null;
      } else {
        // write chat to database, update both chats
        // post subscription
        // sent notifications you want to send
        try {
          const userData = await knex
            .select()
            .table("users")
            .where({ id: ctx.user });
          const selected_chat = await knex
            .select()
            .table("chats")
            .where({ id: args.id })
            .returning("*");
          const chat_user = await knex
            .select()
            .table("users")
            .where({ id: selected_chat[0].user_id });
          const data = {
            user_id: ctx.user,
            milestone: 1,
            mod_boosted: true,
            b_id: args.id,
            b_body: selected_chat[0].body,
            b_First_Name: chat_user[0].First_Name,
            b_Last_Name: chat_user[0].Last_Name,
            b_user_avatar: chat_user[0].user_avatar,
            b_alias_avatar: chat_user[0].alias_avatar,
            b_alias_name: chat_user[0].alias_name,
            b_anony: selected_chat[0].anony,
            b_thread_chats: selected_chat[0].thread_chats
          };
          const chat = await knex
            .insert(data)
            .table("chats")
            .returning("*");
          const stamper = JSON.stringify(chat[0].created_at);
          const update_boosted = await knex
            .update({ is_boosted: true })
            .table("chats")
            .where({ id: args.id });

          // PUBLSIH EVENT
          const event = {
            __typename: "Chat",
            id: chat[0].id,
            milestone: 1,
            body: "null",
            anony: false,
            destiny_type: null,
            mod_boosted: true,
            b_id: args.id,
            b_body: selected_chat[0].body,
            b_First_Name: chat_user[0].First_Name,
            b_Last_Name: chat_user[0].Last_Name,
            b_user_avatar: chat_user[0].user_avatar,
            b_alias_avatar: chat_user[0].alias_avatar,
            b_alias_name: chat_user[0].alias_name,
            b_anony: selected_chat[0].anony,
            b_thread_chats: selected_chat[0].thread_chats,
            user: {
              First_Name: userData[0].First_Name,
              Last_Name: userData[0].Last_Name,
              id: ctx.user,
              user_avatar: userData[0].user_avatar,
              alias_name: userData[0].alias_name,
              alias_avatar: userData[0].alias_avatar,
              muted: userData[0].muted,
              moderator: userData[0].moderator,
              trophy: userData[0].trophy
            },
            created_at: chat[0].created_at,
            time_stamp: {
              stamp: stamper
            },
            reactions: []
          };

          pubsub.publish(CHAT_SENT_TOPIC, { chatSent: event });

          // sent notifs -- BLAST USERS -- HIT THREAD OWNER
          // thread data for notifications
          const post_object = {
            body: selected_chat[0].body,
            anony: selected_chat[0].anony,
            user: {
              First_Name: chat_user[0].First_Name,
              Last_Name: chat_user[0].Last_Name,
              alias_name: chat_user[0].alias_name
            }
          };
          const post = JSON.stringify(post_object);
          const write_notification_owner = await knex
            .insert({
              is_boosted: true,
              body: `A moderator Boosted your Thread!!`,
              user: chat_user[0].id,
              type: 2,
              image: userData[0].user_avatar,
              milestone: args.id,
              post: post
            })
            .table("notifications")
            .returning("*");
          genericPush(chat_user[0], "A moderator Boosted your Thread!!");
          const users = await knex.select().table("users");
          for (const user of users) {
            const write_notification_owner = await knex
              .insert({
                is_boosted: true,
                body: `A moderator Boosted ${chat_user[0].First_Name}'s Thread! 1.5x Guts Points! Help ${chat_user[0].First_Name} out!!!`,
                user: user.id,
                type: 2,
                image: userData[0].user_avatar,
                milestone: args.id,
                post: post
              })
              .table("notifications")
              .returning("*");
            genericPush(
              user,
              `A moderator Boosted ${chat_user[0].First_Name}'s Thread! 1.5x Guts Points! Log in to help ${chat_user[0].First_Name} out!!!`
            );
          }

          return chat[0];
        } catch (error) {
          console.log("error modBoost resolver:", error);
        }
      }
    }
  },

  Subscription: {
    chatSent: {
      subscribe: withFilter(
        // () => pubsub.asyncIterator(CHAT_SENT_TOPIC),
        (payload, variables) => {
          return payload.chatSent.connection === variables.connection;
        }
      )
    }
  },

  User: {
    tags: async parent => {
      const result = await knex.raw(
        `SELECT tags.body, tagged.tag_id as id FROM tagged INNER JOIN tags ON tagged.tag_id = tags.id WHERE tagged.user_id = ${parent.id}`
      );
      return result.rows;
    },

    discussions: async parent => {
      const result = await knex.raw(
        `SELECT * from chats where (category = 1 OR category = 2) AND user_id = ${parent.id} ORDER by created_at DESC`
      );
      return result.rows;
    }
  },

  Chat: {
    user: async parent => {
      const result = await knex
        .select()
        .table("users")
        .where({ id: parent.user_id });
      return result[0];
    },

    experiment: async parent => {
      const result = await knex
        .select()
        .table("experiments")
        .where({ chat_id: parent.id });
      return result[0];
    },

    time_stamp: parent => {
      const stamper = JSON.stringify(parent.created_at);

      const stamp = {
        stamp: stamper
      };
      return stamp;
    },

    last_updated: parent => {
      const stamper = JSON.stringify(parent.thread_updated);

      const stamp = {
        stamp: stamper
      };
      return stamp;
    },

    starrer: async parent => {
      const result = await knex
        .select()
        .table("users")
        .where({ id: parent.starred_by });
      return result[0];
    },

    reactions: async parent => {
      const result = await knex
        .select()
        .table("reactions")
        .where({ chat_id: parent.id });
      return result;
    }
  },

  Notification: {
    time_stamp: parent => {
      const stamper = JSON.stringify(parent.created_at);

      const stamp = {
        stamp: stamper
      };
      return stamp;
    }
  },

  Experiment: {
    user: async parent => {
      const result = await knex
        .select()
        .table("users")
        .where({ id: parent.user_id });
      return result[0];
    },

    moderator: async parent => {
      const result = await knex
        .select()
        .table("users")
        .where({ id: parent.moderator_id });
      return result[0];
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
