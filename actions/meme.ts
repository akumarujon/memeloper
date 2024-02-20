import { MyContext, MyConversation } from "../config/bot.ts";
import { createConversation } from "https://deno.land/x/grammy_conversations@v1.2.0/conversation.ts";
import { bot } from "../config/index.ts";
import { InlineKeyboard } from "../deps.ts";

const kv = await Deno.openKv()
const ADMIN = "5317740617"
const GROUP = "-4124723873"

async function meme(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply("Send me the meme.");
  const conv = await conversation.wait();
  const message = conv!.message 

  if(!message?.photo) {
    await ctx.reply("You didn't send a photo.");
    return;
  }


  await kv.set(["last"], ctx.chat?.id)
  await ctx.api.sendPhoto(
    ADMIN,
    message.photo[message.photo.length - 1].file_id,
    {
      reply_markup: new InlineKeyboard().text("Approve", "approve").text("Decline", "decline")
    }
    )
  await ctx.reply("Your meme is sent to administrator. Wait for confirmation.");
}

bot.use(createConversation(meme));

bot.on("callback_query", async (ctx) => {
  const last = (await kv.get(["last"])).value as number;
  switch(ctx.callbackQuery.data) {
    case "approve":
      await ctx.api.sendMessage(last, "Your meme is approved!");
      await ctx.api.deleteMessage(ctx.chat!.id, ctx.callbackQuery.message!.message_id);
      await ctx.api.sendPhoto(GROUP,ctx.callbackQuery.message?.photo?.slice(-1)[0].file_id as string)
      await ctx.reply("The meme is sent to group")
      break;
    case "decline":
      await ctx.api.sendMessage(last, "Your meme is declined!");
      break;
  }
})

bot.command("meme", async (ctx) => {
  await ctx.conversation.enter("meme");
});
