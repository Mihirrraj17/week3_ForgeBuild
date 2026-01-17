import {useState} from "react";
import {ethers} from "ethers";

import styles from "../styles/Home.module.css";

export default function Home() {

  const [isConnected,setIsConnected]=useState(false);
  const [isProvider,setProvider]=useState();
  const [isSigner,setSigner]= useState();

  const contractAddress ="0xcFb5b4F2c2Cca383F4EbCF1e1B6373ed09e61252";
   const abi=[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposit",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "list",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
  
  async function connect(){
   if(typeof window.ethereum!=="undefined"){
    try{ await window.ethereum.request({method:"eth_requestAccounts"})
      setIsConnected(true);
    }catch(e){
      alert("Request denied")
    }
   }
   else{
    console.error("Please install Metamask")
   }
  }

  async function deposit(){
    const provider= new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const signer = await provider.getSigner();
    setSigner(signer)
   

    const contract= new ethers.Contract(contractAddress,abi,signer);
    const amount= ethers.parseEther("0.00000000000001")


    try{
      const tx =await contract.deposit({value:amount});
    }catch(e){

    }
  }

  async function Balance(){
     const provider= new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

     const balance= await provider.getBalance(contractAddress);
     const amountinEth= ethers.formatEther(balance);
     alert("Balance of this Contract: "+ amountinEth+"Eth" );
  }

  return(
    <div className={styles.page}>
     {isConnected ? (<>
      <button onClick={deposit}>Deposit</button>
      <button onClick={Balance}>Balance</button>
      </>
     ): (
      <button onClick={connect} >Connect</button>
     )}
     
    </div>
  )

 
}
