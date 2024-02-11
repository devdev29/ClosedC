import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { items_data } from "../../data/items_data";
import Auctions_dropdown from "../../components/dropdown/Auctions_dropdown";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Items_Countdown_timer from "../../components/items_countdown_timer";
import { ItemsTabs } from "../../components/component";
import More_items from "./more_items";
import Likes from "../../components/likes";
import Meta from "../../components/Meta";
import { useDispatch } from "react-redux";
import { bidsModalShow } from "../../redux/counterSlice";
import { useAccount } from "wagmi";
import { ethers, BigNumber } from "ethers";
import TokenContractABI from "../../contract_data/contract_Tok.json";
import NFTContract from "../../contract_data/contract_NFT";
import NFT_ABI from "../../contract_data/NFT_Abi.json";

const Item = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryData = router.query;
  console.log(queryData.cid_img);
  //https://ipfs.io/ipfs/QmXrmp2F8HzVfdvckYyKAEzksNV7pRN29XLEWFoTv1PwaT
  const [imageModal, setImageModal] = useState(false);
  const image = "https://ipfs.io/ipfs/" + queryData.cid_img;
  const title = queryData.title;
  const id = queryData.id;
  // const price = 0.08;
  const likes = queryData.likes;
  const text = queryData.desc;
  // const creatorImage = queryData.cid_img;
  // const ownerImage = queryData.cid_img;
  const creatorname = queryData.owner;
  const ownerName = queryData.owner;
  const price = queryData.price;
  const [latestPrice, setLatestPrice] = useState(queryData.latestPrice);
  const auction_timer = 1000000000;
  const [bidPrice, setBidPrice] = useState(0);
  const [bidData, setbidData] = useState(false);
  const [tokensCnt, settokensCnt] = useState(0);
  const [utilitytokensCnt, setutilitytokensCnt] = useState(0)
  const { address } = useAccount();

