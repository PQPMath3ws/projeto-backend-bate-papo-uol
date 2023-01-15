const setError = (code, message) => ({code, message});

const errors = {
    400.1: setError(400, "the \"name\" value isn't in headers"),
    400.2: setError(400, "argument \"limit\" invalid"),
    400.3: setError(400, "the \"user\" string value isn't in headers"),
    401.1: setError(401, "you aren't allowed to delete this message"),
    404.1: setError(404, "route not found in server API"),
    404.2: setError(404, "user not found in server"),
    404.3: setError(404, "message not found in database"),
    405: setError(405, "method not allowed"),
    409.1: setError(409, "participant already registered"),
    415: setError(415, "invalid content-type"),
    422.1: setError(422, ""),
};

export default errors;