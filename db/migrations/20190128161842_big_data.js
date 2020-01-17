exports.up = function (knex, Promise) {
    return knex.schema.table("snippits", function (table) {
        table.integer('Effort_Level');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("snippits", function (table) {
        table.dropColumn('Effort_Level');
    });
};


