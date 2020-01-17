exports.up = function (knex, Promise) {
    return knex.schema.table("experiments", function (table) {
        table.text("conclusion")
        table.text("direction")
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("experiments", function (table) {
        table.dropColumn('conclusion');
        table.dropColumn('direction');
    });
};