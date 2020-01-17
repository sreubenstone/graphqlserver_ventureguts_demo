exports.up = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.integer('user');

    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.dropColumn('user');

    });
};
