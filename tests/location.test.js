import request from 'supertest'
import app from '../index.js'
import database from '../database.js'

jest.mock('../database.js')

describe('Location API', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test('GET /location - should return all locations', async () => {
        const mockLocations = [{ id: 1, title: 'Park', x_cor: 12.34, y_cor: 56.78 }]
        database.getLocations.mockResolvedValue(mockLocations)

        const response = await request(app).get('/location')
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(mockLocations)
    })

    test('GET /location/:id - should return location by ID', async () => {
        const mockLocation = { id: 1, title: 'Park', x_cor: 12.34, y_cor: 56.78 }
        database.getLocationByID.mockResolvedValue(mockLocation)

        const response = await request(app).get('/location/1')
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(mockLocation)
    })

    test('GET /location/:id - should return 404 for non-existent location', async () => {
        database.getLocationByID.mockResolvedValue(null)

        const response = await request(app).get('/location/999')
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ message: 'Location not found!' })
    })

    test('POST /location - should create a new location', async () => {
        database.getLocationByCoordinates.mockResolvedValue(null)
        database.createLocation.mockResolvedValue(1)

        const response = await request(app)
            .post('/location')
            .send({ title: 'New Park', x_cor: 12.34, y_cor: 56.78 })

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({ id: 1, title: 'New Park', x_cor: 12.34, y_cor: 56.78 })
    })

    test('POST /location - should return error if title is empty', async () => {
        const response = await request(app)
            .post('/location')
            .send({ title: '', x_cor: 12.34, y_cor: 56.78 })

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ message: 'Title must be a non-empty string and less than 30 characters!' })
    })

    test('POST /location - should return error if location with same coordinates exists', async () => {
        database.getLocationByCoordinates.mockResolvedValue({ id: 1 })

        const response = await request(app)
            .post('/location')
            .send({ title: 'Another Park', x_cor: 12.34, y_cor: 56.78 })

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ message: 'Location with these coordinates already exists!' })
    })

    test('PUT /location/:id - should update an existing location', async () => {
        database.getLocationByCoordinates.mockResolvedValue(null)
        database.updateLocation.mockResolvedValue(1)

        const response = await request(app)
            .put('/location/1')
            .send({ title: 'Updated Park', x_cor: 12.34, y_cor: 56.78 })

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({ message: 'Location updated successfully!' })
    })

    test('PUT /location/:id - should return 404 for non-existent location', async () => {
        database.updateLocation.mockResolvedValue(0)

        const response = await request(app)
            .put('/location/999')
            .send({ title: 'Updated Park', x_cor: 12.34, y_cor: 56.78 })

        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ message: 'Location not found!' })
    })

    test('DELETE /location/:id - should delete an existing location', async () => {
        database.deleteLocation.mockResolvedValue(1)

        const response = await request(app).delete('/location/1')
        expect(response.statusCode).toBe(204)
    })

    test('DELETE /location/:id - should return 404 for non-existent location', async () => {
        database.deleteLocation.mockResolvedValue(0)

        const response = await request(app).delete('/location/999')
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ message: 'Location not found!' })
    })
})