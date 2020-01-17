
exports.up = function (knex, Promise) {
    return knex.schema.createTable("experiments", function (table) {
        table.increments("id");
        table.text("title");
        table.text("description");
        table.text("hypothesis");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("experiments");
};
