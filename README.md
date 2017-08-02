# Decision Maker App: Pollstar 

Pollstar is a web app that helps groups of friends to vote on a preferred choice (using ranked voting/Borda count), for example: "What movie should we see next Friday?". It is anonymous, and so it does not need a user registration/login to use the app. The creator of the poll will receive the links of the voting page and the resut page of their poll in an email through Sendgrid. The creator can then share the vote and result link with his/her group. 

## Final Product

!["Home page with input"](https://github.com/howareyouhelen/PollStar/blob/master/docs/homepage.png)
!["Summary page after creating poll"](https://github.com/howareyouhelen/PollStar/blob/master/docs/summary.png)
![Voting page"](https://github.com/howareyouhelen/PollStar/blob/master/docs/voting-page.png)
!["Results page"](https://github.com/howareyouhelen/PollStar/blob/master/docs/result-page.png)

## Getting Started

1. Install dependencies: `npm i`
2. Run migrations: `npm run knex migrate:latest`
3. Run the seed: `npm run knex seed:run`
4. Run the server: `npm run local`
5. Visit `http://localhost:8080/`

## Dependencies

- Bootstrap
- Node 5.10.x or above
- NPM 3.8.x or above
- Sendgrid API
