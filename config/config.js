
import path from 'path'
import dotenv from 'dotenv'
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export const config = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    STRIPE_API: process.env.STRIPE_API,
    SUCCESS_URL: process.env.STRIPE_URL,
}