exports.up = function (knex, Promise) {
    return knex.schema.table("milestones", function (table) {
        table.integer('project_match');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropColumn('project_match');
};
