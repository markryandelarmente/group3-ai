import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import { api } from "~/utils/api";
interface RecipeType {
  name: string;
  imageUrl: string;
}

const Home: NextPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string>("");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType>();
  const [cookingInstruction, setCookingInstruction] = useState<string[]>([]);
  const chat = api.chatgpt.generateResponse.useMutation();
  const chatImage = api.chatgpt.generateImage.useMutation();
  const cookingInstructions = api.chatgpt.generateCookingDetails.useMutation();
  const [flag, setFlag] = useState<boolean>(false);
  const [list, setList] = useState<string[]>([]);
  const [isIntructionsPage, setIsIntructionsPage] = useState(false);

  const handleSubmit = () => {
    setFlag(true);
    setList([]);
    chat.mutate({
      prompt: text,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (key === "Enter" && text !== "") {
      chat.mutate({
        prompt: text,
      });
      setFlag(true);
      setText("");
      setList([]);
    }
  };

  const handleCancel = () => {
    setFlag(false);
    setText("");
    setSelectedRecipe({
      name: "",
      imageUrl: "",
    });
    setCookingInstruction([]);
    setIsIntructionsPage(false);
    inputRef.current?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e?.target?.value);
  };

  const handleImage = async (text: string) => {
    const image = chatImage.mutate({
      prompt: text,
    });
  };

  const goToInstructions = (e: any) => {
    setSelectedRecipe(e);
    cookingInstructions.mutate({
      prompt: e.name,
    });
    setIsIntructionsPage(true);
  };

  const handleBackFromInstructions = () => {
    setSelectedRecipe({
      name: "",
      imageUrl: "",
    });
    setCookingInstruction([]);
    setIsIntructionsPage(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (cookingInstructions?.data) {
      setCookingInstruction(cookingInstructions?.data);
    }
  }, [cookingInstructions?.data]);

  useEffect(() => {
    if (chat.data) {
      let splitter = chat.data;
      let images = [
        { url: "https://picsum.photos/id/237/200/300" },
        { url: "https://picsum.photos/seed/picsum/200/300" },
        { url: "https://picsum.photos/200/300/?blur" },
      ];
      let finalData: any = splitter.map((item, index) => {
        return {
          name: item,
          imageUrl: images[index]?.url,
        };
      });
      setList(finalData);
    }
  }, [chat.data]);

  return (
    <>
      <Head>
        <title>Reciper Maker</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`flex min-h-screen flex-row items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]`}
      >
        <div
          className={`container flex flex-col justify-end ${
            flag
              ? "-translate-x-1/4 items-end overflow-hidden transition duration-700"
              : "translate-0 items-center overflow-hidden transition duration-700"
          } gap-12 px-4 py-16`}
        >
          <h1 className="animate-sample-animation text-lg font-extrabold tracking-tight text-white sm:text-[3rem]">
            Recipe Maker
          </h1>
          <input
            className={`block w-1/3 rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 ${
              flag ? "mr-9 sm:text-base" : "sm:text-xl"
            }`}
            required={true}
            ref={inputRef}
            type="text"
            value={text}
            placeholder="Enter your ingredients (separated by comma)"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button
            disabled={text ? false : true}
            onClick={handleSubmit}
            className={`group relative flex w-1/3 justify-center rounded-md bg-indigo-600 py-2 px-3 text-lg font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 ${
              flag ? "mr-9" : ""
            }`}
          >
            Make Recipe
          </button>
          {flag && (
            <button
              onClick={handleCancel}
              className={`group relative flex w-1/3 justify-center rounded-md bg-red-600 py-2 px-3 text-lg font-semibold text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-gray-300  ${
                flag ? "mr-9" : ""
              }`}
            >
              Reset
            </button>
          )}
        </div>
        {flag && (
          <div
            className={`flex h-screen w-full animate-sample-animation flex-col overflow-hidden bg-gray-400`}
          >
            {!isIntructionsPage ? (
              <div className="h-full bg-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Recipes
                    </h2>
                    <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
                      {!list ? (
                        <div className="flex h-screen w-full items-center justify-center border-[2px] border-red-400">
                          SADFDASFADSFDSAF
                        </div>
                      ) : (
                        list.map((item: any, index) => (
                          <div key={index} className="group relative">
                            <div className="sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1 lg:aspect-h-1 relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:h-64">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <h3 className="mt-6 text-sm text-gray-500">
                              <div onClick={() => goToInstructions(item)}>
                                <span className="absolute inset-0" />
                                {item.name}
                              </div>
                            </h3>
                            <p className="text-base font-semibold text-gray-900">
                              {item.name}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-row">
                <button
                  className="absolute bottom-0 float-right m-2 h-10 w-1/5 rounded bg-gray-600"
                  onClick={handleBackFromInstructions}
                >
                  Back
                </button>
                <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6">
                  <div className="border-gray-200 pr-2">
                    <div className="mb-5 flex justify-between">
                      <h1 className="flex items-end text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        {selectedRecipe?.name}
                      </h1>
                      <img
                        src={selectedRecipe?.imageUrl}
                        alt={selectedRecipe?.name}
                        className="h-1/4 w-1/4 rounded-lg object-cover object-center"
                      />
                    </div>
                    <div className="gap-4 rounded bg-gray-200 px-4 py-5 sm:px-6">
                      {cookingInstruction.map((item, index) => {
                        return (
                          <>
                            <div
                              className={`text-sm font-medium text-gray-500 ${
                                ["Instructions:"].includes(
                                  item.trim().toLowerCase()
                                )
                                  ? "mt-10"
                                  : ""
                              }`}
                            >
                              {item}
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
