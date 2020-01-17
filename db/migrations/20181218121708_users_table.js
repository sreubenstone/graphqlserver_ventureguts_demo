
exports.up = function (knex, Promise) {
    return knex.schema.createTable("users", function (table) {
        table.increments("id");
        table.string("First_Name");
        table.string("Last_Name");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("users");
};
