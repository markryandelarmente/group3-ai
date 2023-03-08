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
      let structuredPrompt = `Give me 6 food recipe names for these ingredients: ${input.prompt}`;

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
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      let formattedData = response.data.choices[0]?.text?.trim().split("\n");
      formattedData = formattedData?.filter((e) => e);
      return formattedData;
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
