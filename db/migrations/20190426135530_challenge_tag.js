
exports.up = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.integer('tag');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("challenges", function (table) {
        table.integer('tag');
    });
};


