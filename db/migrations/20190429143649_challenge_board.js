exports.up = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.boolean('challenge_board');

    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.boolean('challenge_board');
    });
};


