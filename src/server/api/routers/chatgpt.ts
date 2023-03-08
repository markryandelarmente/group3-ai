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
      let structuredPrompt = `Give me 3 food recipe names for these ingredients: ${input.prompt}`;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: structuredPrompt,
        temperature: 0.8,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      let tempData = response.data.choices[0]?.text?.trim().split("\n");
      console.log("TEXT: ", tempData);
      tempData = tempData?.filter((e) => e.match(/\d/));
      return tempData;
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
      try {
        const response = await openai.createImage({
          prompt: input.prompt,
          n: 1,
          size: "256x256",
        });
        console.log("IMEDS: ", response.data.data[0]?.url);

        return response.data.data[0]?.url;
      } catch (error) {
        console.log("ERR: ", error);
      }
    }),
});

async function generateImage(list: string) {
  try {
    const res = await openai.createImage({
      prompt: list,
      n: 1,
      size: "256x256",
    });
    console.log("IMAGE", res.data.data[0]?.url);

    return res.data.data[0]?.url;
  } catch (error) {}
}
