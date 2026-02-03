import { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom"
import Index from "./Home/Index";
import ClipLoader from 'react-spinners/CircleLoader';
import How from "./components/How";
import Select from "./components/Select";
import Bitcoinfrom from "./Bitcoin Mixer/Bitcoin/Form";
import Bitcoinreceived from "./Bitcoin Mixer/Bitcoin/Received";
import Etherfrom from "./Bitcoin Mixer/Ethereum/Form";
import Etherreceived from "./Bitcoin Mixer/Ethereum/Received";

function App() {
  const [loading , setloading] = useState(false)
  useEffect (() => {
    setloading(true)
    setTimeout (() =>{
      setloading (false)
    },2000)
  },[])

  return (
    <div className="App scroll-smooth duration-300 overflow-hidden">
      { loading ?
       <ClipLoader color={"#DFC660"} loading={loading} size={50} className='justify-center text-center align-middle items-center mx-auto md:my-96 my-72'/>
      :
      <Routes>
        <Route path="/" element={ <Index/> } />
        <Route path="/select" element={ <Select/> } />
        <Route path="/how_to" element={ <How/>} />
        <Route path="/f580a429a4aad1324b055c3b56486079173455bdee2c749cb715b62898223270" element={ <Bitcoinfrom/> } />
        <Route path="/c439ca6b170e956cdab143217d11a5c170a273156f0561833aca22b22b046451" element={ <Bitcoinreceived/> } />
        <Route path="/16b3cfb4b91d0874872cc599d0bb190914e947a6d0368503915c5796d9bbd43f" element={ <Etherfrom/>} />
        <Route path="/40d1aabae0adcc31bf4ac587b3abb11e88d02a42b681670efa4b82058bbd818b" element={ <Etherreceived/>} />
  
      </Routes>
      }
    </div>
  )
}

export default App