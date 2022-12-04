import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";

interface Props {
  collections: Collection[];
}

const Home = ({ collections }: Props) => {
  return (
    <div className="max-w-7xl mx-auto mon-h-screen py-20 px-10 flex flex-col ">
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-3xl mb-10 font-extralight ">
        {" "}
        The{" "}
        <span className="font-extrabold underline decoration-pink-500/50">
          Devs
        </span>{" "}
        NFT Market Place
      </h1>
      <main className="bg-slate-100 p-10 rounded-lg shadow-lg shadow-rose-500/20">
        <div className="grid space-x-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {collections.map((collection) => (
            <Link href={`/nft/${collection.slug.current}`}>
              <div className="flex flex-col items-center transition-all cursor-pointer duration-100 ease-out hover:scale-110">
                <img
                  className="h-96 w-60 rounded-lg object-cover"
                  src={urlFor(collection.mainImage).url()}
                />
                <div>
                  <h2 className="text-3xl ">{collection.title}</h2>
                  <p className="mt-2 text-sm text-gray-400">
                    {collection.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == 'collection']{
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

  const collections = await sanityClient.fetch(query);
  console.log(collections);

  return {
    props: {
      collections,
    },
  };
};
