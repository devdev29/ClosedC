import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import Collection_dropdown2 from "../../components/dropdown/collection_dropdown2";
import {
  collectionDropdown2_data,
  EthereumDropdown2_data,
  GenreDropdown2_data
} from "../../data/dropdown";
import { FileUploader } from "react-drag-drop-files";
import Proparties_modal from "../../components/modal/proparties_modal";
import { useDispatch } from "react-redux";
import { showPropatiesModal } from "../../redux/counterSlice";
import Meta from "../../components/Meta";
import axios from 'axios';
import { ethers } from "ethers";
const FormData = require('form-data');
// const fs = require('fs');

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1MGRmZWZjMy1kMGM5LTRlNzktYTA1Yi1jYmM5ZGMyZjY1MDgiLCJlbWFpbCI6Im1haWx0by51bm1hbmlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijc3ZTI5YjQxYTZmZWYwZTY4MmY3Iiwic2NvcGVkS2V5U2VjcmV0IjoiM2U5NzVkYzc5NGZiMjBmMDk4NjAwMjA2ZDlkMWQwNTQ2MGM4MjM1YjgzMzRlZDAwM2FjNTgzNmFhNTBkN2U3MSIsImlhdCI6MTcwNzU3NTI1N30.w0hsbcy25GBwLJkwFMJKIrrhYfwRaveIPXcK0kdyHBw'

