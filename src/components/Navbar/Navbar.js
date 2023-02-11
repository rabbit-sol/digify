import React, { useEffect, useState, useRef } from "react";

import * as s from "./navbarcss"

import { Link, } from "react-router-dom";



function Navbar() {


    const [currAddress, updateAddress] = useState('0x');

    async function getAddress() {
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

       
    }



    async function connectWebsite() {

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x5') {
            //alert('Incorrect network! Switch your metamask network to Rinkeby');
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x5' }],
            })
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(() => { 
                getAddress()
            });
    }

    return (
        <div>
            <s.Header>
                
                    <s.StyledLogo alt={"logo"} id="mymainimage" src="https://cdn.dribbble.com/users/623914/screenshots/17252125/media/8b988bf690f135d8ca18c3d65dfa59b2.jpg?compress=1&resize=1000x750&vertical=top" />
                <s.TextTitle><a href="/">DIGIFY</a></s.TextTitle>
                
                <s.searchInput type="text" name="searchBar" placeholder="Search Items" />
                
            
                <s.StyledButton className="enableEthereumButton" onClick={connectWebsite}>Connect Wallet</s.StyledButton>
            </s.Header>
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">

                    <ul className="d-flex flex-row">
                        <li className="active mr-4"><a href="/">Home</a></li>
                        <li><a className="mr-4 " href="/profile">Profile</a></li>
                      

                    </ul>

                </div>
            </nav>
          
        

        </div>
    );
}

export default Navbar;
