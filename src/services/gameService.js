import Game from "../models/Game.js";

const gameService = {
    create(gameData, userId){
        return Game.create({ ...gameData, owner: userId });
    },
    getAll(filter = {}){
        return Game.find();
    },
};

export default gameService;