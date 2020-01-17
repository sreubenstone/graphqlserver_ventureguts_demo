exports.up = function (knex, Promise) {
    return knex.schema.table("notifications", function (table) {
        table.boolean('read');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropColumn('read');
};