//   const address = "0x6731B8e14E7b235454816E4f59d2aDD8b8Bb744A";
  //   useEffect(() => {
  //     const highestBid = async () => {
  //       const RPCprovider = new ethers.providers.Web3Provider(window.ethereum);
  //       const nftContract = new ethers.Contract(
  //         NFTContract,
  //         NFT_ABI,
  //         RPCprovider.getSigner(address)
  //       );
  //       let user = await nftContract.getBidDetails(id);
  //       // setLatestPrice(nft[6]/1e18);
  //       setbidData(user == address);
  //       let nft = await nftContract.getNFT(id);
  //       setLatestPrice(nft[6] / 1e18);
  //       setbidData(nft[6] / 1e18 == bidPrice);
  //     };
  //     highestBid();
  //   }, []);
  const buyUtlityTokens = async () => {
	const RPCprovider = new ethers.providers.Web3Provider(window.ethereum);
    // console.log(SENDER_ABI);
    const nftContract = new ethers.Contract(
      NFTContract,
      NFT_ABI,
      RPCprovider.getSigner(address)
    );
	let nft = await nftContract.getNFT(id);
	let priceOfnft =parseInt( BigNumber.from(nft[5]).toBigInt());

    let tok = await nftContract.buyTokens(utilitytokensCnt,priceOfnft /100,id , {value: (priceOfnft /100)*utilitytokensCnt});
  }
  const transferNFT = async () => {
    const RPCprovider = new ethers.providers.Web3Provider(window.ethereum);
    // console.log(SENDER_ABI);
    const nftContract = new ethers.Contract(
      NFTContract,
      NFT_ABI,
      RPCprovider.getSigner(address)
    );
    console.log(nftContract);
    let nft = await nftContract.getNFTDetails(id);

    const transactionParameters = {
      from: address,
      to: ownerName,
      value:
        "0x" +
        BigNumber.from(
          ((1 - (100 - nft[1]) / 200) * bidPrice * 1e18).toString()
        )
          .toBigInt()
          .toString(16),
    };
    // popup - request the user to sign and broadcast the transaction
    await ethereum
      .request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      })
      .then(function (txHash) {
        console.log("Transaction sent:", txHash);
        // Handle transaction success
      })
      .catch(function (error) {
        console.error("Transaction failed:", error);
        // Handle transaction failure
      });
    const transactionParameters2 = {
      from: address,
      to: NFTContract,
      value:
        "0x" +
        BigNumber.from((((100 - nft[1]) / 200) * bidPrice * 1e18).toString())
          .toBigInt()
          .toString(16),
    };
    // popup - request the user to sign and broadcast the transaction
    await ethereum
      .request({
        method: "eth_sendTransaction",
        params: [transactionParameters2],
      })
      .then(function (txHash) {
        console.log("Transaction sent:", txHash);
        // Handle transaction success
      })
      .catch(function (error) {
        console.error("Transaction failed:", error);
        // Handle transaction failure
      });
    let bid = await nftContract.transferNFT(id);
    await bid.wait();
  };
  const withdrawNFT = async () => {
    const RPCprovider = new ethers.providers.Web3Provider(window.ethereum);
    // console.log(SENDER_ABI);
    const nftContract = new ethers.Contract(
      NFTContract,
      NFT_ABI,
      RPCprovider.getSigner(address)
    );
    console.log(nftContract);
    let nft = await nftContract.getNFT(id);
    let nft2 = await nftContract.getNFTDetails(id);
    // let priceOfnft = tokenaddr[3];
    const tokContract = new ethers.Contract(
      nft[3],
      TokenContractABI,
      RPCprovider.getSigner(address)
    );
    let balance2 = await tokContract.balanceOf(address);
	let balance = parseInt(BigNumber.from(balance2).toBigInt());
	let priceOfnft =parseInt( BigNumber.from(nft[5]).toBigInt());
	tokensCnt = parseInt(tokensCnt);
	console.log(balance, tokensCnt, priceOfnft)
    if (balance >= tokensCnt) {
      let tokens = await nftContract.sellTokens(tokensCnt, id,(((100-tokensCnt)/100)* priceOfnft / 100));
      await tokens.wait();
	  let transfer = await tokContract.transfer( nft[3], tokensCnt);
	  await transfer.wait();

    }
  };
  const placeABid = async () => {
    const RPCprovider = new ethers.providers.Web3Provider(window.ethereum);
    // console.log(SENDER_ABI);
    const nftContract = new ethers.Contract(
      NFTContract,
      NFT_ABI,
      RPCprovider.getSigner(address)
    );
    console.log(nftContract);
    let bid = await nftContract.placeABid(
      id,
      BigNumber.from((bidPrice * 1e18).toString()).toBigInt()
    );
    await bid.wait();

    let nft = await nftContract.getNFT(id);
    setLatestPrice(nft[6] / 1e18);
    setbidData(nft[6] / 1e18 == bidPrice);
  };

  return (
    <>
      <Meta title={`$ClosedC | NFT Marketplace`} />
      {/*  <!-- Item --> */}
      <div className="md:flex md:flex-wrap mt-12" key={id}>
        {/* <!-- Image --> */}
        <figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full">
          <button className=" w-full" onClick={() => setImageModal(true)}>
            <img
              src={image}
              alt={title}
              className="rounded-2xl cursor-pointer  w-full"
            />
          </button>

          {/* <!-- Modal --> */}
          <div className={imageModal ? "modal fade show block" : "modal fade"}>
            <div className="modal-dialog !my-0 flex h-full max-w-4xl items-center justify-center">
              <img src={image} alt={title} className="h-full rounded-2xl" />
            </div>

            <button
              type="button"
              className="btn-close absolute top-6 right-6"
              onClick={() => setImageModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="h-6 w-6 fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
              </svg>
            </button>
          </div>
          {/* <!-- end modal --> */}
        </figure>

        {/* <!-- Details --> */}
        <div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
          {/* <!-- Collection / Likes / Actions --> */}
          <div className="mb-3 flex">
            {/* <!-- Collection --> */}
            <div className="flex items-center">
              <Link href="#">
                <a className="text-accent mr-2 text-sm font-bold">
                  CryptoGuysNFT
                </a>
              </Link>
              <span
                className="dark:border-jacarta-600 bg-green inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                data-tippy-content="Verified Collection"
              >
                <Tippy content={<span>Verified Collection</span>}>
                  <svg className="icon h-[.875rem] w-[.875rem] fill-white">
                    <use xlinkHref="/icons.svg#icon-right-sign"></use>
                  </svg>
                </Tippy>
              </span>
            </div>

            {/* <!-- Likes / Actions --> */}
            <div className="ml-auto flex items-stretch space-x-2 relative">
              <Likes
                like={likes}
                classes="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 flex items-center space-x-1 rounded-xl border bg-white py-2 px-4"
              />

              {/* <!-- Actions --> */}
              <Auctions_dropdown classes="dark:border-jacarta-600 dark:hover:bg-jacarta-600 border-jacarta-100 dropdown hover:bg-jacarta-100 dark:bg-jacarta-700 rounded-xl border bg-white" />
            </div>
          </div>

          <h1 className="font-display text-jacarta-700 mb-4 text-4xl font-semibold dark:text-white">
            {title}
          </h1>

          <div className="mb-8 flex items-center space-x-4 whitespace-nowrap">
            <div className="flex items-center">
              <Tippy content={<span>ETH</span>}>
                <span className="-ml-1">
                  <svg className="icon mr-1 h-4 w-4">
                    <use xlinkHref="/icons.svg#icon-ETH"></use>
                  </svg>
                </span>
              </Tippy>
              <span className="text-green text-sm font-medium tracking-tight">
                {price / 1e18} ETH
              </span>
            </div>
            <span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
              Highest bid
            </span>
            <span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
              1/1 available
            </span>
          </div>

          <p className="dark:text-jacarta-300 mb-10">{text}</p>

          {/* <!-- Creator / Owner --> */}
          {/* <div className="mb-8 flex flex-wrap"> */}
          {/* <div className="mr-8 mb-4 flex">
												<figure className="mr-4 shrink-0">
													<Link href="/user/avatar_6">
														<a className="relative block">
															<img
																src={creatorImage}
																alt={creatorname}
																className="rounded-2lg h-12 w-12"
																loading="lazy"
															/>
															<div
																className="dark:border-jacarta-600 bg-green absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
																data-tippy-content="Verified Collection"
															>
																<Tippy content={<span>Verified Collection</span>}>
																	<svg className="icon h-[.875rem] w-[.875rem] fill-white">
																		<use xlinkHref="/icons.svg#icon-right-sign"></use>
																	</svg>
																</Tippy>
															</div>
														</a>
													</Link>
												</figure>
												{/* <div className="flex flex-col justify-center">
													<span className="text-jacarta-400 block text-sm dark:text-white">
														Creator <strong>10% royalties</strong>
													</span>
													<Link href="/user/avatar_6">
														<a className="text-accent block">
															<span className="text-sm font-bold">{creatorname}</span>
														</a>
													</Link>
												</div> 
											</div> */}

          {/* <div className="mb-4 flex">
												<figure className="mr-4 shrink-0">
													<Link href="/user/avatar_6">
														<a className="relative block">
															<img
																src={ownerImage}
																alt={ownerName}
																className="rounded-2lg h-12 w-12"
																loading="lazy"
															/>
															<div
																className="dark:border-jacarta-600 bg-green absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
																data-tippy-content="Verified Collection"
															>
																<Tippy content={<span>Verified Collection</span>}>
																	<svg className="icon h-[.875rem] w-[.875rem] fill-white">
																		<use xlinkHref="/icons.svg#icon-right-sign"></use>
																	</svg>
																</Tippy>
															</div>
														</a>
													</Link>
												</figure>
												<div className="flex flex-col justify-center">
													<span className="text-jacarta-400 block text-sm dark:text-white">
														Owned by
													</span>
													<Link href="/user/avatar_6">
														<a className="text-accent block">
															<span className="text-sm font-bold">{ownerName}</span>
														</a>
													</Link>
												</div>
											</div> */}
          {/* </div> */}

          {/* <!-- Bid --> */}
          <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8">
            <div className="mb-8 sm:flex sm:flex-wrap">
              {/* <!-- Highest bid --> */}
              <div className="sm:w-1/2 sm:pr-4 lg:pr-8">
                <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
                  <span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
                    Highest bid :
                  </span>
                  <Link href="/user/avatar_6">
                    <a className="text-accent text-sm font-bold">
                      {latestPrice === 0 ? "-" : `${latestPrice}`}
                    </a>
                  </Link>
                </div>
                <div className="mt-3 flex">
                  <figure className="mr-4 shrink-0">
                    <Link href="#">
                      <a className="relative block">
                        <img
                          src="/images/avatars/avatar_4.jpg"
                          alt="avatar"
                          className="rounded-2lg h-12 w-12"
                          loading="lazy"
                        />
                      </a>
                    </Link>
                  </figure>
                  <div>
                    <div className="flex items-center whitespace-nowrap">
                      <Tippy content={<span>ETH</span>}>
                        <span className="-ml-1">
                          <svg className="icon mr-1 h-4 w-4">
                            <use xlinkHref="/icons.svg#icon-ETH"></use>
                          </svg>
                        </span>
                      </Tippy>
                      <span className="text-green text-lg font-medium leading-tight tracking-tight">
                        {price / 1e18} ETH
                      </span>
                    </div>
                    <span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
                      ~10,864.10
                    </span>
                  </div>
                </div>
              </div>

              {/* <!-- Countdown --> */}
              <div className="dark:border-jacarta-600 sm:border-jacarta-100 mt-4 sm:mt-0 sm:w-1/2 sm:border-l sm:pl-4 lg:pl-8">
                <span className="js-countdown-ends-label text-jacarta-400 dark:text-jacarta-300 text-sm">
                  Auction ends in
                </span>
                <Items_Countdown_timer time={+auction_timer} />
              </div>
            </div>

            {/* <Link href="#"> */}
            <input
              name="name"
              className="contact-form-input mb-4 dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
              id="name"
              type="text"
              placeholder="Enter Tokens Amount"
              onChange={(e) => setutilitytokensCnt(e.target.value)}
            />

            <button
              className="bg-accent mb-4 shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
              onClick={buyUtlityTokens}
            >
             Buy Utility Tokens
            </button>
            <input
              name="name"
              className="contact-form-input mb-4 dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
              id="name"
              type="text"
              placeholder="Enter Tokens Amount"
              onChange={(e) => settokensCnt(e.target.value)}
            />

            <button
              className="bg-accent mb-4 shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
              onClick={withdrawNFT}
            >
              Withdraw Utility Tokens
            </button>
            <input
              name="name"
              className="contact-form-input mb-4 dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white"
              id="name"
              type="text"
              placeholder="Enter Bid Amount"
              onChange={(e) => setBidPrice(e.target.value)}
            />
            <button
              className="bg-white mb-4 shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-black transition-all"
              onClick={placeABid}
            >
              Place Bid
            </button>

            {bidData ? (
              <button
                className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                onClick={transferNFT}
              >
                Purchase NFT
              </button>
            ) : (
              <button></button>
            )}
            {/* </Link> */}
          </div>
          {/* <!-- end bid --> */}
        </div>
        {/* <!-- end details --> */}
      </div>
      <section className="relative lg:mt-24 lg:pt-24 lg:pb-24 mt-24 pt-12 pb-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full"
          />
        </picture>
        <div className="container">
          {/* <!-- Item --> */}

          <ItemsTabs />
        </div>
      </section>
      {/* <!-- end item --> */}

      <More_items />
    </>
  );
};

export default Item;
