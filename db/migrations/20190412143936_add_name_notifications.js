exports.up = function (knex, Promise) {
    return knex.schema.table("notifications", function (table) {
        table.string('project_name');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropColumn('project_name');
};
