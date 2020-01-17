exports.up = function (knex, Promise) {
    return knex.schema.table("chats", function (table) {
        table.integer('connection');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropColumn('connection');
};
