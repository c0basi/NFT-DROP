import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useContract,
} from "@thirdweb-dev/react";
import { GetServerSideProps } from "next";
import toast, { Toaster } from "react-hot-toast";
import { sanityClient, urlFor } from "../../../sanity";
import { Collection } from "../../../typings";
import Link from "next/link";
interface Props {
  collection: Collection;
}

const NFTDropPage = ({ collection }: Props) => {
  const MetaConnect = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<string>();
  const { contract: nftDrop } = useContract(collection.address, "nft-drop");

  useEffect(() => {
    if (!nftDrop) return;
    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll();
      setPrice(claimConditions?.[0].currencyMetadata.displayValue);
    };
    fetchPrice();
  }, [nftDrop]);

  useEffect(() => {
    if (!nftDrop) {
      console.log("returning");
      return;
    }
    const fetchNFTData = async () => {
      setLoading(true);
      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();
      console.log("total", total);

      setClaimedSupply(claimed.length);
      setTotalSupply(total);
      console.log("claiming");

      console.log(claimed, total);
      setLoading(false);
    };
    fetchNFTData();
  }, [nftDrop]);

  const mintNFT = () => {
    if (!nftDrop || !address) return;

    const quantity = 1;
    setLoading(true);
    const notification = toast.loading("Minting...", {
      style: {
        background: "white",
        color: "green",
        fontWeight: "bolder",
        fontSize: "17px",
        padding: "20px",
      },
    });

    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt;
        const claimedTokenId = tx[0].id;
        const claimedNFT = await tx[0].data();
        console.log("minitng");
        console.log(receipt, claimedTokenId, claimedNFT);
        toast("You successfully Minted!", {
          style: {
            background: "green",
            color: "white",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        });
      })
      .catch((err) => {
        console.log(err);
        toast("Something went wrong", {
          style: {
            background: "red",
            color: "white",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        });
      })
      .finally(() => {
        setLoading(false);
        toast.dismiss(notification);
      });
  };

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position="bottom-center" />
      {/* Left */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className=" bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.mainImage).url()}
              alt=""
            />
          </div>
          <div className="text-center space-y-2 pt-3 px-2">
            <h1 className="text-3xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-white">{collection.description}</h2>
          </div>
        </div>
      </div>
      {/* Right  */}
      <div className="flex flex-1 flex-col lg:col-span-6 p-6 lg:p-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href={"/"}>
            <h1 className="text-xl font-extralight w-52 sm:w-80 cursor-pointer">
              {" "}
              The{" "}
              <span className="font-extrabold underline decoration-pink-500/50">
                Devs
              </span>{" "}
              NFT Market Place
            </h1>
          </Link>

          <button
            onClick={() => (address ? disconnect() : MetaConnect())}
            className="text-xs bg-rose-400 px-3 py-2 rounded-full font-bold text-white lg:px-5 lg:py-3"
          >
            {address ? "Sign Out" : "Sign In"}
          </button>
        </header>
        <hr className="my-2 border" />
        {address && (
          <p className="text-center text-rose-500">
            You are logged in with wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}{" "}
          </p>
        )}
        {/* Content */}
        <div className="mt-10 lg:mt-0 flex flex-1 flex-col items-center text-center justify-center space-y-6 ">
          <img
            className="w-80 pb-10 lg:h-40 object-cover"
            src={urlFor(collection.previewImage).url()}
            alt=""
          />
          <h1 className="font-bold text-3xl lg:font-extrabold lg:text-5xl">
            {collection.title}
          </h1>
          {loading ? (
            <p className="pt-2 text-xl animate-pulse text-green-500 mb-10">
              Loading Supply Count...
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500 mb-10">
              {claimedSupply}/{totalSupply?.toString()} NFTs claimed
            </p>
          )}
          {loading ? (
            <img src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif" />
          ) : null}
        </div>

        <button
          onClick={mintNFT}
          disabled={
            !address || claimedSupply === totalSupply?.toNumber() || loading
          }
          className=" mt-10 bg-red-500 w-full h-16 rounded-full text-white text-bold disabled:bg-gray-500"
        >
          {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>Sold Out</>
          ) : !address ? (
            <>Sign in to mint</>
          ) : (
            <span className="font-bold">Mint NFT ({price} ETH)</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default NFTDropPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == 'collection' && slug.current == $id][0]{
    _id, title,address,description,nftCollectionName,
      mainImage{
    asset,
    },
    previewImage{
    asset,},
    slug{
    current, },
      author -> {
      name
    },creator ->{
      _id,name, address,
      slug{
    current,},
    }
    }`;

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  });
  if (!collection) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
    },
  };
};
