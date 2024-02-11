import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Feature_collections_data from "../../data/Feature_collections_data";
import { useAccount } from "wagmi";
import { ethers, BigNumber } from "ethers";
import NFTContract from "../../contract_data/contract_NFT";
import NFT_ABI from "../../contract_data/NFT_Abi.json";

const Explore_collection_item_help = ({ nftDet }) => {
    return(
        <div>
            {nftDet.map((item, index) => {
                return (
                    <article key={parseInt(BigNumber.from(item[0]).toBigInt())}>
                      <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                        <Link href="/collection/avatar_1">
                          <a className="flex space-x-[0.625rem]">
                            <span className="w-[74.5%]">
                              <img
                                src={`https://ipfs.io/ipfs/${item[2]}`}
                                alt="item 1"
                                className="h-full w-full rounded-[0.625rem] object-cover"
                                loading="lazy"
                              />
                            </span>
                          </a>
                        </Link>
          
                        <Link
                          href={{
                            pathname: `/item/${parseInt(BigNumber.from(item[0]).toBigInt())}`,
                            query: {
                              id: parseInt(BigNumber.from(item[0]).toBigInt()),
                              noOfTokens: parseInt(BigNumber.from(item[1]).toBigInt()),
                              cid_img: item[2],
                              cid_work: item[3],
                              title: item[4],
                              desc: item[5],
                              genre: item[6],
                              owner: item[7],
                              tok_address: item[8],
                              likes: parseInt(BigNumber.from(item[9]).toBigInt()),
                              price: parseInt(BigNumber.from(item[10]).toBigInt()),
                              latestPrice: parseInt(BigNumber.from(item[11]).toBigInt()),
                               
                            },
                          }}
                        >
                          <a className="font-display hover:text-accent dark:hover:text-accent text-jacarta-700 mt-4 block text-base dark:text-white">
                            {item[4]}
                          </a>
                        </Link>
          
                        <div className="mt-2 flex items-center justify-between text-sm font-medium tracking-tight">
                          <div className="flex flex-wrap items-center">
                            <Link href="/user/avatar_6">
                              <a className="mr-2 shrink-0">
                                {/* <img src={userImage} alt="owner" className="h-5 w-5 rounded-full" /> */}
                              </a>
                            </Link>
          
                            <Link href="/item/item_5">
                              <a className="text-accent">
                                <span>{item[5]}</span>
                              </a>
                            </Link>
                            <span className="dark:text-jacarta-400 mr-1">...</span>
                          </div>
                          <span className="dark:text-jacarta-300 text-sm">
                            {parseInt(BigNumber.from(item[9]).toBigInt())} Likes
                          </span>
                        </div>
                      </div>
                    </article>
                  );
            })}
        </div>
    );

};
export default Explore_collection_item_help;