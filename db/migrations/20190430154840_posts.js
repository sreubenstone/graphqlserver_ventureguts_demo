exports.up = function (knex, Promise) {
    return knex.schema.createTable("posts", function (table) {
        table.increments("id");
        table.integer("user_id")
        table.text("title");
        table.text("body");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("posts");
};
