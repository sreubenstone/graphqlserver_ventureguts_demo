exports.up = function (knex, Promise) {
    return knex.schema.table("snippits", function (table) {
        table.string('milestones');
        table.string('to_funding');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropColumn('city');
};
