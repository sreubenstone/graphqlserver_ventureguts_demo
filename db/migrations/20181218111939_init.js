
exports.up = function (knex, Promise) {
    return knex.schema.createTable("snippits", function (table) {
        table.increments("id");
        table.string("title");
        table.string("body");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("snippits");
};
