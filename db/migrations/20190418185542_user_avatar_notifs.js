exports.up = function (knex, Promise) {
    return knex.schema.table("notifications", function (table) {
        table.string('image');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("notifications", function (table) {
        table.string('image');
    });
};
