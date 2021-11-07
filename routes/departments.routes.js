import { Router } from "express"
import controller from '../controllers/departments.js'

const router = Router()
router.get('/',controller.index)
router.post('/create',controller.create)
router.get('/update/:id',controller.getById)
router.post('/update/:id',controller.update)
router.post('/cstate/:id',controller.changeState)

export default router