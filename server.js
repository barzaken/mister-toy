const express = require('express')
const cors = require ('cors')
const toyService = require('./services/toy.service.js')

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(express.json())

const corsOptions = {
  origin: ['http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://localhost:3000'],
  credentials: true
}
app.use(cors(corsOptions))

const port = process.env.PORT || 3000

// app.get('/', (req, res) => res.send('Hello!'))
app.listen(port, () => console.log(`Server ready at port ${port}!`))

// LIST
app.get('/api/toy', (req, res) => {
  var { txt, sort, inStock, labels } = req.query
  const filterBy = {
    txt: txt || '',
    sort: sort || 'name',
    labels:  labels || [],
    inStock: JSON.parse(inStock) ,
  }
  toyService.query(filterBy).then((toys) => {
    res.send(toys)
  })
})

// READ
app.get('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService.getById(toyId).then((toy) => {
    res.send(toy)
  })
})

// ADD
app.post('/api/toy', (req, res) => {
  const { name, price, inStock, createdAt, labels, reviews } = req.body
  const toy = {
    name,
    price,
    inStock,
    createdAt,
    labels,
    reviews,
  }
  toyService.save(toy).then((savedToy) => {
    res.send(savedToy)
  })
})

// UPDATE
app.put('/api/toy/:toyId', (req, res) => {
  const { name, price, _id, inStock, createdAt, labels } = req.body
  const toy = {
    _id,
    name,
    price,
    inStock,
    createdAt,
    labels,
  }
  toyService.save(toy).then((savedToy) => {
    res.send(savedToy)
  })
})

// DELETE
app.delete('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService.remove(toyId).then(() => {
    res.send('Removed!')
  })
})

// "start": "nodemon --ignore \"./data\" server.js"



