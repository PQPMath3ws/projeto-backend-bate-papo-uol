const setError = (code, message) => ({code, message});

const errors = {
    404: setError(404, "Rota não encontrada na API do servidor!"),
};

export default errors;