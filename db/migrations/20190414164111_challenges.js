exports.up = function (knex, Promise) {
    return knex.schema.createTable("challenges", function (table) {
        table.increments("id");
        table.text("body");
        table.text("project_description");
        table.boolean("completed")
        table.integer("penpal_match")
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("challenges");
};
