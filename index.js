import express from 'express'
import cors from 'cors'
import './connection/mongodb.js'
import { config } from './config/config.js';
import { routes } from './routes/routes.js';
const port = process.env.PORT || 3000;
const app = express();
app.use(cors())
app.use(express.json())

app.use('/api/user', routes.userRoutes)
app.use('/api/student', routes.userRoutes)


app.listen(config.PORT, () => {
    console.log(`Server is running on ${port}`)
})