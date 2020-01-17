exports.up = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        null
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        null
    });
};


