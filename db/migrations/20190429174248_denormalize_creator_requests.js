exports.up = function (knex, Promise) {
    return knex.schema.table("requests", function (table) {
        table.integer('challenge_creator_id');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("requests", function (table) {
        table.dropColumn('challenge_creator_id');
    });
};
