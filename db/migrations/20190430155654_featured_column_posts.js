exports.up = function (knex, Promise) {
    return knex.schema.table("posts", function (table) {
        table.boolean('featured');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("posts", function (table) {
        table.dropColumn('featured');
    });
};
