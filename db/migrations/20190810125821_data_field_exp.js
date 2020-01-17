exports.up = function (knex, Promise) {
    return knex.schema.table("experiments", function (table) {
        table.text("data")
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("experiments", function (table) {
        table.dropColumn('data');
    });
};