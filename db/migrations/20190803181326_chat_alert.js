exports.up = function (knex, Promise) {
    return knex.schema.table("chats", function (table) {
        table.integer("alert")
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("chats", function (table) {
        table.dropColumn('alert');
    });
};