import express from 'express'
import cors from 'cors'
import itemRouter from './routes/item-routes.js'
import locationRouter from './routes/location-routes.js'
import { testConnection } from './database.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/item', itemRouter)
app.use('/location', locationRouter)
const PORT = 8000

async function startServer() {
    await testConnection()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
}

startServer()

export default app