const service = require("../service/authService.js");

exports.register = async (req, res) => {
    try {
        const data = await service.register(req.body);
        return res.status(201).json(data);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }  
};

exports.login = async (req, res) => {
    try {
        const data = await service.login(req.body);

        if (!data) {
            return res.status(500).json({ error: "Usuário não encontrado!" })
        }

        return res.json(data);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }  
};