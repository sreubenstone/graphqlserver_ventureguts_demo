exports.up = function(knex, Promise) {
  return knex.schema.table("Library", function(table) {
    table.boolean("active");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropColumn("active");
};
