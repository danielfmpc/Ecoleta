import knex from "knex";

const connection = knex({
  client: 'mysql2',
  connection: {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'dbnlw'
  }
});

export default connection;