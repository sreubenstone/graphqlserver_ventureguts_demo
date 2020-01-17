exports.up = function (knex, Promise) {
    return knex.schema.table("milestones", function (table) {
        table.string('last_notification_to_creator').defaultTo('0');
        table.string('last_notification_to_penpal').defaultTo('0');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table("milestones", function (table) {
        table.string('last_notification_to_creator');
        table.string('last_notification_to_penpal');
    });
};


