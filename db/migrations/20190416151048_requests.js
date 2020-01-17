exports.up = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.integer('requested_user');

    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.dropColumn('requested_user');
    });
};
