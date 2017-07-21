exports.seed = function(knex, Promise) {


  return knex('poll_result').del()
    .then(() => {
      return knex('poll_info').del()
    })
    .then(function () {
      return knex('poll_info').insert({email: 'me@me.com', name: 'where to get bbt?', pollid: '1234'}).returning('id')
    })
    .then((result) => {
      if (result.length > 0) {
        var pollId = result[0];
        return Promise.all([
          knex('poll_result').insert({choice: 'Gongcha', weight: 4, poll_info_id: pollId}),
          knex('poll_result').insert({choice: 'PearlFever', weight: 3, poll_info_id: pollId}),
          knex('poll_result').insert({choice: 'ChaTime', weight: 2, poll_info_id: pollId}),
          knex('poll_result').insert({choice: 'bubble88', weight: 1, poll_info_id: pollId}),
        ]);
      } else {
        console.log("why the heck did seeding fail to create a poll?!?");
      }
    })
    .catch((err) => {
      console.log("failure while seeding", err);
    })

};