exports.up = function (knex, Promise) {
    return knex.schema.table("reactions", function (table) {
        table.integer('receiving_user');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.dropColumn('receiving_user');
    });
};