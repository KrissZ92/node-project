import express from 'express'
import { register, login, logout, isAuthenticated } from '../controllers/authController.js'
const router = express.Router()

// rutas para las vistas
router.get('/', isAuthenticated, (req, res) => { 
    res.render('index', {user: req.session.user})
})
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/logout', logout);

router.get('/register', (req, res) => {
    res.render('register')
})


// rutas para los controllers
router.post('/register', register)
router.post('/login', login)

export default router