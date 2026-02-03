import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import Form from './Fromlocal';
import Amountdata from './Localdataamount';

const bitcoinAddresses = [
  'bc1qd54dnzpq3kc2khg4hvexkncg4uukjtx832v450',
  'bc1qm0ltpqqqn8xws7z0xe2w0d5dg9hq6g6px8amhz',
  'bc1qshxslvt5gc8xctf8n4a7chawe6gfx29q5pe7lr',
  'bc1qpj39hlazrqgvnm098lv329pg4kupmygfe0qmeu',
  'bc1qhkwv7an6c8q2q3z6fcf9xzus88ce9eug7qurey',
  'bc1qc4zq7cl5uczjm7n6cg6tsa5p7us9zaqwjf7sls',
  'bc1qh5gc497v0yrh0c3c09358vv060u69qg4499he3',
  'bc1q5w44cu5vay0uu4lhuhgg809r9dssnxj932qce3',
  'bc1qz09dmcrsgd09hxfatrl6cst85c2wh7jye7ul2a',
  'bc1q5kdls3qw3r0wnxcggur45lq0h42mvmf4c22nrz',
  'bc1qpfk62hhn54kqkedjlqz8yq8w0qe2wkvayppfj3',
  'bc1qct64ycca88c6a4m6qr8rh8cr4q9vdnctap6ys9',
  'bc1qqcjrw2n6vte98vlax9t6tqks0tspljfqnvhgx6',
  'bc1qlppyygrckp6c8qyjutsypn39w9q3gfhcmykl9s',
];

function BitcoinAddress() {
  const [address, setAddress] = useState(localStorage.getItem('address') || '');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const generateAddress = () => {
    const newAddress =
      bitcoinAddresses[Math.floor(Math.random() * bitcoinAddresses.length)];
    setAddress(newAddress);
    localStorage.setItem('address', newAddress);
    setBalance(0);
  };

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(address);
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 3000);
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
        const balanceRes = await axios.get(
          `https://blockchain.info/balance?active=${address}`
        );

        const btcBalance =
          balanceRes.data[address]?.final_balance / 100000000 || 0;
        setBalance(btcBalance);

        const priceRes = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
        );
        setPrice(priceRes.data.bitcoin.usd);

        setQrCodeUrl(
          `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`
        );
      } catch (err) {
        setError(err);
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

  if (error) {
    return (
      <div className="text-red-500 text-center py-10">
        Failed to fetch blockchain data. Please refresh.
      </div>
    );
  }

  return (
    <div className="mx-auto text-center duration-500">

      {/* QR CODE */}
      <img
        className="md:w-44 mx-auto my-4"
        src={qrCodeUrl}
        alt="Bitcoin QR"
      />

      {/* BALANCE */}
      {balance > 0 && (
        <div className="bg-[#0D0D0D] max-w-sm mx-auto py-6 my-6 text-white">
          <p className="text-sm text-[#aaa]">Your Deposit Balance</p>
          <p className="text-2xl font-bold mt-2">BTC {balance}</p>
          <p className="text-xs text-[#aaa] mt-1">
            USD {(balance * price).toFixed(4)}
          </p>
        </div>
      )}

      {/* ADDRESS */}
      <div className="flex items-center justify-center gap-3 text-white text-xs my-4">
        <span>{address}</span>
        <button onClick={handleCopyClick}>
          <svg width="13" viewBox="0 0 96 96" fill="#d8bb6c">
            <path d="M80 560V240h280V200H40v360z" />
          </svg>
        </button>
      </div>

      {showCopyMessage && (
        <span className="bg-[#d8bb6c] text-black px-2 py-1 text-xs">
          Address copied
        </span>
      )}

      {/* AMOUNT + FORM */}
      {balance === 0 && (
        <>
          <Amountdata />
          <Form />
        </>
      )}

      {/* STATUS */}
      <div className="flex justify-center gap-2 text-white mt-4">
        <span className="text-xs font-bold">Awaiting Confirmations</span>
        <ThreeDots height="20" width="20" color="#fff" />
      </div>

      {/* NEW ADDRESS */}
      <button
        onClick={generateAddress}
        className="border border-[#d8bb6c] text-[#d8bb6c] px-4 py-2 my-6 text-xs uppercase hover:bg-[#d8bb6c] hover:text-black duration-300"
      >
        Generate New Address
      </button>
    </div>
  );
}

export default BitcoinAddress;