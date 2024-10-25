import { Router } from "express";
import gameService from "../services/gameService.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const gameController = Router();

gameController.get("/", async (req, res) => {
    const games = await gameService.getAll().lean();
    res.render("games", { games, title: "Catalog Page - Gaming Team" })
});

gameController.get("/create", (req, res) => {
    const gameData = req.body;
    const gameDataType = getGameDataType(gameData);

    res.render("games/create", { gamePlatformType: gameDataType, title: "Catalog Page - Gaming Team" })
});

gameController.post("/create", async (req, res) => {
    const gameData = req.body;
    const userId = req.user._id;

    try {
        await gameService.create(gameData, userId);

        res.redirect("/games")
    } catch (err) {
        const gameDataType = getGameDataType(gameData);
        const error = getErrorMessage(err);
        res.render("games/create", { game: gameData, gamePlatformType: gameDataType, error, title: "Catalog Page - Gaming Team" })
    }
});

gameController.get("/:gameId/details", async (req, res) => {
    const game = await gameService.getOne(req.params.gameId).lean();

    res.render("games/details", { game, title: "Details Page" })
});

function getGameDataType({ platform }) {
    const gamePlatform = [
        "PC",
        "Nintendo",
        "PS4",
        "PS5",
        "XBOX"
    ];

    const viewData = gamePlatform.map(type => ({
        value: type,
        label: type,
        selected: platform === type ? "selected" : ""
    }))

    return viewData;
}

async function isGameOwner(gameId, userId) {
    const game = await gameService.getOne(gameId);
    const isOwner = game.owner.toStrong() === userId;

    return isOwner;
}

export default gameController;