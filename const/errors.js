const setError = (code, message) => ({code, message});

const errors = {
    400.1: setError(400, "the \"name\" value isn't in headers"),
    400.2: setError(400, "argument LIMIT invalid"),
    400.3: setError(400, "the \"user\" string value isn't in headers"),
    404.1: setError(404, "route not found in server API"),
    404.2: setError(404, "user not found in server"),
    405: setError(405, "method not allowed"),
    409.1: setError(409, "participant already registered"),
    422.1: setError(422, ""),
};

export default errors;