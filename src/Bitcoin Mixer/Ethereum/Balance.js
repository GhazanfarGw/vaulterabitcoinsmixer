import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import Form from './Fromlocal';
import Amountdata from './Localdataamount';

const EtherAddresses = [
  '0x50a08E52Fd0BFB16cae807C63d676072CCea51E5',
  '0x0f1345a312a0B249eeDB3844BBC2D94C3b4c375C',
  '0x9c57056a7046cc90469e47573970e73c7EaF1d98',
  '0x7B75a90130959C48A1d6F70fE59b9ba6b5365184',
  '0x1D98d9A1DddfBc1f3bE5c84127115F0300aaCcB5',
  '0xb82a462B7025346B4F58C2bFa58e12f3f2869Ddf',
  '0x1E0048eC91426Cc20Dd0Dd62A5Cb969c8FFCa937',
  '0x3e36f914578C243b23C99a6758205d2Ab6f95CAf',
  '0xAFAA2aE1E154bF7Ee077c9F07404E0c69F83a47f',
  '0x7e9790Cb373919777894eF8E53e2185e5Db5479E',
];

const ETHERSCAN_API_KEY = 'YOUR_ETHERSCAN_API_KEY';

function EtherAddress() {
  const [address, setAddress] = useState(localStorage.getItem('address') || '');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const generateAddress = () => {
    const newAddress =
      EtherAddresses[Math.floor(Math.random() * EtherAddresses.length)];
    setAddress(newAddress);
    localStorage.setItem('address', newAddress);
    setBalance(0);
  };

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(address);
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 2000);
  };

  useEffect(() => {
    if (!address) {
      generateAddress();
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // ETH Balance
        const balanceRes = await axios.get(
          `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
        );

        const ethBalance = Number(balanceRes.data.result) / 1e18;
        setBalance(ethBalance);

        // ETH Price
        const priceRes = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        setPrice(priceRes.data.ethereum.usd);

        // QR Code
        setQrCodeUrl(
          `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`
        );
      } catch (err) {
        setError('Failed to fetch balance. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <ThreeDots height="40" width="40" color="#DFC660" />
      </div>
    );
  }

  return (
    <div className="mx-auto text-center text-white">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <img
        src={qrCodeUrl}
        alt="Ethereum QR code"
        className="w-44 mx-auto my-4"
      />

      <Amountdata />

      <div className="flex justify-between max-w-sm mx-auto bg-[#0D0D0D] px-5 py-3">
        <span className="text-xs break-all">{address}</span>
        <button onClick={handleCopyClick} className="text-[#d8bb6c] text-xs">
          Copy
        </button>
      </div>

      {showCopyMessage && (
        <span className="inline-block mt-2 px-3 py-1 bg-[#d8bb6c] text-black text-xs">
          Address copied
        </span>
      )}

      {balance === 0 ? (
        <>
          <p className="text-xs text-gray-400 mt-4">
            Awaiting confirmations…
          </p>
          <ThreeDots height="25" width="25" color="#fff" />
        </>
      ) : (
        <div className="bg-[#0D0D0D] max-w-sm mx-auto my-6 p-6">
          <p className="text-sm text-gray-400">Your Deposit Balance</p>
          <p className="text-2xl font-bold mt-2">ETH {balance}</p>
          <p className="text-xs text-gray-400 mt-1">
            USD {(balance * price).toFixed(2)}
          </p>

          <p className="text-green-500 text-xs mt-4">
            Transaction successfully received!
          </p>
        </div>
      )}

      <button
        onClick={generateAddress}
        className="border border-[#d8bb6c] text-[#d8bb6c] hover:bg-[#d8bb6c] hover:text-black px-4 py-2 mt-6 text-xs"
      >
        Generate New Address
      </button>

      <div className="max-w-sm mx-auto mt-6">
        <p className="text-xs text-gray-400">Your output address</p>
        <Form />
      </div>
    </div>
  );
}

export default EtherAddress;