
exports.up = function (knex, Promise) {
    return knex.schema.createTable("notifications", function (table) {
        table.increments("id");
        table.integer("user");
        table.integer("project");
        table.integer("milestone");
        table.string("body");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("notifications");
};

/*
- project has a match DETAIL
- select user challenge? DETAIL
- user skipped you | PROJECTS
- user completed 1 | DETAIL
- user completed 2  | DETAIL
- user sent you a chat | CHAT
*/