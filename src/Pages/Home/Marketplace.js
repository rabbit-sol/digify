import React, { useEffect, useState, useRef } from "react";


import * as s from "./Marketplacecss";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../script/pinata.js";
import Marketplace from '../../script/Marketplace.json';


function Home() {

    const [formParams, updateFormParams] = useState({ name: '', description: '' ,external_url:''});
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const [disableButton,setDisableButton]=useState(true)
    const [dataFetched, updateFetched] = useState(false);

    async function OnChangeFile(e) {
       
        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            const response = await uploadFileToIPFS(file);
            if (response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
                setDisableButton(false)
            }
        }
        catch (e) {
            console.log("Error during file upload", e);
        }
    }


    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const { name, description,external_url } = formParams;
        //Make sure that none of the fields are empty
        if (!name || !description  || !fileURL)
            return;

        const nftJSON = {
            name, description,external_url, image: fileURL
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            if (response.success === true) {
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch (e) {
            console.log("error uploading JSON metadata:", e)
        }
    }


    async function mintNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            updateMessage("Please wait.. uploading (upto 1 min)")
            const metadataURL = await uploadMetadataToIPFS();
          
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
          
       


            //Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)



            //actually create the NFT
            let transaction = await contract.uploadDocs(metadataURL)
            await transaction.wait()

            alert("Successfully Minted your NFT!");
            updateMessage("");
            updateFormParams({ name: '', email: '', external_url: '' });
            window.location.replace("/")
        }
        catch (e) {
            alert("Upload error" + e)
            updateMessage(e.toString())
        }
    }


    async function getBal() {
        const ethers = require("ethers");
      
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();


        provider.getBalance(addr).then((balance) => {
            // convert a currency unit from wei to ether
            const balanceInEth = ethers.utils.formatEther(balance)
            console.log(`balance: ${balanceInEth} ETH`)
            const ethereumButton = document.querySelector('.enableEthereumButton');
            ethereumButton.textContent = balanceInEth.substring(0, 5) + ' Eth'
        })


       
        updateFetched(true);
      

    }

    if (!dataFetched)
        getBal();

    return (
        <>

            <s.Container flex={1} ai={"center"} style={{ paddingTop: 30 }}>


                <s.ResponsiveWrapper flex={1} test>

                    <h1 style={{ marginBottom: "0px" }}>Upload Your Docs</h1>
                    <s.TextInfo> * Required fields</s.TextInfo>
                    <s.TextSubTitle>Your Digtial ID card *</s.TextSubTitle>

                    <s.TextInfo >Types supported: Adhar Card, PAN Card, Voter ID Card, Electricity Bill, Bank Statement. Max size: 10 MB</s.TextInfo>

                    <s.uploadInput onChange={OnChangeFile} accept="image/png,image/gif,image/jpeg,image/jpg,image/svg"  type="file" name="file"  id="fileid" />

                    <s.TextSubTitle>Your Name *</s.TextSubTitle>
                   
                    <s.nftInput type="text" name="name" placeholder="Item Name" onChange={e => updateFormParams({ ...formParams, name: e.target.value })} value={formParams.name} />

                    <s.TextSubTitle>External link</s.TextSubTitle>
                   
                    <s.nftInput type="text" name="externallink" placeholder="https://yoursite.io/" value={formParams.external_url} onChange={e => updateFormParams({ ...formParams, external_url: e.target.value })} />

                    <s.TextSubTitle>E-mail</s.TextSubTitle>
                    <s.TextInfo>The email will be included on the doc's detail page underneath its image.</s.TextInfo>
                    <s.nftInput type="email" name="email" placeholder="Enter your email" value={formParams.description} onChange={e => updateFormParams({ ...formParams, description: e.target.value })}  />

                   

                    <s.StyledButton onClick={mintNFT} disabled={disableButton} className="">
                        Verify Docs
                    </s.StyledButton>
                    <s.TextInfo>Upload Docs to enable Verify Button</s.TextInfo>
                    <s.TextInfo>{message}</s.TextInfo>


                </s.ResponsiveWrapper>


            </s.Container>

        </>

    );
}

export default Home;
