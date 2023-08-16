import express from 'express'
import db from '../database.js'

const user = express.Router()

// rota para listagem de todos usuários
user.get('/', (req, res) => {
  const { name, email } = req.query

  let sql = 'SELECT * FROM users'

  // Verifica se o parâmetro "name" foi fornecido na consulta
  if (name) {
    sql += ` WHERE name LIKE '%${name}%'`
  }

  // Verifica se o parâmetro "email" foi fornecido na consulta
  if (email) {
    if (name) {
      sql += ' AND'
    } else {
      sql += ' WHERE'
    }
    sql += ` email LIKE '%${email}%'`
  }

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message)
    }

    if (!rows[0]) {
      return res.status(404).json({ message: 'nenhum usuário encontrado' })
    }
    res.send(rows)
  })
})

// rota para listagem do usuário (Pelo id)
user.get('/:id', (req, res) => {
  const { id } = req.params

  db.all('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
    if (err) {
      console.log(err)
      return res.status(500).send(err.message)
    }

    if (!rows[0]) {
      return res.status(404).json({ error: 'usuário não encontrado.' })
    }

    res.send(rows)
  })
})

// rota para criação de um novo usuário
user.post('/', async (req, res) => {
  const { name, email, password } = req.body

  if (name && email && typeof password === 'string') {
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password],
      (err) => {
        if (err) {
          return res.status(500).send(err.message)
        }
      },
    )
    return res.status(201).json({ message: 'Deu certo' })
  }

  res.status(400).json({
    message:
      'requisição inválida, os dados estão ausentes ou não estão no formato correto',
  })
})

// rota para atualização de um usuário existente (pelo id)
user.put('/:id', (req, res) => {
  const { id } = req.params

  const { name, email, password } = req.body

  if (name && email && typeof password === 'string') {
    db.run(
      'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
      [name, email, password, id],
      (err) => {
        if (err) {
          return res.status(500).send(err.message)
        }
      },
    )
    return res.json({ message: 'Item updated successfully' })
  }

  res.status(400).json({
    message:
      'requisição inválida, os dados estão ausentes ou não estão no formato correto',
  })
})

// rota para deletar um usuário (pelo id)
user.delete('/:id', (req, res) => {
  const { id } = req.params

  db.all('DELETE FROM users WHERE id = ?', [id], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message)
    }

    if (!rows) {
      return res.status(404).json({ error: 'usuário não encontrado.' })
    }
  })
  res.json({ message: 'usuário deletado com sucesso' })
})

export default user
