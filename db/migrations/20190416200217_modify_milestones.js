exports.up = function (knex, Promise) {
    return knex.schema.table("milestones", function (table) {
        table.integer('challenge');
        table.integer('penpal');

    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.dropColumn('challenge');
        able.dropColumn('penpal');
    });
};
