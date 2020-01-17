exports.up = function (knex, Promise) {
    return knex.schema.createTable("tagged", function (table) {
        table.increments("id");
        table.integer("tag_id")
        table.integer("user_id")
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("tagged");
};