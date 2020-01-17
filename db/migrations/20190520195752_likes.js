exports.up = function (knex, Promise) {
    return knex.schema.createTable("reactions", function (table) {
        table.increments("id");
        table.integer("chat_id")
        table.integer("user_id")
        table.integer("type")
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("reactions");
};