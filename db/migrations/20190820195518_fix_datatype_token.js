exports.up = function (knex, Promise) {
    return knex.schema.alterTable("tokens", function (table) {
        table.text("fb_token").notNull().defaultTo("-").alter();

    });
};

exports.down = function (knex, Promise) {
    knex.schema.alterTable("snippits", function (table) {
        table.string("body").notNull().defaultTo("a").alter();
    });
};
