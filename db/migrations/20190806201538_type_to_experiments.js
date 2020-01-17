exports.up = function (knex, Promise) {
    return knex.schema.table("experiments", function (table) {
        table.integer("type")

    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("experiments", function (table) {
        table.dropColumn('type');

    });
};