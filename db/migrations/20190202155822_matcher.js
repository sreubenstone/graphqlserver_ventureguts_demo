exports.up = function (knex, Promise) {
    return knex.schema.table("snippits", function (table) {
        table.integer('snippit_match');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropColumn('snippit_match');
};
