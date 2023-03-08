import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

export const chatGPTRouter = createTRPCRouter({
  generateResponse: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      let structuredPrompt = `Make a list of recipe using this ingredients: ${input.prompt}`;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: structuredPrompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return {
        result: response.data.choices[0]?.text,
      };
    }),
});
