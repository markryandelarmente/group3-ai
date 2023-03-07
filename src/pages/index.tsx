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

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string>("");
  const [flag, setFlag] = useState<boolean>(false);

  const handleSubmit = () => {
    console.log(text);
    setFlag(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (key === "Enter" && text !== "") {
      console.log(text);
      setFlag(true);
      setText("");
    }
  };

  const handleCancel = () => {
    setFlag(false);
    setText("");
    inputRef.current?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e?.target?.value);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
            placeholder="Enter your recipe"
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
            className={`flex h-screen w-full animate-sample-animation flex-row overflow-hidden bg-gray-400`}
          >
            <div className="flex w-full flex-col justify-center border-t border-gray-200">
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">Suka</div>
                <div className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  Datu Puti
                </div>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">Sili</div>
                <div className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  Ha?
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">Ginisa</div>
                <div className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  Mix
                </div>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">Water</div>
                <div className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  H2O
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">
                  Instructions
                </div>
                <div className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  Halua la tanan. Salamat
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p> */}
      </main>
    </>
  );
};

export default Home;
