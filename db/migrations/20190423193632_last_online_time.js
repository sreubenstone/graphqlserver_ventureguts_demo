exports.up = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.string('last_online').defaultTo('0');

    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.string('last_online').defaultTo('0');
    });
};


