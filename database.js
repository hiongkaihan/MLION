import mysql from 'mysql2/promise'
import 'dotenv/config'

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})

export async function testConnection() {
    try {
        await pool.query('SELECT 1')
        console.log('Database connection established successfully.')
    } catch (err) {
        console.error('Error connecting to the database:', err)
        process.exit(1)
    }
}

const database = {
    // Get all items
    async getItems() {
        try {
            const [rows] = await pool.query('SELECT * FROM items')
            return rows
        } catch (err) {
            console.log('Error querying database:', err)
            return { err }
        }
    },

    // Get item by ID
    async getItemByID(id) {
        try {
            const [rows] = await pool.query(`
            SELECT * 
            FROM items
            WHERE id = ?
            `, [id])
            return rows[0]
        } catch (err) {
            console.log('Error querying database:', err)
            return { err }
        }
    },

    // Create new item
    async createItem(title, location_id) {
        try {
            const [result] = await pool.query(`
            INSERT INTO items (title, location_id)
            VALUES (?, ?)
            `, [title, location_id])
            return result.insertId
        } catch (err) {
            console.log('Error querying database:', err)
            return { err }
        }
    },

    // Update item title/location
    async updateItem(id, title, location_id) {
        try {
            const [result] = await pool.query(`
            UPDATE items
            SET title = ?, location_id = ?
            WHERE id = ?
            `, [title, location_id, id])
            return result.affectedRows
        } catch (err) {
            console.log('Error querying database', err)
            return { err }
        }
    },

    // Delete existing item
    async deleteItem(id) {
        try {
            const [result] = await pool.query(`
            DELETE FROM items
            WHERE id = ?
            `, [id])
            return result.affectedRows
        } catch (err) {
            console.log('Error querying database', err)
            return { err }
        }
    },

    // Get all locations
    async getLocations() {
        try {
            const [rows] = await pool.query('SELECT * FROM locations')
            return rows
        } catch (err) {
            console.log('Error querying database', err)
            return { err }
        }
    },

    // Get location by ID
    async getLocationByID(id) {
        try {
            const [rows] = await pool.query(`
            SELECT * 
            FROM locations
            WHERE id = ?
            `, [id])
            return rows[0]
        } catch (err) {
            console.log('Error querying database', err)
            return { err }
        }
    },

    // Get location by coordinates
    async getLocationByCoordinates(x_cor, y_cor) {
        try {
            const [rows] = await pool.query(`
            SELECT * 
            FROM locations
            WHERE x_cor = ? AND y_cor = ?
            `, [x_cor, y_cor])
            return rows[0]
        } catch (err) {
            console.log('Error querying database', err)
            return { err }
        }
    },

    // Create new location
    async createLocation(title, x_cor, y_cor) {
        try {
            const [result] = await pool.query(`
            INSERT INTO locations (title, x_cor, y_cor)
            VALUES (?, ?, ?)
            `, [title, x_cor, y_cor])
            return result.insertId
        } catch (err) {
            console.log('Error querying database', err)
            return { err }
        }
    },

    // Update location title/coordinates
    async updateLocation(id, title, x_cor, y_cor) {
        try {
            const [result] = await pool.query(`
            UPDATE locations
            SET title = ?, x_cor = ?, y_cor = ?
            WHERE id = ?
            `, [title, x_cor, y_cor, id])
            return result.affectedRows
        } catch (err) {
            console.log('Error querying database', err)
            return { err }
        }
    },

    // Delete existing location
    async deleteLocation(id) {
        try {
            const [result] = await pool.query(`
            DELETE FROM locations
            WHERE id = ?
            `, [id])
            return result.affectedRows
        } catch (err) {
            console.log('Error querying database', err)
            return { err }
        }
    }
}

export default database