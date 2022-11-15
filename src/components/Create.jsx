import React from 'react';
import { useState } from "react";
import { useEffect } from 'react';
import { NFTStorage, File } from "nft.storage";

const nftStorage = new NFTStorage({
  token: process.env.REACT_APP_NFT_STORAGE_KEY,
});

const store = async (name, description, data, fileName, type) => {
  const metadata = await nftStorage.store({
    name,
    description,
    image: new File([data], fileName, { type }),
  });
  console.log(metadata);
  return metadata;
};

export default function Create({ bunzz, userAddress }) {

  const [blob, setBlob] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [base64, setBase64] = useState(null);
  const [onGoing, setOnGoing] = useState(false);
  const [tokenId, setTokenId] = useState(81);
  const [type, setType] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  let [increment, setIncrement]=useState(0)

  
  // useEffect(() => {
  //   window.localStorage.setItem('tokenId', tokenId);
  // }, [tokenId]);


  // useEffect(() => {
  //   setTokenId(JSON.parse(window.localStorage.getItem('tokenId')));
  // }, []);

  

  const select = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file) {
      readAsBlob(file);
      readAsBase64(file);
      setType(file.type);
      setFileName(file.name);
    }
  };

  const readAsBlob = (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      console.log(reader.result);
      setBlob(reader.result);
    };
  };

  const readAsBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      setBase64(reader.result);
    };
  };

  const mintNFT = async () => {
    console.log('tokenId',tokenId)

    try {
const contract = await bunzz.getContract("NFT (ERC721)")

      const tx = await contract.mint(userAddress, tokenId);
      const receipt = await tx.wait();
      const event = receipt.events[0];
      const _tokenId = event.args[2];
      console.log('increment1',increment)

    
      setTokenId(tokenId +1);
      console.log('tokenId',tokenId)
      await approve();

      list();

      setBase64(null);
      window.alert("Succeeded to mint");

      console.log('receipt',receipt.events);
    } catch (err) {
      console.error(err);
    }
  }

  const getListing = async () => {
    try {
      console.log('grtToken')
      const contract = await bunzz.getContract("Simple Marketplace (For NFT)");
      const tx = await contract.getToken("4");
      console.log('grtToken')

      const receipt = await tx.wait();
  
      console.log('listings',receipt.events);
      
    } catch (error) {
      
    }
  }


  const getBalance = async () => {

    try {
const contract = await bunzz.getContract("NFT (ERC721)")

      const res = await contract.balanceOf(userAddress);
      console.log('balance',res);
    } catch (err) {
      console.error(err);
    }
  }

  const list = async () => {
    try{
      
      const contract = await bunzz.getContract("Simple Marketplace (For NFT)");
      const tx = await contract.list(0,20);
      const receipt = await tx.wait();
  
      console.log('list receipt',receipt.events);
    }catch (err) {
      console.error(err);
    }

  }

  const approve = async () => {
    try {
      const contract = await bunzz.getContract("NFT (ERC721)")
      
            const res = await contract.approve('0xed3B8a112C2dA5A30BAbdED140b77Cb6F900fBa9',tokenId);
            console.log('approve',res);
          } catch (err) {
            console.error(err);
          }
  }
  return (
    <>
      <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <div className="g-4 row">
            <input type="file" accept="image/*" onChange={select} />
      {base64 ? (
          <img src={base64} alt="hoge" className="image" />
      ) : (
        <></>
      )}
              <input  size="lg" required type="text" placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
              <input  size="lg" required as="textarea" placeholder="Description" value={description}
        onChange={(e) => setDescription(e.target.value)}/>
              <input  size="lg" required type="number" placeholder="Price in ETH" value={price}
        onChange={(e) => setPrice(e.target.value)}/>
              <div className="d-grid px-0">
                <button onClick={mintNFT}  type="button" class="btn btn-primary">
                  Create & List NFT!
                </button>
                <button onClick={getListing}  type="button" class="btn btn-primary">
                getListing
                </button>
                <button onClick={list}  type="button" class="btn btn-primary">
                list
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  )
}
