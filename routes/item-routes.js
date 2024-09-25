import express from 'express'
import * as itemController from '../controller/item-controller.js'

const itemRouter = express.Router()

itemRouter.get('/', itemController.getItems)
itemRouter.get('/:id', itemController.getItemByID)
itemRouter.post('/', itemController.createItem)
itemRouter.put('/:id', itemController.updateItem)
itemRouter.delete('/:id', itemController.deleteItem)

export default itemRouter