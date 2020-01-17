exports.up = function (knex, Promise) {
    return knex.schema.table("chats", function (table) {
        table.string("admin_tag")
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("chats", function (table) {
        table.dropColumn('admin_tag');
    });
};