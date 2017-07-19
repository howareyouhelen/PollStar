exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('poll_info', function(table){
      table.increments('id');
      table.string('email').varchar(255);
      table.string('name').varchar(255);
    })
  ])
};
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('poll_info');
};
