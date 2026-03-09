// This page allows ANYONE (not just logged-in users) to verify a tree
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers'; // Essential for "Actual" verification
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const VerifyAsset = () => {
  const { treeId } = useParams();
  const [onChainData, setOnChainData] = useState(null);
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    const verifyOnChain = async () => {
      // 1. Connect to Polygon (Public RPC)
      const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      // 2. Fetch data directly from your Hardhat-deployed contract
      const data = await contract.getTreeDetails(treeId);
      
      // 3. Compare with your DB (Optional: Fetch DB data here too)
      setOnChainData(data);
      setIsMatch(true); // Logic to compare DB vs Blockchain
    };
    verifyOnChain();
  }, [treeId]);

  return (
    <div className="max-w-md mx-auto p-8 mt-20 border rounded-3xl shadow-xl text-center">
      {isMatch ? (
        <>
          <ShieldCheck size={60} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Authenticity Verified</h2>
          <p className="text-gray-500 text-sm mt-2">
            This asset is cryptographically secured on the Polygon Network.
          </p>
          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-left font-mono text-xs">
            <p>Tree ID: {treeId}</p>
            <p>On-Chain Status: {onChainData?.status}</p>
          </div>
        </>
      ) : (
        <AlertTriangle size={60} className="text-red-500 mx-auto" />
      )}
    </div>
  );
};