import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import Layout from '../components/layout';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useRouter } from 'next/router';
import { MetaMaskProvider } from 'metamask-react';
import Meta from '../components/Meta';
import UserContext from '../components/UserContext';
import { useEffect, useRef,useState } from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");
import { MagicLink } from "@thirdweb-dev/wallets";
import { MetaMaskWallet } from "@thirdweb-dev/wallets";

// Change the network to the one you want to use: "mainnet-beta", "testnet", "devnet", "localhost" or your own RPC endpoint
const desiredNetwork = "devnet";

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [accounts,setAccounts] = useState([]);
	const pid = router.asPath;
	const scrollRef = useRef({
		scrollPos: 0,
	});
	// const wallet = new MagicLink({
	// 	apiKey: "pk_live_F9114C5207062576",
	// 	type: "connect",
	//   });
	const wallet = new MetaMaskWallet();

	  useEffect(() => {
        const initialize = async () => {
          // Check if web3 is injected by the browser (Mist/MetaMask)
          try {
            await wallet.connect();
            console.log("Connected successfully!");
            // setAccounts(accounts);
          } catch (error) {
			console.log(error);
            
          }
        };
    
        initialize();
      }, []);

	return (
		<>
			<Meta title="NFT WORLD" />

			<Provider store={store}>
			{/* <ThirdwebProvider network={desiredNetwork} wallet={wallet}> */}
				<ThemeProvider enableSystem={true} attribute="class">
					<MetaMaskProvider>
						<UserContext.Provider value={{ scrollRef: scrollRef }}>
							{pid === '/login' ? (
								<Component {...pageProps} />
							) : (
								<Layout>
									<Component {...pageProps} />
								</Layout>
							)}
						</UserContext.Provider>
					</MetaMaskProvider>
				</ThemeProvider>
			{/* </ThirdwebProvider> */}
			</Provider>
		</>
	);
}

export default MyApp;
