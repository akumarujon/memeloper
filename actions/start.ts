import { bot } from "../config/index.ts";

bot.command("start", async (ctx) => {
  await ctx.reply("Hello, world!");
});
