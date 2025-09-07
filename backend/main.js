const express = require('express')
const mysql=require('mysql2/promise')
const app = express()
const cors=require('cors')
app.use(cors());
const addstorerouter=require('./router/Addstore_router')
const port = 5000
const Authrouter=require('./router/Auth_router')
const StoreRatingrouter=require('./router/StoreRating_router')
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',        
  password: '',        
  database: 'roxiler_codingchallenge'
})

connection.getConnection()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Error while connecting database", err))


app.use((req, res, next) => {
  req.db = connection
  next()
})
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
app.use(express.json());
app.use('/api',Authrouter);
app.use('/api',addstorerouter);
app.use('/api',StoreRatingrouter);
