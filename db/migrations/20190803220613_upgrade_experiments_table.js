exports.up = function (knex, Promise) {
    return knex.schema.table("experiments", function (table) {
        table.integer("user_id")
        table.integer("moderator_id")
        table.integer("phase")
        table.integer("conversation_id")
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("experiments", function (table) {
        table.dropColumn('user_id');
        table.dropColumn('moderator_id');
        table.dropColumn('phase');
        table.dropColumn('conversation_id');

    });
};