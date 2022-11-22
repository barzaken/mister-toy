const fs = require('fs')
const gToys = require('../data/toy.json')

module.exports = {
  query,
  getById,
  remove,
  save,
}

// const itemsPerPage = 100

function query(filterBy) {
  return Promise.resolve(_filter(filterBy))
}

function getById(toyId) {
  const toy = gToys.find((toy) => toy._id === toyId)
  if (!toy) return Promise.reject('Unknown toy')
  return Promise.resolve(toy)
}


function remove(toyId) {
  const idx = gToys.findIndex((toy) => toy._id === toyId)
  if (idx < 0) return Promise.reject('Unknown toy')
  gToys.splice(idx, 1)
  return _saveToysToFile()
}

function save(toy) {
  if (toy._id) {
    const idx = gToys.findIndex((currToy) => currToy._id === toy._id)
    gToys[idx] = toy
  } else {
    toy._id = _makeId()
    gToys.unshift(toy)
  }
  return _saveToysToFile().then(() => toy)
}

function _makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}
function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(gToys, null, 2)

    fs.writeFile('data/toy.json', data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function _filter(filterBy) {
  const { txt, sort, inStock, labels } = filterBy
  const regex = new RegExp(txt, 'i')
  let filteredToys = gToys.filter((toy) => regex.test(toy.name))
  sort === 'name'
    ? filteredToys.sort((toy1, toy2) => toy1[sort].localeCompare(toy2[sort]))
    : filteredToys.sort((toy1, toy2) => toy2[sort] - toy1[sort])
  if (!inStock) {
    filteredToys = filteredToys.filter((toy) => toy.inStock)
  }
  if (labels.length) {
    filteredToys = filteredToys.filter((toy) => {
      return labels.some((label) => toy.labels.includes(label))
    })
  }
  return filteredToys
}