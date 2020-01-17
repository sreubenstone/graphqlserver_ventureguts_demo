exports.up = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.integer('group_participants');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.dropColumn('group_participants');
    });
};
