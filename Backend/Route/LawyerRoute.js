import {addcase,view,search,update,deletee} from '../Controller/LawyerController.js'
import express  from 'express'

const Route=express.Router()
Route.post('/add',addcase),
Route.get('/view/:id',view),
Route.get('/search/:id',search),
Route.put('/update/:id',update),
Route.delete('/delete/:id',deletee)

export default Route