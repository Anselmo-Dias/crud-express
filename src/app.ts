import express, { Request, Response } from 'express'
import product from './routes/product.js'
import user from './routes/user.js'

const app = express()

app.use(express.json())
app.use('/products', product)
app.use('/users', user)

app.use((req: Request, res: Response) => {
  console.log(req.body)
  res.status(404).send('not found, AAAAAAAAAAA')
})

app.listen(3030)
