exports.up = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.integer('City');
        table.integer('Maturity_Ranking');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.dropColumn('City');
        table.dropColumn('Maturity_Ranking');
    });
};
