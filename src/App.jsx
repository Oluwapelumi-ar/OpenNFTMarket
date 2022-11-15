import { useEffect, useState } from "react";
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';

import { ERC721Minter } from "./components/ERC721Minter";
import { ERC721Checker } from "./components/ERC721Checker";
import bunzz from "bunzz-sdk";
import Create from "./components/Create";
import Navigation from "./components/Navbar";
import Home from "./components/Home";

const DAPP_ID = '3318d97a-cc9a-47c0-bbf5-58a747d2886d';
const API_KEY = '4ee2d15b-f620-471e-b018-a6ffaa88bb8c';

const App = () => {
  const [handler, setHandler] = useState();
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    setup()
  }, [])

  const setup = async () => {
    const handler = await bunzz.initializeHandler({
      dappId: DAPP_ID,
      apiKey: API_KEY,
    });

    const userAddress = await handler.getSignerAddress();

    console.log(userAddress);
    setUserAddress(userAddress);
    setHandler(handler);
  }

  return (
    <>
    <Router>
    <>
       <Navigation  />
     </>
     <Routes>
              <Route path="/" element={
                <Home  />
              } />
              <Route path="/create" element={
                <Create bunzz={handler} userAddress={userAddress} />
              } />
              {/* <Route path="/my-listed-items" element={
                <MyListedItems marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketplace} nft={nft} account={account} />
              } /> */}
            </Routes>

    </Router>
     
   
 
    </>
  );
};

export default App;
