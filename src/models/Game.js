import { Schema, model, Types } from "mongoose";

const gameSchema = new Schema({
    name: {
        type: String,
        required: [true, "Game name is required!"],
    },
    image: {
        type: String,
        required: [true, "Game img is required!"],
    },
    price: {
        type: Number,
        required: [true, "Game price is required!"],
    },
    description: {
        type: String,
        required: [true, "Game description is required!"],
    },
    platform: {
        type: String,
        required: [true, "Game platform is required!"],
        enum: ["PC", "Nintendo", "PS4", "PS5", "XBOX"]
    },
    owner: {
        type: Types.ObjectId,
        ref: "User",
    },
    boughtBy: [{
        type: Types.ObjectId,
        ref: "User",
    }]
});

const Game = model("Game", gameSchema);

export default Game;