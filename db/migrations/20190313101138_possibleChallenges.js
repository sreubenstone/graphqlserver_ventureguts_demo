
exports.up = function (knex, Promise) {
    return knex.schema.createTable("Library", function (table) {
        table.increments("id");
        table.integer("project_id")
        table.text("body");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("Library");
};
