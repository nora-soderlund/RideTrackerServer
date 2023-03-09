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

    const bike = activity.bike && await getBikeById(activity.bike);

    return {
        ...activity,

        user: {
            id: user.id,
            name: user.firstname + " " + user.lastname,
            avatar: user.avatar
        },

        bike: bike && {
            id: bike.id,
            name: bike.name,
            model: bike.model,
            image: bike.image
        }
    };
};
