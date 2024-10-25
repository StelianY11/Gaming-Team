import { Router } from "express";

import homeController from "./controllers/homeController.js";
import authController from "./controllers/authController.js";
import gameController from "./controllers/gameController.js";

const router = Router();

router.use(homeController);
router.use("/auth", authController);
router.use("/games", gameController)

router.all("*", (req, res) => {
    res.render('home/404', { title: 'Page Not Found' });
});

export default router;