import { FastifyReply, FastifyRequest } from "fastify";
import { compareUserPassword, createUser, getUserByEmail, getUserById } from "../models/users";
import { createUserKey, deleteUserKey, getUserKeyById } from "../models/users/keys";

export async function userHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = await getUserById((request.params as any).id);

    if(user === null)
        return { error: "User doesn't exist." };

    return user;
};

export async function loginUserHandler(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;

    const email: string = body.email;

    const user = await getUserByEmail(email);

    if(user === null)
        return { error: "This email address is not registered to anyone!" };

    const password: string = body.password;

    if(!(await compareUserPassword(user, password)))
        return { error: "Password does not match!" };

    const userKey = await createUserKey(user.id);

    if(!userKey)
        return { error: "Something went wrong when logging in!" };

    return { key: userKey.id };
};

export async function registerUserHandler(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;

    const firstname: string = body.firstname;
    const lastname: string = body.lastname;

    if(firstname.length < 2 || lastname.length < 2)
        return { error: "Your first- and lastname must be at least 2 characters each." };

    const email: string = body.email;

    if(!email.includes('@') || !email.split('@')[1].includes('.') || email.endsWith('.'))
        return { error: "You must enter a valid email address." };

    if((await getUserByEmail(email)) !== null)
        return { error: "This email address is already registered." };

    const password: string = body.password;

    if(password.length < 4)
        return { error: "You must enter a password at least 4 characters long." };

    const user = await createUser(firstname, lastname, email, password);

    if(!user)
        return { error: "Something went wrong when creating your user!" };

    const userKey = await createUserKey(user.id);

    if(!userKey)
        return { error: "Something went wrong when logging in, please try signing in manually!" };

    return { key: userKey.id };
};

export async function authenticateUserHandler(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;

    const key: string = body.key;

    let userKey = await getUserKeyById(key);

    if(!userKey)
        return { key: null };

    await deleteUserKey(userKey);

    const user = await getUserById(userKey.user);

    if(!user)
        return { key: null };

    userKey = await createUserKey(userKey.user);

    if(!userKey)
        return { key: null };

    return {
        key: userKey.id,

        user: {
            name: user.firstname + " " + user.lastname,
            avatar: user.avatar
        }
    };
};
