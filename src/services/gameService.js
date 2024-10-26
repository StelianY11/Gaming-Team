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
    remove(gameId) {
        return Game.findByIdAndDelete(gameId);
    },
    edit(gameId, gameData) {
        return Game.findByIdAndUpdate(gameId, gameData, { runValidators: true });
    }
};

export default gameService;