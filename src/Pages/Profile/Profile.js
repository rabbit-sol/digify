
import { useLocation, useParams } from 'react-router-dom';

import MarketplaceJSON from '../../script/Marketplace.json';

import axios, * as others from 'axios';
import { useState } from "react";


//require('dotenv').config();
const key = "e0491d2fa086b817c618"
const secret = "d07708d1e57b3616e10435917a27a03814fc3479abb1b6e640f4e8582100a3b1";


export default function Profile() {
    const [data, updateData] = useState({});
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("Connecting...");
    const[tokenUri,setTokenuri]=useState("")
    const[tokenIdd,setTokenId]=useState("")

    async function getNFTData(tokenId) {
        const ethers = require("ethers");
         const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        provider.getBalance(addr).then((balance) => {         
            const balanceInEth = ethers.utils.formatEther(balance)
            console.log(`balance: ${balanceInEth} ETH`)
            const ethereumButton = document.querySelector('.enableEthereumButton');
            ethereumButton.textContent = balanceInEth.substring(0, 5) + ' Eth'
        })


        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

        //create an NFT Token
        let transaction = await contract.seeMyDocs()

        setTokenuri(transaction.tokenURI)
        setTokenId(transaction.tokenId.toNumber())

         const res = await fetch(transaction.tokenURI);

         const metadata = await res.json();
         console.log(metadata.name,"sdf")

         updateData(metadata);
       
        updateFetched(true);
        updateAddress(addr);
      
}

    const params = useParams();
    const tokenId = params.tokenId;
    if (!dataFetched)
        getNFTData(tokenId);

    return (
        <div className="" style={{ "minHeight": "100vh" }}>

            <div className="">
                <div className="flex text-center flex-col mt-11 md:text-2xl ">
                    <div className="mb-5">
                        <h2 className="font-bold">Wallet Address</h2>
                        {address}
                    </div>
                </div>

                <div className="flex flex-col text-center items-center mt-4 ">
                    <h2 className="font-bold text-decoration-underline ">Your Last Updated Docs</h2>
                    <h3 className="font-bold mt-5 ">Ticket id: {tokenIdd}</h3>
                    <h5 className="font-bold "><p>Name: {data.name}</p></h5>
                    <h5 className="font-bold "><p>Email: {data.description}</p></h5>
                 
                    <img src={data.image} alt="" style={{ width: "300px" }} className="w-30 h-30 rounded-lg object-cover" />
                  
                </div>
            </div>
        </div>
    )
};