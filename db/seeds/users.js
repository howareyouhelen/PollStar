exports.seed = function(knex, Promise) {
  return knex('poll_info').del()
    .then(function () {
      return Promise.all([
        knex('poll_info').insert({email: 'hahahah@example.com', name: 'Alice'}),
        knex('poll_info').insert({email: 'hahah@example.com', name: 'Bob'}),
        knex('poll_info').insert({email: 'abcd@example.com', name: 'Charlie'})
      ]);
    });
};
