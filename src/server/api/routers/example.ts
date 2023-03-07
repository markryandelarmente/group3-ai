import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getRecipeList: publicProcedure
  .input(z.object({ text: z.string() }))
  .query(async ({input}) =>{
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      // prompt: animal,
      prompt:"give me 3 recipe names for these ingredients: egg, hotdog. In Array format" ,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(completion.data)
    return {
      recipe: [
        "test"
      ]
    }
  })
});
