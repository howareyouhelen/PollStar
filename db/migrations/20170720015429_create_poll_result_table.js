exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('poll_result', function(table){
      table.increments('id');
      table.string('choice');
      table.integer('weight');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('poll_result')
  ])
};


