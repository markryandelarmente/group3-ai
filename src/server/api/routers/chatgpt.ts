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
      let structuredPrompt = `Give me 3 recipe names for these ingredients: ${input.prompt}`;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: structuredPrompt,
        temperature: 0.8,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return {
        result: response.data.choices[0]?.text,
      };
    }),
  generateCookingDetails: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      let structuredPrompt = `Give a full instruction on how to make ${input.prompt}`;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: structuredPrompt,
        temperature: 0.8,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return {
        result: response.data.choices[0]?.text,
      };
    }),
  generateImage: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      const res = await openai.createImage({
        prompt: input.prompt,
        n: 1,
        size: "256x256",
      });

      return {
        result: res.data.data[0]?.url,
      };
    }),
});
