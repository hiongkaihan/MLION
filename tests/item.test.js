import request from 'supertest'
import app from '../index.js'
import database from '../database.js'

jest.mock('../database.js')

describe('Item API', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test('GET /item - should return all items', async () => {
        const mockItems = [{ id: 1, title: 'Item1', location_id: 1 }]
        database.getItems.mockResolvedValue(mockItems)

        const response = await request(app).get('/item')
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(mockItems)
    })

    test('GET /item/:id - should return item by ID', async () => {
        const mockItem = { id: 1, title: 'Item1', location_id: 1 }
        database.getItemByID.mockResolvedValue(mockItem)

        const response = await request(app).get('/item/1')
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(mockItem)
    })

    test('GET /item/:id - should return 404 for non-existent item', async () => {
        database.getItemByID.mockResolvedValue(null)

        const response = await request(app).get('/item/999')
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ message: 'Item not found!' })
    })

    test('POST /item - should create a new item', async () => {
        const newItem = { title: 'New Item', location_id: 1 }
        const newItemId = 1
        database.getLocationByID.mockResolvedValue({ id: 1 })
        database.createItem.mockResolvedValue(newItemId)

        const response = await request(app)
            .post('/item')
            .send(newItem)

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({ message: 'Item created successfully!', itemId: newItemId })
    })

    test('POST /item - should return 400 for invalid title', async () => {
        const invalidItem = { title: '', location_id: 1 }
        const response = await request(app)
            .post('/item')
            .send(invalidItem)

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ message: 'Title must be a non-empty string and less than 30 characters!' })
    })

    test('POST /item - should return 400 for invalid location ID', async () => {
        const newItem = { title: 'New Item', location_id: 999 }
        database.getLocationByID.mockResolvedValue(null)

        const response = await request(app)
            .post('/item')
            .send(newItem)

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ message: 'Invalid location ID!' })
    })

    test('PUT /item/:id - should update an existing item', async () => {
        const updatedItem = { title: 'Updated Item', location_id: 1 }
        database.getLocationByID.mockResolvedValue({ id: 1 })
        database.updateItem.mockResolvedValue(1)

        const response = await request(app)
            .put('/item/1')
            .send(updatedItem)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({ message: 'Item updated successfully!' })
    })

    test('PUT /item/:id - should return 404 for non-existent item', async () => {
        const updatedItem = { title: 'Updated Item', location_id: 1 }
        database.getLocationByID.mockResolvedValue({ id: 1 })
        database.updateItem.mockResolvedValue(0)

        const response = await request(app)
            .put('/item/999')
            .send(updatedItem)

        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ message: 'Item not found or no changes made!' })
    })

    test('DELETE /item/:id - should delete an item', async () => {
        database.deleteItem.mockResolvedValue(1)

        const response = await request(app).delete('/item/1')
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({ message: 'Item deleted successfully!' })
    })

    test('DELETE /item/:id - should return 404 for non-existent item', async () => {
        database.deleteItem.mockResolvedValue(0)

        const response = await request(app).delete('/item/999')
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ message: 'Item not found!' })
    })
})