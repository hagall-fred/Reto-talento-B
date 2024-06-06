import express from 'express'
import { login, me, register, updateUser } from './Usercontroller';
import authenticate from '../middlewares/authenticate';


const UserRoute = express.Router();

UserRoute.post('/register', register);
UserRoute.post('/updateUser', authenticate ,updateUser)
UserRoute.post('/login', login);
UserRoute.get('/me', authenticate, me)

export default UserRoute;