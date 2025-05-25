import {add,view,update,login} from '../Controller/UserController.js';
import express  from 'express'

const Route1=express.Router()
Route1.post('/add',add),
Route1.get('/view/:id',view),
Route1.get('/login/:email/:password',login),
Route1.put('/update/:id',update)

export default Route1