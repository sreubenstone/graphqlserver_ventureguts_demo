exports.up = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.text('about_me');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("users", function (table) {
        table.text('about_me');
    });
};
