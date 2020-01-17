exports.up = function (knex, Promise) {
    return knex.schema.table("milestones", function (table) {
        table.boolean('group_chat');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.dropColumn('group_chat');
    });
};
