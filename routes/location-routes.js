import express from 'express'
import * as locationController from '../controller/location-controller.js'

const locationRouter = express.Router()

locationRouter.get('/', locationController.getLocations)
locationRouter.get('/:id', locationController.getLocationByID)
locationRouter.post('/', locationController.createLocation)
locationRouter.put('/:id', locationController.updateLocation)
locationRouter.delete('/:id', locationController.deleteLocation)

export default locationRouter