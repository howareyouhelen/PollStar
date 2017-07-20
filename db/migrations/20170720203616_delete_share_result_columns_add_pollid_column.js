exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('poll_info', function(table){
      table.dropColumn('share')
      table.dropColumn('result')
      table.string('pollid')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('poll_info', function(table){
      table.string('share')
      table.string('result')
      table.dropColumn('pollid')
    })
  ])
};

