exports.up = function (knex, Promise) {
    return knex.schema.table("notifications", function (table) {
        table.integer('challenge');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("notifications", function (table) {
        table.dropColumn('challenge');
    });
};
