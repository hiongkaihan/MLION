import database from '../database.js'

// Get all locations
export async function getLocations(req, res) {
    try {
        const locations = await database.getLocations()

        return res.status(200).json(locations)
    } catch (err) {
        return res.status(500).json({ message: 'Unable to get locations!' })
    }
}

// Get a location by ID
export async function getLocationByID(req, res) {
    try {
        const locationId = req.params.id
        const location = await database.getLocationByID(locationId)

        if (!location) {
            return res.status(404).json({ message: 'Location not found!' })
        }

        return res.status(200).json(location)
    } catch (err) {
        return res.status(500).json({ message: 'Unable to get location!' })
    }
}

// Create a new location
export async function createLocation(req, res) {
    try {
        const { title, x_cor, y_cor } = req.body

        // Validate title
        if (!title || title.trim() === '' || title.length > 30) {
            return res.status(400).json({ message: 'Title must be a non-empty string and less than 30 characters!' });
        }
        // Validate coordinates
        if (!x_cor || !y_cor || !Number.isInteger(x_cor) || !Number.isInteger(y_cor)) {
            return res.status(400).json({ message: 'Invalid coordinates' });
        }
        // Check for existing location with same coordinates
        const existingLocation = await database.getLocationByCoordinates(x_cor, y_cor)
        if (existingLocation) {
            return res.status(400).json({ message: 'Location with these coordinates already exists!' })
        }

        const newLocationId = await database.createLocation(title, x_cor, y_cor)

        return res.status(201).json({ id: newLocationId, title, x_cor, y_cor })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Unable to create location!' })
    }
}

// Update a location
export async function updateLocation(req, res) {
    try {
        const locationId = req.params.id
        const { title, x_cor, y_cor } = req.body

        // Validate title
        if (!title || title.trim() === '' || title.length > 30) {
            return res.status(400).json({ message: 'Title must be a non-empty string and less than 30 characters!' });
        }
        // Validate coordinates
        if (!x_cor || !y_cor || !Number.isInteger(x_cor) || !Number.isInteger(y_cor)) {
            return res.status(400).json({ message: 'Invalid coordinates' });
        }
        // Check for existing location with same coordinates, but not the current location
        const existingLocation = await database.getLocationByCoordinates(x_cor, y_cor)
        if (existingLocation && existingLocation.id !== parseInt(locationId, 10)) {
            return res.status(400).json({ message: 'Location with these coordinates already exists!' })
        }

        const affectedRows = await database.updateLocation(locationId, title, x_cor, y_cor)
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Location not found!' })
        }

        return res.status(200).json({ message: 'Location updated successfully!' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Unable to update location!' })
    }
}

// Delete a location
export async function deleteLocation(req, res) {
    try {
        const locationId = req.params.id
        const affectedRows = await database.deleteLocation(locationId)

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Location not found!' })
        }

        return res.status(200).json({ message: 'Location deleted successfully!' })
    } catch (err) {
        return res.status(500).json({ message: 'Unable to delete location!' })
    }
}