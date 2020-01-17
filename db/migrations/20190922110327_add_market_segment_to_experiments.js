exports.up = function (knex, Promise) {
    return knex.schema.table("experiments", function (table) {
        table.text("market")
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("experiments", function (table) {
        table.dropColumn('market');
    });
};