exports.up = function (knex, Promise) {
    return knex.schema.table("experiments", function (table) {
        table.integer("chat_id")
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("experiments", function (table) {
        table.dropColumn('chat_id');
    });
};