exports.up = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.integer('reaction3');
        table.integer('reaction4');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.dropColumn('reaction3');
        table.dropColumn('reaction4');
    });
};