import { Schema, model, Types } from "mongoose";

const gameSchema = new Schema({
    name: {
        type: String,
        required: [true, "Game name is required!"],
        minLength: [4, "Game name must be at least 4 characters!"],
    },
    image: {
        type: String,
        required: [true, "Game img is required!"],
        validate: [/^https?:\/\//, "The image url must start with http:// or https://!"]
    },
    price: {
        type: Number,
        required: [true, "Game price is required!"],
        min: [0 , "Game price must be positive number!"],
    },
    description: {
        type: String,
        required: [true, "Game description is required!"],
        minLength: [10, "Game description must be at least 10 characters!"]
    },
    genre: {
        type: String,
        required: [true, "Game genre is required!"],
        minLength: [2, "Game genre must be at least 2 characters!"]
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