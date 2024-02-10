import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Feature_collections_data from '../../data/Feature_collections_data';
import { useAccount } from "wagmi";
import { ethers, BigNumber } from "ethers";
import NFTContract from '../../contract_data/contract_NFT';
import NFT_ABI from '../../contract_data/NFT_Abi.json';


const Explore_collection_item = ({ itemFor }) => {
	const { sortedCollectionData } = useSelector((state) => state.counter);

	const [itemData, setItemData] = useState([]);

	// const { address } = useAccount();
	const address = "0x6731B8e14E7b235454816E4f59d2aDD8b8Bb744A";
	const [tokens, settokens] = useState(0)
	const [nftID, setnftID] = useState(-1);
	const [nftTitle,setNFTTitle] = useState("");
	
	useEffect(() => {
		const contractCall = async () => {
			const RPCprovider = new ethers.providers.Web3Provider(window.ethereum);
			// console.log(SENDER_ABI);
			const nftContract = new ethers.Contract(
			  NFTContract,
			  NFT_ABI,
			  RPCprovider.getSigner(address)
			);
			console.log(nftContract);
			let token2 = await nftContract.getTokens();
			settokens(parseInt(BigNumber.from(token2).toBigInt()));

			for (let i = 0; i < tokens ; i++) {
				let nft = await nftContract.getNFTDetails(i);
				let nft2 = await nftContract.getNFT(i);
				let nftID = parseInt(BigNumber.from(nft[0]).toBigInt());
				let nftTitle = nft2[0];
				setnftID(nftID);
				setNFTTitle(nftTitle);

				// console.log("NFT Details:",nftID);
				// let nft2 = await nftContract.getNFT(i);
				// setnftDet([...nftDet, nft]);
			}
			
		}
			
		
		contractCall()
		// const jsxElements = [];
		// for (let i = 0; i < tokens + 1; i++) {
		// 	jsxElements.push(<h1 key={i}>{i}</h1>);
		// }
		

		// setItemData(val);
	}, []);
	return (
		<div>
			<h1>{nftID?nftID:'Loading..'}</h1>
			{/* <h1>{nftTitle?nftTitle:'Loading..'}</h1> */}

		
	{/* {nftDet.map((item, index) => {
		return( 
		<h1>{item.toString()}</h1>);
	})} */}
  
		  {/* { Array.from({ length: tokens }, (_, index) => (
			
			<article key={index}>
			  <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
				<Link href="/collection/avatar_1">
				  <a className="flex space-x-[0.625rem]">
					<span className="w-[74.5%]">
					  <img
						src={bigImage}
						alt="item 1"
						className="h-full w-full rounded-[0.625rem] object-cover"
						loading="lazy"
					  />
					</span>
					<span className="flex w-1/3 flex-col space-y-[0.625rem]">
					  <img
						src={subImage1}
						alt="item 1"
						className="h-full rounded-[0.625rem] object-cover"
						loading="lazy"
					  />
					  <img
						src={subImage2}
						alt="item 1"
						className="h-full rounded-[0.625rem] object-cover"
						loading="lazy"
					  />
					  <img
						src={subImage3}
						alt="item 1"
						className="h-full rounded-[0.625rem] object-cover"
						loading="lazy"
					  />
					</span>
				  </a>
				</Link>
	  
				<Link href="/collection/avatar_1">
				  <a className="font-display hover:text-accent dark:hover:text-accent text-jacarta-700 mt-4 block text-base dark:text-white">
					{title}
				  </a>
				</Link>
	  
				<div className="mt-2 flex items-center justify-between text-sm font-medium tracking-tight">
				  <div className="flex flex-wrap items-center">
					<Link href="/user/avatar_6">
					  <a className="mr-2 shrink-0">
						<img src={userImage} alt="owner" className="h-5 w-5 rounded-full" />
					  </a>
					</Link>
					<span className="dark:text-jacarta-400 mr-1">by</span>
					<Link href="/user/avatar_6">
			 		  <a className="text-accent">
			 			<span>{userName}</span>
			 		  </a>
			 		</Link>
			 	  </div>
			 	  <span className="dark:text-jacarta-300 text-sm">{itemsCount} Items</span>
			 	</div>
			   </div>
			 </article>
		  ))} */}
		</div>
	  );
	  
};

export default Explore_collection_item;
