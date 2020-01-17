exports.up = function (knex, Promise) {
    return knex.schema.createTable("requests", function (table) {
        table.increments("id");
        table.integer("user_id");
        table.integer("challenge_id");
        table.boolean("accepted")
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("requests");
};
