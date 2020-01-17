exports.up = function (knex, Promise) {
    return knex.schema.table("chats", function (table) {
        table.boolean('starred').defaultTo(false);
        table.integer('starred_by');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("chats", function (table) {
        table.dropColumn('starred');
        table.dropColumn('starred_by');
    });
};