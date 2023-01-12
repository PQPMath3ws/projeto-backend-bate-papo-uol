import Joi from "joi";

const ParticipantsSchema = Joi.object({
    name: Joi.string().min(3).max(40).regex(/^(?!todos$)/i).required(),
    lastStatus: Joi.number().integer().required(),
});

async function validateParticipant(participant) {
    try {
        await ParticipantsSchema.validateAsync(participant);
        return {
            status: "ok",
            message: "participant validated successfully",
        };
    } catch (error) {
        return {
            status: "error",
            message: error.details[0].message,
        };
    }
}

export { validateParticipant };