const Create = () => {
  const fileTypes = [
    "JPG",
    "PNG",
    "GIF",
    "SVG",
    "MP4",
    "WEBM",
    "MP3",
    "WAV",
    "OGG",
    "GLB",
    "GLTF",
  ];
  const imageFileTypes = ["JPG","PNG"];
  const [file, setFile] = useState(null);
  const [titleImage,setTitleImage] = useState(null);
  const [address,setAddress] = useState(null);
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [genre,setGenre] = useState('');
  const [price,setPrice] = useState('');
  const dispatch = useDispatch();

  const pinFileToIPFSMain = async () => {

    let description_image_hash = '';
    let main_file_hash = '';



    console.log("Uploading Main File");
		const formData = new FormData();
		formData.append('file', file)

    const pinataMetadata = JSON.stringify({
		  name: file.name,
		})
		formData.append('pinataMetadata',pinataMetadata);
		
		const pinataOptions = JSON.stringify({
		  cidVersion: 0,
		})
		formData.append('pinataOptions', pinataOptions);
	
		try{
		  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
			maxBodyLength: "Infinity",
			headers: {
			  'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
			  'Authorization': `Bearer ${JWT}`
			}
		  });
		  console.log("hash:",res.data.IpfsHash);
      main_file_hash = res.data.IpfsHash;

		} catch (error) {
		  console.log(error);
		}




    console.log("Uploading Title Description Image");
		const formData2 = new FormData();
		formData2.append('file', titleImage)
		
    const pinataMetadata2 = JSON.stringify({
		  name: titleImage.name,
		})
		formData2.append('pinataMetadata',pinataMetadata2);
		
		const pinataOptions2 = JSON.stringify({
		  cidVersion: 0,
		})
		formData2.append('pinataOptions', pinataOptions2);
	
		try{
		  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData2, {
			maxBodyLength: "Infinity",
			headers: {
			  'Content-Type': `multipart/form-data; boundary=${formData2._boundary}`,
			  'Authorization': `Bearer ${JWT}`
			}
		  });
		  console.log("hash:",res.data.IpfsHash);
      description_image_hash = res.data.IpfsHash;
		} catch (error) {
		  console.log(error);
		}

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
      try {
        const ContractAbi = [
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "initialSupply",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "nftToken",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "tokName",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "tokSign",
                "type": "string"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "spender",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
              }
            ],
            "name": "ERC20InsufficientAllowance",
            "type": "error"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "sender",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
              }
            ],
            "name": "ERC20InsufficientBalance",
            "type": "error"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "approver",
                "type": "address"
              }
            ],
            "name": "ERC20InvalidApprover",
            "type": "error"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
              }
            ],
            "name": "ERC20InvalidReceiver",
            "type": "error"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "sender",
                "type": "address"
              }
            ],
            "name": "ERC20InvalidSender",
            "type": "error"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "spender",
                "type": "address"
              }
            ],
            "name": "ERC20InvalidSpender",
            "type": "error"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
              }
            ],
            "name": "Approval",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
              }
            ],
            "name": "Transfer",
            "type": "event"
          },
          {
            "inputs": [],
            "name": "_totalSupply",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "tokenOwner",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "spender",
                "type": "address"
              }
            ],
            "name": "allowance",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "remaining",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "spender",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "tokens",
                "type": "uint256"
              }
            ],
            "name": "approve",
            "outputs": [
              {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "spender",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "tokens",
                "type": "uint256"
              },
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
              }
            ],
            "name": "approveAndCall",
            "outputs": [
              {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "tokenOwner",
                "type": "address"
              }
            ],
            "name": "balanceOf",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "account",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "burn",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "decimals",
            "outputs": [
              {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "name",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "a",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "b",
                "type": "uint256"
              }
            ],
            "name": "safeAdd",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "c",
                "type": "uint256"
              }
            ],
            "stateMutability": "pure",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "a",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "b",
                "type": "uint256"
              }
            ],
            "name": "safeDiv",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "c",
                "type": "uint256"
              }
            ],
            "stateMutability": "pure",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "a",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "b",
                "type": "uint256"
              }
            ],
            "name": "safeMul",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "c",
                "type": "uint256"
              }
            ],
            "stateMutability": "pure",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "a",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "b",
                "type": "uint256"
              }
            ],
            "name": "safeSub",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "c",
                "type": "uint256"
              }
            ],
            "stateMutability": "pure",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "symbol",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "to",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "tokens",
                "type": "uint256"
              }
            ],
            "name": "transfer",
            "outputs": [
              {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "from",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "to",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "tokens",
                "type": "uint256"
              }
            ],
            "name": "transferFrom",
            "outputs": [
              {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "stateMutability": "payable",
            "type": "receive"
          }
        ];

        const bytecode = '60806040523480156200001157600080fd5b50604051620020d5380380620020d5833981810160405281019062000037919062000637565b818181600390816200004a919062000928565b5080600490816200005c919062000928565b505050836005819055506200008d83670de0b6b3a76400008662000081919062000a3e565b6200014760201b60201c565b600554600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60055460405162000135919062000a9a565b60405180910390a35050505062000b5d565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620001bc5760006040517fec442f05000000000000000000000000000000000000000000000000000000008152600401620001b3919062000ac8565b60405180910390fd5b620001d060008383620001d460201b60201c565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036200022a5780600260008282546200021d919062000ae5565b9250508190555062000300565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015620002b9578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401620002b09392919062000b20565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036200034b578060026000828254039250508190555062000398565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620003f7919062000a9a565b60405180910390a3505050565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b6200042d8162000418565b81146200043957600080fd5b50565b6000815190506200044d8162000422565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620004808262000453565b9050919050565b620004928162000473565b81146200049e57600080fd5b50565b600081519050620004b28162000487565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200050d82620004c2565b810181811067ffffffffffffffff821117156200052f576200052e620004d3565b5b80604052505050565b60006200054462000404565b905062000552828262000502565b919050565b600067ffffffffffffffff821115620005755762000574620004d3565b5b6200058082620004c2565b9050602081019050919050565b60005b83811015620005ad57808201518184015260208101905062000590565b60008484015250505050565b6000620005d0620005ca8462000557565b62000538565b905082815260208101848484011115620005ef57620005ee620004bd565b5b620005fc8482856200058d565b509392505050565b600082601f8301126200061c576200061b620004b8565b5b81516200062e848260208601620005b9565b91505092915050565b600080600080608085870312156200065457620006536200040e565b5b600062000664878288016200043c565b94505060206200067787828801620004a1565b935050604085015167ffffffffffffffff8111156200069b576200069a62000413565b5b620006a98782880162000604565b925050606085015167ffffffffffffffff811115620006cd57620006cc62000413565b5b620006db8782880162000604565b91505092959194509250565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200073a57607f821691505b60208210810362000750576200074f620006f2565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620007ba7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826200077b565b620007c686836200077b565b95508019841693508086168417925050509392505050565b6000819050919050565b60006200080962000803620007fd8462000418565b620007de565b62000418565b9050919050565b6000819050919050565b6200082583620007e8565b6200083d620008348262000810565b84845462000788565b825550505050565b600090565b6200085462000845565b620008618184846200081a565b505050565b5b8181101562000889576200087d6000826200084a565b60018101905062000867565b5050565b601f821115620008d857620008a28162000756565b620008ad846200076b565b81016020851015620008bd578190505b620008d5620008cc856200076b565b83018262000866565b50505b505050565b600082821c905092915050565b6000620008fd60001984600802620008dd565b1980831691505092915050565b6000620009188383620008ea565b9150826002028217905092915050565b6200093382620006e7565b67ffffffffffffffff8111156200094f576200094e620004d3565b5b6200095b825462000721565b620009688282856200088d565b600060209050601f831160018114620009a057600084156200098b578287015190505b6200099785826200090a565b86555062000a07565b601f198416620009b08662000756565b60005b82811015620009da57848901518255600182019150602085019450602081019050620009b3565b86831015620009fa5784890151620009f6601f891682620008ea565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600062000a4b8262000418565b915062000a588362000418565b925082820262000a688162000418565b9150828204841483151762000a825762000a8162000a0f565b5b5092915050565b62000a948162000418565b82525050565b600060208201905062000ab1600083018462000a89565b92915050565b62000ac28162000473565b82525050565b600060208201905062000adf600083018462000ab7565b92915050565b600062000af28262000418565b915062000aff8362000418565b925082820190508082111562000b1a5762000b1962000a0f565b5b92915050565b600060608201905062000b37600083018662000ab7565b62000b46602083018562000a89565b62000b55604083018462000a89565b949350505050565b6115688062000b6d6000396000f3fe6080604052600436106100f75760003560e01c80639dc29fac1161008a578063cae9ca5111610059578063cae9ca5114610388578063d05c78da146103c5578063dd62ed3e14610402578063e6cb90131461043f57610101565b80639dc29fac14610294578063a293d1e8146102d1578063a9059cbb1461030e578063b5931f7c1461034b57610101565b8063313ce567116100c6578063313ce567146101d65780633eaaf86b1461020157806370a082311461022c57806395d89b411461026957610101565b806306fdde0314610106578063095ea7b31461013157806318160ddd1461016e57806323b872dd1461019957610101565b3661010157600080fd5b600080fd5b34801561011257600080fd5b5061011b61047c565b6040516101289190610fc8565b60405180910390f35b34801561013d57600080fd5b5061015860048036038101906101539190611088565b61050e565b60405161016591906110e3565b60405180910390f35b34801561017a57600080fd5b50610183610600565b604051610190919061110d565b60405180910390f35b3480156101a557600080fd5b506101c060048036038101906101bb9190611128565b610654565b6040516101cd91906110e3565b60405180910390f35b3480156101e257600080fd5b506101eb6107de565b6040516101f89190611197565b60405180910390f35b34801561020d57600080fd5b506102166107e3565b604051610223919061110d565b60405180910390f35b34801561023857600080fd5b50610253600480360381019061024e91906111b2565b6107e9565b604051610260919061110d565b60405180910390f35b34801561027557600080fd5b5061027e610832565b60405161028b9190610fc8565b60405180910390f35b3480156102a057600080fd5b506102bb60048036038101906102b69190611088565b6108c4565b6040516102c891906110e3565b60405180910390f35b3480156102dd57600080fd5b506102f860048036038101906102f391906111df565b6108ed565b604051610305919061110d565b60405180910390f35b34801561031a57600080fd5b5061033560048036038101906103309190611088565b610910565b60405161034291906110e3565b60405180910390f35b34801561035757600080fd5b50610372600480360381019061036d91906111df565b610a99565b60405161037f919061110d565b60405180910390f35b34801561039457600080fd5b506103af60048036038101906103aa9190611284565b610abb565b6040516103bc91906110e3565b60405180910390f35b3480156103d157600080fd5b506103ec60048036038101906103e791906111df565b610baf565b6040516103f9919061110d565b60405180910390f35b34801561040e57600080fd5b50610429600480360381019061042491906112f8565b610be7565b604051610436919061110d565b60405180910390f35b34801561044b57600080fd5b50610466600480360381019061046191906111df565b610c6e565b604051610473919061110d565b60405180910390f35b60606003805461048b90611367565b80601f01602080910402602001604051908101604052809291908181526020018280546104b790611367565b80156105045780601f106104d957610100808354040283529160200191610504565b820191906000526020600020905b8154815290600101906020018083116104e757829003601f168201915b5050505050905090565b600081600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516105ee919061110d565b60405180910390a36001905092915050565b6000600660008073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205460055461064f91906113c7565b905090565b600061069f600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054836108ed565b600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061072b600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205483610c6e565b600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516107cb919061110d565b60405180910390a3600190509392505050565b600090565b60055481565b6000600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606004805461084190611367565b80601f016020809104026020016040519081016040528092919081815260200182805461086d90611367565b80156108ba5780601f1061088f576101008083540402835291602001916108ba565b820191906000526020600020905b81548152906001019060200180831161089d57829003601f168201915b5050505050905090565b60006108e383670de0b6b3a7640000846108de91906113fb565b610c91565b6001905092915050565b6000828211156108fc57600080fd5b818361090891906113c7565b905092915050565b600061095b600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054836108ed565b600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506109e7600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205483610c6e565b600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610a87919061110d565b60405180910390a36001905092915050565b6000808211610aa757600080fd5b8183610ab3919061146c565b905092915050565b600083600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92586604051610b9b919061110d565b60405180910390a360019050949350505050565b60008183610bbd91906113fb565b90506000831480610bd85750818382610bd6919061146c565b145b610be157600080fd5b92915050565b6000600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60008183610c7c919061149d565b905082811015610c8b57600080fd5b92915050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d035760006040517f96c6fd1e000000000000000000000000000000000000000000000000000000008152600401610cfa91906114e0565b60405180910390fd5b610d0f82600083610d13565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610d65578060026000828254610d59919061149d565b92505081905550610e38565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610df1578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610de8939291906114fb565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610e815780600260008282540392505081905550610ece565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610f2b919061110d565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610f72578082015181840152602081019050610f57565b60008484015250505050565b6000601f19601f8301169050919050565b6000610f9a82610f38565b610fa48185610f43565b9350610fb4818560208601610f54565b610fbd81610f7e565b840191505092915050565b60006020820190508181036000830152610fe28184610f8f565b905092915050565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061101f82610ff4565b9050919050565b61102f81611014565b811461103a57600080fd5b50565b60008135905061104c81611026565b92915050565b6000819050919050565b61106581611052565b811461107057600080fd5b50565b6000813590506110828161105c565b92915050565b6000806040838503121561109f5761109e610fea565b5b60006110ad8582860161103d565b92505060206110be85828601611073565b9150509250929050565b60008115159050919050565b6110dd816110c8565b82525050565b60006020820190506110f860008301846110d4565b92915050565b61110781611052565b82525050565b600060208201905061112260008301846110fe565b92915050565b60008060006060848603121561114157611140610fea565b5b600061114f8682870161103d565b93505060206111608682870161103d565b925050604061117186828701611073565b9150509250925092565b600060ff82169050919050565b6111918161117b565b82525050565b60006020820190506111ac6000830184611188565b92915050565b6000602082840312156111c8576111c7610fea565b5b60006111d68482850161103d565b91505092915050565b600080604083850312156111f6576111f5610fea565b5b600061120485828601611073565b925050602061121585828601611073565b9150509250929050565b600080fd5b600080fd5b600080fd5b60008083601f8401126112445761124361121f565b5b8235905067ffffffffffffffff81111561126157611260611224565b5b60208301915083600182028301111561127d5761127c611229565b5b9250929050565b6000806000806060858703121561129e5761129d610fea565b5b60006112ac8782880161103d565b94505060206112bd87828801611073565b935050604085013567ffffffffffffffff8111156112de576112dd610fef565b5b6112ea8782880161122e565b925092505092959194509250565b6000806040838503121561130f5761130e610fea565b5b600061131d8582860161103d565b925050602061132e8582860161103d565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061137f57607f821691505b60208210810361139257611391611338565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006113d282611052565b91506113dd83611052565b92508282039050818111156113f5576113f4611398565b5b92915050565b600061140682611052565b915061141183611052565b925082820261141f81611052565b9150828204841483151761143657611435611398565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600061147782611052565b915061148283611052565b9250826114925761149161143d565b5b828204905092915050565b60006114a882611052565b91506114b383611052565b92508282019050808211156114cb576114ca611398565b5b92915050565b6114da81611014565b82525050565b60006020820190506114f560008301846114d1565b92915050565b600060608201905061151060008301866114d1565b61151d60208301856110fe565b61152a60408301846110fe565b94935050505056fea2646970667358221220266276d20f12bdc2fe102c19cea462a2b827c2076c7f85e5d716ed0e4468c83564736f6c63430008180033';


        const factory = new ethers.ContractFactory(ContractAbi, bytecode, signer);
        const contract = await factory.deploy(100,"0x51254Af0A3984161D937dbCa3460AA4837254299","Unmoneyyyy" , "UNMANI");
        setAddress(await contract.address);
        console.log(address)

        const NFTMarketplaceAddress = '0x3c44e665051c2bb90319565F4b77464041b0b356';

        const NFTMarketplaceABI = [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "tok",
              "type": "string"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "ERC721IncorrectOwner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "ERC721InsufficientApproval",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "approver",
              "type": "address"
            }
          ],
          "name": "ERC721InvalidApprover",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            }
          ],
          "name": "ERC721InvalidOperator",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "ERC721InvalidOwner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
            }
          ],
          "name": "ERC721InvalidReceiver",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            }
          ],
          "name": "ERC721InvalidSender",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "ERC721NonexistentToken",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "OwnableInvalidOwner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "OwnableUnauthorizedAccount",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "approved",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
            }
          ],
          "name": "ApprovalForAll",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_fromTokenId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_toTokenId",
              "type": "uint256"
            }
          ],
          "name": "BatchMetadataUpdate",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amountOfETH",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amountOfTokens",
              "type": "uint256"
            }
          ],
          "name": "BuyTokens",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_tokenId",
              "type": "uint256"
            }
          ],
          "name": "MetadataUpdate",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "MAX_TOKENS",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokens",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "priceInWei",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nftID",
              "type": "uint256"
            }
          ],
          "name": "buyTokens",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "tokenAmount",
              "type": "uint256"
            }
          ],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "connectWallet",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "getApproved",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "nftID",
              "type": "uint256"
            }
          ],
          "name": "getBidDetails",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "nftID",
              "type": "uint256"
            }
          ],
          "name": "getNFT",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "nftID",
              "type": "uint256"
            }
          ],
          "name": "getNFTDetails",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getNFTList",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getTokens",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getUsers",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            }
          ],
          "name": "isApprovedForAll",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "nftID",
              "type": "uint256"
            }
          ],
          "name": "likeNFT",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "cid_img",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "cid_work",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "desc",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "genre",
              "type": "string"
            },
            {
              "internalType": "address payable",
              "name": "tok_addr",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            }
          ],
          "name": "mint",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "ownerOf",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "nftID",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            }
          ],
          "name": "placeABid",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
            }
          ],
          "name": "setApprovalForAll",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes4",
              "name": "interfaceId",
              "type": "bytes4"
            }
          ],
          "name": "supportsInterface",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "tokenCounter",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "tokenURI",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "nftID",
              "type": "uint256"
            }
          ],
          "name": "transferNFT",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        }
      ]

      const NFTMarketplaceContract = new ethers.Contract(NFTMarketplaceAddress, NFTMarketplaceABI, signer);

      const tx = await NFTMarketplaceContract.mint(description_image_hash,main_file_hash,title,description,genre,contract.address,price);
      let receipt = await tx.wait();
      console.log(receipt)
      console.log("minted");     


      } catch (error) {
        console.log("error >>>>>>>>>>>>>>>>>>>>>>>>>>>:", error);
      }

      

     


    





	}

  const handleChange = async(file) => {
    await setFile(file);
  };

  const handleChangeImage = async (titleImage) => {
    await setTitleImage(titleImage);
  };

  const popupItemData = [
    {
      id: 1,
      name: "proparties",
      text: "Textual traits that show up as rectangles.",
      icon: "proparties-icon",
    },
    {
      id: 2,
      name: "levels",
      text: "Numerical traits that show as a progress bar.",
      icon: "level-icon",
    },
    {
      id: 3,
      name: "stats",
      text: "Numerical traits that just show as numbers.",
      icon: "stats-icon",
    },
  ];
  return (
    <div>
      <Meta title="Create || Xhibiter | NFT Marketplace Next.js Template" />
      {/* <!-- Create --> */}
      <section className="relative py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
          />
        </picture>
        <div className="container">
          <h1 className="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
            Create an NFT
          </h1>

          <div className="mx-auto max-w-[48.125rem]">

            <div style={{display:"flex",flexDirection:'row',alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
            <div className="mb-6" style={{marginRight:'2vw'}}>
              <label className="font-display text-jacarta-700 mb-2 block dark:text-white">
                Image, Video, Audio, or 3D Model
                <span className="text-red">*</span>
              </label>

              {file ? (
                <p className="dark:text-jacarta-300 text-2xs mb-3">
                  successfully uploaded : {file.name}
                </p>
              ) : (
                <p className="dark:text-jacarta-300 text-2xs mb-3">
                  Drag or choose your file to upload
                </p>
              )}

              <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center">
                <div className="relative z-10 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-500 mb-4 inline-block dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z" />
                  </svg>
                  <p className="dark:text-jacarta-300 mx-auto max-w-xs text-xs">
                    JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max
                    size: 100 MB
                  </p>
                </div>
                <div className="dark:bg-jacarta-600 bg-jacarta-50 absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100 ">
                  <FileUploader
                    handleChange={handleChange}
                    name="file"
                    types={fileTypes}
                    classes="file-drag"
                    maxSize={100}
                    minSize={0}
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="font-display text-jacarta-700 mb-2 block dark:text-white">
                Image File
                <span className="text-red">*</span>
              </label>

              {titleImage ? (
                <p className="dark:text-jacarta-300 text-2xs mb-3">
                  successfully uploaded : {titleImage.name}
                </p>
              ) : (
                <p className="dark:text-jacarta-300 text-2xs mb-3">
                  Drag or choose an image for description
                </p>
              )}

              <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center">
                <div className="relative z-10 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-500 mb-4 inline-block dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z" />
                  </svg>
                  <p className="dark:text-jacarta-300 mx-auto max-w-xs text-xs">
                    JPG or PNG Max
                    size: 100 MB
                  </p>
                </div>
                <div className="dark:bg-jacarta-600 bg-jacarta-50 absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100 ">
                  <FileUploader
                    handleChange={handleChangeImage}
                    name="titleImage"
                    types={imageFileTypes}
                    classes="file-drag"
                    maxSize={100}
                    minSize={0}
                  />
                </div>
              </div>
            </div>

            </div>
            {/* <!-- File Upload --> */}
           


            

            {/* <!-- Name --> */}
            <div className="mb-6">
              <label
                htmlFor="item-name"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                Name<span className="text-red">*</span>
              </label>
              <input
                type="text"
                id="item-name"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder="Item name"
                onChange={(e) => setTitle(e.target.value)}                required
              />
            </div>

            {/* <!-- External Link --> */}
            

            {/* <!-- Description --> */}
            <div className="mb-6">
              <label
                htmlFor="item-description"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                Description
              </label>
              <p className="dark:text-jacarta-300 text-2xs mb-3">
                The description will be included on the {"item's"} detail page
                underneath its image. Markdown syntax is supported.
              </p>
              <textarea
              onChange={(e)=>{setDescription(e.target.value)}} 
                id="item-description"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                rows="4"
                required
                placeholder="Provide a detailed description of your item."
              ></textarea>
            </div>

            <div className="mb-6">
              <label
                htmlFor="item-price"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                Price (in Wei)
              </label>
              <p className="dark:text-jacarta-300 text-2xs mb-3">
                The price at which you intend to begin the original sale of the NFT.
              </p>
              <textarea
                id="item-description"
                onChange={(e)=>{setPrice(parseFloat(e.target.value))}}  
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                rows="1"
                required
                placeholder="Provide a price for your item."
              ></textarea>
            </div>

            {/* <!-- Collection --> */}
            {/* <div className="relative">
              <div>
                <label className="font-display text-jacarta-700 mb-2 block dark:text-white">
                  Collection
                </label>
                <div className="mb-3 flex items-center space-x-2">
                  <p className="dark:text-jacarta-300 text-2xs">
                    This is the collection where your item will appear.
                    <Tippy
                      theme="tomato-theme"
                      content={
                        <span>
                          Moving items to a different collection may take up to
                          30 minutes.
                        </span>
                      }
                    >
                      <span className="inline-block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="dark:fill-jacarta-300 fill-jacarta-500 ml-1 -mb-[3px] h-4 w-4"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"></path>
                        </svg>
                      </span>
                    </Tippy>
                  </p>
                </div>
              </div>

              
              <div className="dropdown my-1 cursor-pointer">
                <Collection_dropdown2
                  data={collectionDropdown2_data}
                  collection={true}
                />
              </div>
            </div> */}

            {/* <!-- Properties --> */}
            {/* {popupItemData.map(({ id, name, text, icon }) => {
              return (
                <div
                  key={id}
                  className="dark:border-jacarta-600 border-jacarta-100 relative border-b py-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      <svg className="icon fill-jacarta-700 mr-2 mt-px h-4 w-4 shrink-0 dark:fill-white">
                        <use xlinkHref={`/icons.svg#icon-${icon}`}></use>
                      </svg>

                      <div>
                        <label className="font-display text-jacarta-700 block dark:text-white">
                          {name}
                        </label>
                        <p className="dark:text-jacarta-300">{text}</p>
                      </div>
                    </div>
                    <button
                      className="group dark:bg-jacarta-700 hover:bg-accent border-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-white hover:border-transparent"
                      onClick={() => dispatch(showPropatiesModal())}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="fill-accent group-hover:fill-white"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })} */}

            {/* <Proparties_modal /> */}

            {/* <!-- Properties --> */}

            {/* <!-- Unlockable Content --> */}
            {/* <div className="dark:border-jacarta-600 border-jacarta-100 relative border-b py-6">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-accent mr-2 mt-px h-4 w-4 shrink-0"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M7 10h13a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 0 1 13.262-3.131l-1.789.894A5 5 0 0 0 7 9v1zm-2 2v8h14v-8H5zm5 3h4v2h-4v-2z" />
                  </svg>

                  <div>
                    <label className="font-display text-jacarta-700 block dark:text-white">
                      Unlockable Content
                    </label>
                    <p className="dark:text-jacarta-300">
                      Include unlockable content that can only be revealed by
                      the owner of the item.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  value="checkbox"
                  name="check"
                  className="checked:bg-accent checked:focus:bg-accent checked:hover:bg-accent after:bg-jacarta-400 bg-jacarta-100 relative h-6 w-[2.625rem] cursor-pointer appearance-none rounded-full border-none after:absolute after:top-[0.1875rem] after:left-[0.1875rem] after:h-[1.125rem] after:w-[1.125rem] after:rounded-full after:transition-all checked:bg-none checked:after:left-[1.3125rem] checked:after:bg-white focus:ring-transparent focus:ring-offset-0"
                />
              </div>
            </div> */}

            {/* <!-- Explicit & Sensitive Content --> */}
            {/* <div className="dark:border-jacarta-600 border-jacarta-100 relative mb-6 border-b py-6">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-700 mr-2 mt-px h-4 w-4 shrink-0 dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M12.866 3l9.526 16.5a1 1 0 0 1-.866 1.5H2.474a1 1 0 0 1-.866-1.5L11.134 3a1 1 0 0 1 1.732 0zM11 16v2h2v-2h-2zm0-7v5h2V9h-2z" />
                  </svg>

                  <div>
                    <label className="font-display text-jacarta-700 dark:text-white">
                      Explicit & Sensitive Content
                    </label>

                    <p className="dark:text-jacarta-300">
                      Set this item as explicit and sensitive content.
                      <Tippy
                        content={
                          <span>
                            Setting your asset as explicit and sensitive
                            content, like pornography and other not safe for
                            work (NSFW) content, will protect users with safe
                            search while browsing Xhibiter
                          </span>
                        }
                      >
                        <span className="inline-block">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="dark:fill-jacarta-300 fill-jacarta-500 ml-2 -mb-[2px] h-4 w-4"
                          >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"></path>
                          </svg>
                        </span>
                      </Tippy>
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  value="checkbox"
                  name="check"
                  className="checked:bg-accent checked:focus:bg-accent checked:hover:bg-accent after:bg-jacarta-400 bg-jacarta-100 relative h-6 w-[2.625rem] cursor-pointer appearance-none rounded-full border-none after:absolute after:top-[0.1875rem] after:left-[0.1875rem] after:h-[1.125rem] after:w-[1.125rem] after:rounded-full after:transition-all checked:bg-none checked:after:left-[1.3125rem] checked:after:bg-white focus:ring-transparent focus:ring-offset-0"
                />
              </div>
            </div> */}


            <div className="mb-6">
              <label
                htmlFor="item-supply"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                Genre
              </label>

              {/* dropdown */}
              <div className="dropdown relative mb-4 cursor-pointer ">
                <Collection_dropdown2 data={GenreDropdown2_data} />
              </div>
            </div>



            {/* <!-- Supply --> */}
            <div className="mb-6">
              <label
                htmlFor="item-supply"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                Supply
              </label>

              <div className="mb-3 flex items-center space-x-2">
                <p className="dark:text-jacarta-300 text-2xs">
                  The number of items that can be minted. No gas cost to you!
                  <Tippy
                    content={
                      <span>
                        Setting your asset as explicit and sensitive content,
                        like pornography and other not safe for work (NSFW)
                        content, will protect users with safe search while
                        browsing Xhibiter.
                      </span>
                    }
                  >
                    <span className="inline-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="dark:fill-jacarta-300 fill-jacarta-500 ml-1 -mb-[3px] h-4 w-4"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"></path>
                      </svg>
                    </span>
                  </Tippy>
                </p>
              </div>

              <input
                type="text"
                id="item-supply"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                placeholder="1"
              />
            </div>

            {/* <!-- Blockchain --> */}
            <div className="mb-6">
              <label
                htmlFor="item-supply"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                Blockchain
              </label>

              {/* dropdown */}
              <div className="dropdown relative mb-4 cursor-pointer ">
                <Collection_dropdown2 data={EthereumDropdown2_data} />
              </div>
            </div>

            {/* <!-- Freeze metadata --> */}
            {/* <div className="mb-6">
              <div className="mb-2 flex items-center space-x-2">
                <label
                  htmlFor="item-freeze-metadata"
                  className="font-display text-jacarta-700 block dark:text-white"
                >
                  Freeze metadata
                </label>

                <Tippy
                  content={
                    <span className="bg-jacarta-300">
                      Setting your asset as explicit and sensitive content, like
                      pornography and other not safe for work (NSFW) content,
                      will protect users with safe search while browsing
                      Xhibiter.
                    </span>
                  }
                >
                  <span className="inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="dark:fill-jacarta-300 fill-jacarta-500 mb-[2px] h-5 w-5"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"></path>
                    </svg>
                  </span>
                </Tippy>
              </div>

              <p className="dark:text-jacarta-300 text-2xs mb-3">
                Freezing your metadata will allow you to permanently lock and
                store all of this
                {"item's"} content in decentralized file storage.
              </p>

              <input
                type="text"
                disabled
                id="item-freeze-metadata"
                className="dark:bg-jacarta-700 bg-jacarta-50 border-jacarta-100 dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 dark:text-white"
                placeholder="To freeze your metadata, you must create your item first."
              />
            </div> */}

            {/* <!-- Submit --> */}
            <button
            onClick={()=>{pinFileToIPFSMain();}}
              className="bg-accent-lighter cursor-default rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
            >
              Create
            </button>
            {/* {address ? (
                <h1>{`Deployed Token Address: ${address}`}</h1>
              ) : (
                <h1>No Tokens Obtained Yet</h1>
            )} */}

          </div>
        </div>
      </section>
      {/* <!-- end create --> */}
    </div>
  );
};

export default Create;
