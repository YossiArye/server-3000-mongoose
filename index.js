const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const User = require('./models/User')
const Role = require('./models/Role')
const Website = require('./models/Website')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/entre_db'

mongoose.connect(MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err))

app.get('/websites', async function (req, res) {
  try {
    const websites = await Website.find({})
    console.log('websitessss')
    console.log(websites)
    res.json({websites})
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

app.post('/bulk-users', async function (req, res) {
  try {
    const usersFilter = req.body // Expecting array of IDs
    const users = await User.find({ id: { $in: usersFilter } })
    console.log('bulk-users')
    console.log(users)
    res.json(users)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

app.get('/role/:id', async function (req, res) {
  try {
    const roleId = req.params.id
    const role = await Role.findOne({ id: roleId })
    console.log('role')
    console.log(role)
    res.json(role)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

app.get('/', async function (req, res) {
  try {
    console.log('arrived')
    const users = await User.find({})
    // Removed setTimeout to rely on DB speed, but can re-add if latency simulation is needed
    res.json(users)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

app.post('/', async function (req, res) {
  try {
    console.log('arrived')
    const newUsersData = req.body
    const newUsers = []

    // Find the current max ID to auto-increment
    const lastUser = await User.findOne().sort({ id: -1 })
    let currentId = lastUser ? lastUser.id : 0

    // Handle both array and single object input
    const inputs = Array.isArray(newUsersData) ? newUsersData : [newUsersData]

    for (const userData of inputs) {
      if (!userData.id) {
          currentId++
          userData.id = currentId
      }
      newUsers.push(userData)
    }
    
    const createdUsers = await User.insertMany(newUsers)
    console.log(createdUsers)
    res.json(createdUsers)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`)
})
