import { FastifyReply, FastifyRequest } from "fastify";
import { getActivityById } from "../models/activities";
import { getBikeById } from "../models/bikes";
import { getUserById } from "../models/users";

export async function activityHandler(request: FastifyRequest, reply: FastifyReply) {
    const activity = await getActivityById((request.params as any).id);

    if(activity === null)
        return { error: "Activity doesn't exist." };

    const user = await getUserById(activity.user);

    if(user === null)
        return { error: "Activity user doesn't exist." };

    return {
        ...activity,

        user: {
            id: user.id,
            name: user.firstname + " " + user.lastname,
            avatar: user.avatar
        }
    };
};
