exports.up = function (knex, Promise) {
    return knex.schema.table("chats", function (table) {
        table.text("project")
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("chats", function (table) {
        table.dropColumn('project');
    });
};