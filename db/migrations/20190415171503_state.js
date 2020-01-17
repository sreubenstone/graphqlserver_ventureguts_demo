exports.up = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.string('state');

    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.dropColumn('state');
    });
};
