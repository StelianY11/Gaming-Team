import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        minLength: [5, "Username should be at least 5 characters!"],
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        minLength: [10, "Email should be at least 10 characters!"],
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minLength: [4, "Password should be at least 4 characters!"],
    }
});

userSchema.pre("save", async function () {
    const hash = await bcrypt.hash(this.password, SALT_ROUNDS);

    this.password = hash;
});

const User = model("User", userSchema);

export default User;