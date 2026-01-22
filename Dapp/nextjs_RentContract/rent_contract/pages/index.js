import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {useState} from "react"
import { ethers } from "ethers";


export default function Home() {
  const [isConnected,setIsConnected]= useState(false);
  const [inputValue,setInputValue]= useState();
  const [ethprice,setEthprice]=useState();
  const [ethOfRent,setEthOFRent]=useState("0.00");
  const [isOwner, setIsOwner] = useState(false);
  const [isPaid, setIsPaid] = useState(null);

  const contractAddress="0x86fF1524DF28CA86738DAFD38f591169B9CC7354";
  const abi=[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_basefee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_percentageIncrease",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_pricefeed",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AlreadyFunded",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotCorrectValue",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "OnlyOwnerCanWithdraw",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "monthIndex",
				"type": "uint256"
			}
		],
		"name": "checkIfFunded",
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
				"name": "monthIndex",
				"type": "uint256"
			}
		],
		"name": "fund",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "monthIndex",
				"type": "uint256"
			}
		],
		"name": "getMonthRent",
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
		"name": "getlatestprice",
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
				"name": "monthIndex",
				"type": "uint256"
			}
		],
		"name": "totalEth",
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
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

  async function connect() {
    if(typeof window.ethereum!== "undefined"){
      try{ await ethereum.request({method:"eth_requestAccounts"})
      setIsConnected(true);
    }catch(e){
      alert("Access Denied");
      setIsConnected(false);
    }
    }else{
      alert("Install Metamask first")
    }

  }

  async function callgetpricefeed(){
    const provider= new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress,abi,provider);

    try{
     const tx = await contract.getlatestprice();
     const formattedPrice = ethers.formatUnits(tx, 8);
     alert("1Eth : "+formattedPrice+" USD")
	 setEthprice(formattedPrice);
    }catch(e){}
  }

  async function calltotalEth(){
   const provider= new ethers.BrowserProvider(window.ethereum);
   const contract = new ethers.Contract(contractAddress,abi,provider);

   try{
    const tx = await contract.totalEth(inputValue);
    alert("ETH to pay "+ ethers.formatEther(tx));
	setEthOFRent(ethers.formatEther(tx));
   }catch(e){

   }
  }
   async function pay() {
	  const provider= new ethers.BrowserProvider(window.ethereum);
	  const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress,abi,signer);

	  const weiValue = ethers.parseEther(ethOfRent);
      
     if (ethOfRent === "0.00") {
    alert("Please 'Check Rent Value' first to fetch the amount.");
    return;
  }
	  
	  try{
	 const tx = await contract.fund(Number(inputValue),{value:weiValue});
	 alert("Transaction sent! Waiting for confirmation...");
       await tx.wait();
       alert("Payment Successful!");
	  }catch(e){

	  
   }
}
   async function withdraw(){
	 const provider= new ethers.BrowserProvider(window.ethereum);
	 const signer= await provider.getSigner();
      const contract = new ethers.Contract(contractAddress,abi,signer);
	  const ownerAddr= await contract.owner();
	  const userAddress= await signer.getAddress();
     
	  if (userAddress.toLowerCase() === ownerAddr.toLowerCase()) {
    setIsOwner(true);
	 const tx = await contract.withdraw();
	 alert("Withdrawal transaction sent...");
    await tx.wait();
	alert("Funds successfully withdrawn to your wallet!");
  
  }else{
	alert("Only owner can withdraw")
  }
  

   }
   async function checkIfPaid() {
  if (!inputValue) return alert("Please enter an index first");
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const status = await contract.checkIfFunded(inputValue);
    
    setIsPaid(status);
    
    alert(status ? " This month is PAID" : "This month is NOT PAID");
  } catch (e) {
    console.error("Error checking status:", e);
    alert("Check failed. Ensure the index is valid.");
  }
}

  return (
  <div className={styles.page}>
	<div className={styles.container}>
  {isConnected ? (
	  <div>
      <button className={styles.btn} onClick={callgetpricefeed}>1 ETH in USD</button>
      <input className={styles.mainInput} placeholder="Enter the index..."
             onChange={((e)=>setInputValue(e.target.value))} />
			 <p>Rent</p>
          <h2>{ethOfRent}Eth</h2>
      <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={calltotalEth}>Check Rent Value</button>  
	  <button className={styles.btn} onClick={pay}>Pay</button> 
	  <button className={styles.btn} onClick={checkIfPaid}>Status</button>  
	  <button className={`${styles.btn} ${styles.btnWithdraw}`} onClick={withdraw}>WithDraw</button>  
    </div>
  ):(
    <div>
	<h1 className={styles.title}>RentChain</h1>
	<p className={styles.description}>
            The secure, decentralized way to manage and pay your rent using Ethereum. 
            </p>
      <button className={styles.btn} onClick={connect}>Connect</button>
    </div>
	
  )}
  </div>

   </div>
);
 
}
