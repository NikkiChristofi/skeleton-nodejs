import '@babel/polyfill'

import express from 'express'
import bodyParser from 'body-parser'
import cors from './lib/cors'


const app = express()
const router = express.Router()
app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors())
app.use('/', router)

router.get('/', (request, response) => {
  response.send({ uptime: process.uptime() })
})

const server = app.listen(process.env.port || process.env.PORT || 3010, () => {
  console.log(`${process.env.API_NAME || 'API'} is listening on: port ${process.env.PORT}`)
  process
    .on('SIGTERM', () => serverStop('SIGTERM', server))
    .on('SIGINT', () => serverStop('SIGINT', server))
})

function serverStop (condition, server) {
  console.log(`${condition} received, stopping the server`)
  server.close(() => {
    console.log('Done!')
  })
  setTimeout(() => {
    console.log('Server did not stop gracefully in time! Forcefully terminating the process!')
    process.exit(-1)
  }, 3000).unref()
}

export default app