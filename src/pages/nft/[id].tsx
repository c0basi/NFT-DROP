import React from "react";

const NFTDropPage = () => {
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className=" bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://links.papareact.com/8sg"
              alt=""
            />
          </div>
          <div className="text-center space-y-2 pt-3 px-2">
            <h1 className="text-3xl font-bold text-white">Dev Retro</h1>
            <h2 className="text-xl text-white">
              A collection of Developers that will take over the world
            </h2>
          </div>
        </div>
      </div>
      {/* Right  */}
      <div className="flex flex-1 flex-col lg:col-span-6 p-6 lg:p-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-extralight w-52 sm:w-80 cursor-pointer">
            {" "}
            The{" "}
            <span className="font-extrabold underline decoration-pink-500/50">
              Devs
            </span>{" "}
            NFT Market Place
          </h1>

          <button className="text-xs bg-rose-400 px-3 py-2 rounded-full font-bold text-white lg:px-5 lg:py-3">
            Sign in
          </button>
        </header>
        <hr className="my-2 border" />
        {/* Content */}
        <div className="mt-10 lg:mt-0 flex flex-1 flex-col items-center text-center justify-center space-y-6 ">
          <img
            className="w-80 pb-10 lg:h-40 object-cover"
            src="https://links.papareact.com/bdy"
            alt=""
          />
          <h1 className="font-bold text-3xl lg:font-extrabold lg:text-5xl">
            The Dev Retro Coding Club | NFT Drop
          </h1>
          <p className="pt-2 text-xl text-green-500 mb-10">
            13/21 NFTs claimed
          </p>
          <button className="inline-block mt-10 bg-red-500 w-full h-16 rounded-full">
            Mint nft (2.0Eth)
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTDropPage;
