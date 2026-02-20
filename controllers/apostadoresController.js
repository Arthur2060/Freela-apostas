const service = require("../service/apostadoresService.js");

exports.get = async (req, res) => {
    try {
        const data = await service.get();
        return res.json(data)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await service.getById();
        return res.json(data)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.add = async (req, res) => {
    try {
        const data = await service.add(req.body);
        return res.json(data)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await service.update(req.params.id, req.body);
        return res.json(data)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const data = await service.delete(req.params.id);
        return res.json(data)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};