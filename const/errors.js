const setError = (code, message) => ({code, message});

const errors = {
    404: setError(404, "Rota não encontrada na API do servidor!"),
    405: setError(405, "Método não permitido!"),
};

export default errors;