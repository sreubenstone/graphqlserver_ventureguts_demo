exports.up = function (knex, Promise) {
    return knex.schema.table("chats", function (table) {
        table.boolean('anony').defaultTo(false);
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("chats", function (table) {
        table.dropColumn('anony');
    });
};