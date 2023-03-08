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
  .input(z.object({ text: z.string().nullish() }).nullish())
  .query(async ({input}) =>{
    try{
      console.log(input)
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
      if(completion.data?.choices[0] && completion.data?.choices[0].text){
        console.log(completion.data?.choices[0].text)
        return {
          recipe:  completion.data?.choices[0].text
        }
      }
      return {
        recipe: []
      }
    }
    catch(e){
      console.log(e)
    }
    
  })
});
