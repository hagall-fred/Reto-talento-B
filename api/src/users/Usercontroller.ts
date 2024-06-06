import { NextFunction, Request, Response } from "express";
import UserSchemma from "./UserSchemma";
import bycrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import config from "../config/config";
import { AuthRequest } from "../middlewares/authenticate";

const register = async (req: Request, res:Response, next: NextFunction) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({error: 'All fields are required'});
    }

    const user = await UserSchemma.findOne({email});

    if(user){
        return res.status(400).json({error: 'User already exist'});
    }

    try{
        const hashedPassword = await bycrypt.hash(password, 10);
        const newUser = await UserSchemma.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            status: true,
            message: 'User created',
            data: {_id: newUser._id, email: newUser.email},
        })
    }catch (error){
        return res.status(500).json({ error: 'Somethin went wrong'});
    }
};

const login = async (req: Request, res:Response, next: NextFunction) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({error: 'All fields are required'});
    }

    const user = await UserSchemma.findOne({email});

    if(!user){
        return res.status(400).json({error: 'User not found'});
    }

    const isPasswordMatch = await bycrypt.compare(password, user.password);
    
    if(!isPasswordMatch){
        return res.status(400).json({error: 'Incorrect credentials'});
    }

    try {
        const token = sign({sub: user._id}, config.jwtSecret as string,{
            expiresIn: '1d',
        });

        return res.status(200).json({
            status: true,
            message: 'User loggedin',
            data: {_id: user._id, email: user.email},
            token,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Somethin went wrong'});
    }
};

const me = async (req: Request, res:Response, next: NextFunction) => {

    const _request = req as AuthRequest;
    const user = await UserSchemma.findById(_request.userId)

    if(user){
        return res.status(200).json({
            status: true,
            data: {_id: user._id, email: user.email, name: user.name, edad: user.edad, genero: user.genero, logo: user.logo},
        });
    }

    return res.status(500).json({ error: 'Somethin went wrong'});
};

const updateUser = async (req: Request, res: Response) => {

    const { name, email, edad, genero, logo} = req.body;
    const _request = req as AuthRequest;
    const user = await UserSchemma.findById(_request.userId)
    try {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Actualiza los campos necesarios
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }
        if (genero) {
            user.genero = genero;
        }
        if (edad) {
            user.edad = edad;
        }
        if (logo) {
            user.logo = logo;
        }

        // Guarda los cambios
        await user.save();

        return res.status(200).json({
            status: true,
            message: 'User data updated successfully',
            data: { email: user.email, genero: user.genero },
        });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

export {
    register,
    login,
    me,
    updateUser
}