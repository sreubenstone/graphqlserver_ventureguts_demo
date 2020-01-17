exports.up = function (knex, Promise) {
    return knex.schema.table("reactions", function (table) {
        table.boolean('moderator')
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("reactions", function (table) {
        table.dropColumn('moderator');
    });
};