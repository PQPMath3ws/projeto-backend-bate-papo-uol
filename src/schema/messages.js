import Joi from "joi";

const MessagesSchema = Joi.object({
    from: Joi.string().min(3).max(40).required(),
    to: Joi.string().min(3).max(40).required(),
    text: Joi.string().min(1).max(200).required(),
    type: Joi.string().alphanum().min(7).max(15).regex(/^message$|^private_message$/).required(),
    time: Joi.string().min(8).max(8).regex(/^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/).required(),
});

async function validateMessage(message) {
    try {
        await MessagesSchema.validateAsync(message);
        return {
            status: "ok",
            message: "message validated successfully",
        };
    } catch (error) {
        return {
            status: "error",
            message: error.details[0].message,
        };
    }
}

export { validateMessage };