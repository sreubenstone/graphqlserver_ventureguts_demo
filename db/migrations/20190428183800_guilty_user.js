exports.up = function (knex, Promise) {
    return knex.schema.table("milestones", function (table) {
        table.integer('guilty_user')

    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("milestones", function (table) {
        table.integer('guilty_user')
    });
};


