
exports.up = function (knex, Promise) {
    return knex.schema.createTable("milestones", function (table) {
        table.increments("id");
        table.integer("project_id")
        table.text("body");
        table.boolean("completed");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("milestones");
};
