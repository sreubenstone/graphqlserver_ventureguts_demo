exports.up = function (knex, Promise) {
    return knex.schema.table("snippits", function (table) {
        table.integer('user_id');
        table.integer('mentor_id');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropColumn('city');
};
