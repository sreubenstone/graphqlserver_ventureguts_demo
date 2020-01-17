exports.up = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.integer('reaction1');
        table.integer('reaction2');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.dropColumn('reaction1');
        table.dropColumn('reaction2');
    });
};
