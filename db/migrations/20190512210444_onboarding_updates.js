exports.up = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.boolean('cb_onboard');
        table.boolean('chat_onboard');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.dropColumn('cb_onboard');
        table.dropColumn('chat_onboard');
    });
};
