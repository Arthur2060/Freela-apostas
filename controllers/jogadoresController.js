const service = require("../service/jogadoresService.js");

exports.get = async (req, res) => {
    try {
        const data = await service.get();
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await service.getById();
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.add = async (req, res) => {
    try {
        const data = await service.add(req);
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await service.update(req.params.id, req.body);
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const data = await service.delete(req.params.id);
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};