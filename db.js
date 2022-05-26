const mysql = require('mysql')

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'anime47'
})
db.connect((err)=>{
    if(err) throw err
    console.log('Connect to DB success!!!')
})

module.exports = db
