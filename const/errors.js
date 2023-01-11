const setError = (code, message) => ({code, message});

const errors = {
    400.1: setError(400, "Nome de usuário não presente nos headers"),
    400.2: setError(400, "Argumento LIMIT é inválido"),
    404: setError(404, "Rota não encontrada na API do servidor!"),
    405: setError(405, "Método não permitido!"),
};

export default errors;