exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('poll_result', function(table){
      table.integer('poll_info_id').unsigned()
      table.foreign('poll_info_id').references('poll_info.id');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('poll_result', function(table){
      table.dropForeign('poll_info_id', 'poll_result_poll_info_id_foreign')
      table.dropColumn('poll_info_id')
    })
  ])
};