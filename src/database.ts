import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('database.db')

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(30),
      description VARCHAR(30),
      price float 
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(30),
      email VARCHAR(30),
      password VARCHAR(30)
    )
  `)
})

// db.all('SELECT * FROM products', (err, rows) => {
//   if (err) {
//     console.error(err.message)
//     return
//   }
//   console.log(rows)
// })

export default db
