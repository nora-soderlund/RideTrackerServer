import { FastifyReply, FastifyRequest } from "fastify";
import { getActivityById } from "../models/activities";
import { getBikeById } from "../models/bikes";
import { getUserById } from "../models/users";
import { UserKey, getUserKeyById } from "../models/users/keys";
import { getActivityLike } from "../models/activities/likes";
import { getActivitySummary } from "../models/activities/summary";
import { getBikeSummary } from "../models/bikes/summary";
import { getLatestActivityComment } from "../models/activities/comments";

export async function activityHandler(request: FastifyRequest, reply: FastifyReply) {
    const activity = await getActivityById((request.params as any).id);

    if(activity === null)
        return { error: "Activity doesn't exist." };

    const activitySummary = await getActivitySummary(activity);

    const author = await getUserById(activity.user);

    if(author === null)
        return { error: "Activity author doesn't exist." };

    const activityComment = await getLatestActivityComment(activity);
    const activityCommentUser = activityComment && await getUserById(activityComment.user);
    
    const bike = activity.bike && await getBikeById(activity.bike);
    const bikeSummary = bike && await getBikeSummary(bike);

    const userKey = await getUserKeyById(request.headers.authorization as string) as UserKey;

    return {
        ...activity,

        summary: activitySummary && {
            area: activitySummary.area,
            distance: activitySummary.distance,
            averageSpeed: activitySummary.averageSpeed,
            elevation: activitySummary.elevation,
            maxSpeed: activitySummary.maxSpeed,
            comments: activitySummary.comments
        },

        likes: (userKey?.user === author.id)?(null):((await getActivityLike(activity, userKey.user)) !== null),

        user: {
            id: author.id,
            name: author.firstname + " " + author.lastname,
            avatar: author.avatar
        },

        comment: activityComment && {
            message: activityComment.message,
            timestamp: activityComment.timestamp,

            user: activityCommentUser && {
                id: activityCommentUser.id,
                name: activityCommentUser.firstname + " " + activityCommentUser.lastname,
                avatar: author.avatar
            }
        },

        bike: bike && {
            id: bike.id,
            name: bike.name,
            model: bike.model,
            image: bike.image,

            summary: bikeSummary && {
                rides: bikeSummary.rides,
                distance: bikeSummary.distance,
                elevation: bikeSummary.elevation
            }
        }
    };
};
