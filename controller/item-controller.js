import database from '../database.js'

// Get all items
export async function getItems(req, res) {
    try {
        const items = await database.getItems()
        
        return res.status(200).json(items)
    } catch (err) {
        return res.status(500).json({ message: 'Unable to get items!' })
    }
}

// Get item by ID
export async function getItemByID(req, res) {
    try {
        const itemId = req.params.id
        const item = await database.getItemByID(itemId)

        if (!item) {
            return res.status(404).json({ message: 'Item not found!' })
        }

        return res.status(200).json(item)
    } catch (err) {
        return res.status(500).json({ message: 'Unable to get item!' })
    }
}

// Create a new item
export async function createItem(req, res) {
    try {
        const { title, location_id } = req.body

        // Validate title
        if (!title || title.trim() === '' || title.length > 30) {
            return res.status(400).json({ message: 'Title must be a non-empty string and less than 30 characters!' });
        }

        // Check if location exists
        const location = await database.getLocationByID(location_id)
        if (!location) {
            return res.status(400).json({ message: 'Invalid location ID!' })
        }

        const newItemId = await database.createItem(title, location_id)

        return res.status(201).json({ message: 'Item created successfully!', itemId: newItemId })
    } catch (err) {
        return res.status(500).json({ message: 'Unable to create item!' })
    }
}

// Update an existing item
export async function updateItem(req, res) {
    try {
        const itemId = req.params.id
        const { title, location_id } = req.body

        // Validate title
        if (!title || title.trim() === '' || title.length > 30) {
            return res.status(400).json({ message: 'Title must be a non-empty string and less than 30 characters!' });
        }
        // Check if location exists
        const location = await database.getLocationByID(location_id)
        if (!location) {
            return res.status(400).json({ message: 'Invalid location ID!' })
        }

        const affectedRows = await database.updateItem(itemId, title, location_id)
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found or no changes made!' })
        }

        return res.status(200).json({ message: 'Item updated successfully!' })
    } catch (err) {
        return res.status(500).json({ message: 'Unable to update item!' })
    }
}

// Delete an item
export async function deleteItem(req, res) {
    try {
        const itemId = req.params.id
        const affectedRows = await database.deleteItem(itemId)

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found!' })
        }

        return res.status(200).json({ message: 'Item deleted successfully!' })
    } catch (err) {
        return res.status(500).json({ message: 'Unable to delete item!' })
    }
}