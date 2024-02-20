import { bot } from "../config/bot.ts";
const GROUP = Deno.env.get("GROUP") as string;

import json from "https://raw.githubusercontent.com/deep5050/programming-memes/main/memes.json" with { type: "json" }

Deno.cron("send a meme", "* * * * *", async() => {
    const randomIndex = Math.floor(Math.random() * json.length);
    await bot.api.sendPhoto(
        GROUP, 
        "https://raw.githubusercontent.com/deep5050/programming-memes/main/" + 
        json[randomIndex].path)
})