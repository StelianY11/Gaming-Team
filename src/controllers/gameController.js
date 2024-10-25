import { Router } from "express";

const gameController = Router();

gameController.get("/", (req, res) => {
    res.render("games", {title: "Catalog Page - Gaming Team"})
});

export default gameController;