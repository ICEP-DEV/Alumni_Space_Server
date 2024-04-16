var mysql = require('mysql')

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'alumni_db',
});

connection.connect((err) => {
  if (!err)
      console.log('Connection Established Successfully');
  else
      console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});

module.exports = connection;