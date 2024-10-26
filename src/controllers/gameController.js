import { Router } from "express";
import gameService from "../services/gameService.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const gameController = Router();

gameController.get("/", async (req, res) => {
    const games = await gameService.getAll().lean();
    res.render("games", { games, title: "Catalog Page - Gaming Team" })
});

gameController.get("/create", isAuth, (req, res) => {
    const gameData = req.body;
    const gameDataType = getGameDataType(gameData);

    res.render("games/create", { gamePlatformType: gameDataType, title: "Catalog Page - Gaming Team" })
});

gameController.post("/create", isAuth, async (req, res) => {
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

gameController.get("/search", isAuth, async (req, res) => {
    const searchFilter = req.query
    const games = await gameService.getAll(searchFilter).lean();
    const gameDataType = getGameDataType(searchFilter);

    res.render("games/search", { games, searchFilter, gamePlatformType: gameDataType, title: "Search - Gaming Team" })
});

gameController.get("/:gameId/details", async (req, res) => {
    const game = await gameService.getOne(req.params.gameId).lean();
    const isOwner = game.owner.toString() === req.user?._id;

    const boughtGame = game.boughtBy?.some(userId => userId.toString() === req.user?._id);

    res.render("games/details", { game, isOwner, boughtGame, title: "Details Page" })
});

gameController.get("/:gameId/vote", async (req, res) => {
    const gameId = req.params.gameId;
    const userId = req.user._id;

    if (await isGameOwner(gameId, userId)) {
        return res.redirect("/404")
    }

    try {
        await gameService.buy(gameId, userId);

        res.redirect(`/games/${gameId}/details`);
    } catch (err) {
        console.log(err);

    }
});

gameController.get("/:gameId/edit", isAuth, async (req, res) => {
    const game = await gameService.getOne(req.params.gameId).lean();
    const gameDataType = getGameDataType(game);
    const gameId = req.params.gameId;
    const userId = req.user._id;

    if (!(await isGameOwner(gameId, userId))) {
        return res.redirect("/404")
    }

    res.render("games/edit", { game, gamePlatformType: gameDataType, title: "Edit Page - Gaming Team" })
});

gameController.post("/:gameId/edit", isAuth, async (req, res) => {
    const gameData = req.body;
    const gameId = req.params.gameId;
    const userId = req.user._id;

    if (!(await isGameOwner(gameId, userId))) {
        return res.redirect("/404");
    }

    try {
        await gameService.edit(gameId, gameData);

        res.redirect(`/games/${gameId}/details`);
    } catch (err) {
        console.log(err);
    }
});

gameController.get("/:gameId/delete", isAuth, async (req, res) => {
    const gameId = req.params.gameId;
    const userId = req.user._id;

    if (!(await isGameOwner(gameId, userId))) {
        return res.redirect("/404");
    }

    try {
        await gameService.remove(gameId);

        res.redirect("/games");
    } catch (err) {
        console.log(err);
    }
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
    const isOwner = game.owner.toString() === userId;

    return isOwner;
}

export default gameController;