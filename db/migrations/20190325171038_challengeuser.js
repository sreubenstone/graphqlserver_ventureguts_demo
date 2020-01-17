
exports.up = function (knex, Promise) {
    return knex.schema.table("Library", function (table) {
        table.integer('user_match');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropColumn('user_match');
};
