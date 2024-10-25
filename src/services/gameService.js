import Game from "../models/Game.js";

const gameService = {
    create(gameData, userId) {
        return Game.create({ ...gameData, owner: userId });
    },
    getAll(filter = {}) {
        return Game.find();
    },
    getOne(gameId) {
        return Game.findById(gameId);
    },
    buy(gameId, userId) {
        return Game.findByIdAndUpdate(gameId, { $push: { boughtBy: userId } });
    },
};

export default gameService;