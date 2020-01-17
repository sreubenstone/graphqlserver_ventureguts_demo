exports.up = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.string('alias_name')
        table.string('alias_avatar')
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.dropColumn('alias_name');
        table.dropColumn('alias_avatar');
    });
};