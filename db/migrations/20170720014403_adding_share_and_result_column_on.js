exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('poll_info', function(table){
      table.string('share');
      table.string('result');
    })
  ]);
}

exports.down = function(knex, Promise) {
  return knex.schema.table('poll_info', function(table){
    table.dropColumn('share');
    table.dropColumn('result');
    });
}

