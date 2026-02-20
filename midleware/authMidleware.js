module.exports = function verificarAdmin(req, res, next) {
    if (!req.user.admin) {
        return res.status(403).json({ erro: "Acesso negado" });
    }
    next();
}