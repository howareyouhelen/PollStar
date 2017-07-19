exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('poll_info', function(table){
      table.increments('id');
      table.string('email');
      table.string('name');
    })
  ])
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('poll_info');
};
