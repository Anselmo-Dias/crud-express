import express from 'express'
import db from '../database.js'
import * as zod from 'zod'

const product = express.Router()

// rota para listagem de todos produtos
// podendo também filtar os produtos via title ou description
product.get('/', (req, res) => {
  const queryParamsSchema = zod.object({
    title: zod.string(),
    description: zod.string(),
  })

  const { title, description } = queryParamsSchema.parse(req.query)

  let sql = 'SELECT * FROM products'

  // Verifica se o parâmetro "title" foi fornecido na consulta
  if (title) {
    sql += ` WHERE title LIKE '%${title}%'`
  }

  // Verifica se o parâmetro "description" foi fornecido na consulta
  if (description) {
    if (title) {
      sql += ' AND'
    } else {
      sql += ' WHERE'
    }
    sql += ` description LIKE '%${description}%'`
  }

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message)
    }

    if (!rows[0]) {
      return res.status(404).json({ message: 'nenhum produto encontrado' })
    }
    res.send(rows)
  })
})

// rota para listagem do produto (Pelo id)
product.get('/:id', (req, res) => {
  const { id } = req.params

  db.all('SELECT * FROM products WHERE id = ?', [id], (err, rows) => {
    if (err) {
      console.log(err)
      return res.status(500).send(err.message)
    }

    if (!rows[0]) {
      return res.status(404).json({ error: 'Produto não encontrado.' })
    }

    res.send(rows)
  })
})

// rota para criação de um novo produto
product.post('/', async (req, res) => {
  const bodySchema = zod.object({
    title: zod.string(),
    description: zod.string(),
    price: zod.number(),
  })

  const { title, description, price } = bodySchema.parse(req.body)

  if (title && description && typeof price === 'number') {
    db.run(
      'INSERT INTO products (title, description, price) VALUES (?, ?, ?)',
      [title, description, price],
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

// rota para atualização de um produto existente (pelo id)
product.put('/:id', (req, res) => {
  const bodySchema = zod.object({
    title: zod.string(),
    description: zod.string(),
    price: zod.number(),
  })

  const { id } = req.params

  const { title, description, price } = bodySchema.parse(req.body)

  if (title && description && typeof price === 'number') {
    db.run(
      'UPDATE products SET title = ?, description = ?, price = ? WHERE id = ?',
      [title, description, price, id],
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
product.delete('/:id', (req, res) => {
  const { id } = req.params

  db.all('DELETE FROM products WHERE id = ?', [id], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message)
    }

    if (!rows) {
      return res.status(404).json({ error: 'Produto não encontrado.' })
    }
  })
  res.json({ message: 'Produto deletado com sucesso' })
})

export default product
