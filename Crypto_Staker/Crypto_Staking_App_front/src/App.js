import React, { useEffect, useState } from "react";
import "./App.css";
import { tokenList } from "./constants";
import { ethers } from "ethers";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import axios from "axios";

const StakeABI = require("./StakeApp.json");

const Stakeaddr = tokenList.find((item) => item.name === "").address;

let signer, StakeApp;

const url = "http://localhost:5000/api";

function App() {
  // form value related variable
  const [inputAddress, setinputAddress] = useState("");

  const handleChange01 = (e) => {
    // 👇 Store the input value to local state
    setinputAddress(e.target.value);
  };

  // form value related variable
  const [inputAmount, setinputAmount] = useState(0);

  const handleChange02 = (e) => {
    // 👇 Store the input value to local state
    setinputAmount(e.target.value);
  };

  // to store token list from the database
  const [stakedTokens, setStakedTokens] = useState([]);

  useEffect(() => {
    console.log("executed when app loads");
    getAlltokens();
  }, []);

  useEffect(() => {
    console.log("executed when tokenList length changes");
    getAlltokens();
  }, [stakedTokens.length]);

  const getAlltokens = async () => {
    // getTokens API
    // Stores the response in stakedTokens Variable
    const response = await axios.get(url + "/token/getTokens");
    setStakedTokens(response.data.tokens);
    console.log(stakedTokens);
  };

  const connectWallet = () => {
    // Asking if metamask is already present or not
    if (window.ethereum) {
      // res[0] for fetching a first wallet
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner(String(res[0]));
        StakeApp = new ethers.Contract(Stakeaddr, StakeABI.abi, signer);
        console.log("The Connected Wallet Address is:", signer._address);
      });
    } else {
      alert("install metamask extension!!");
    }
  };

  const AddToken = async (token_addr) => {
    // Filter the token from its address
    const token = tokenList.find((item) => item.address === token_addr);

    // addStakeToken transaction call
    await StakeApp.addStakeToken(token.address);

    // axios post request
    const response = await axios.post(url + "/token/addToken", token);
    console.log(response);

    // call getAlltokens
    getAlltokens();
  };

  const stake = async (token_addr, amount) => {
    await StakeApp.stake(token_addr, amount);
    console.log("Stake Works");
  };

  const unstake = async (token_addr, amount) => {
    await StakeApp.unstake(token_addr, amount);
    console.log("Unstake Works");
  };

  return (
    <div>
      <div className="wallet">
        <Button
          onClick={connectWallet}
          class="button"
          color="warning"
          outline
          size="lg"
        >
          Connect Wallet
        </Button>
      </div>
      <div className="formitem">
        <Form>
          <FormGroup>
            <Label for="tokenaddress">Enter the ERC20 Token Address</Label>
            <Input
              id="tokenaddress"
              name="tokenaddress"
              placeholder="Enter the valid Address"
              type="text"
              onChange={handleChange01}
              value={inputAddress}
            />
            <Button onClick={() => AddToken(inputAddress)} color="primary">
              Add New Token
            </Button>
          </FormGroup>
        </Form>
      </div>
      <div className="tokenitems">
        <ListGroup>
          {stakedTokens.map((tokenObj) => (
            <ListGroupItem key={tokenObj} className="flex-space">
              {tokenObj.name}: {tokenObj.address}
              <Input
                className="tokenamount"
                placeholder="amount"
                size="sm"
                type="number"
                onChange={handleChange02}
                value={inputAmount}
              />
              <Button
                onClick={() => stake(tokenObj.address, inputAmount)}
                color="info"
              >
                Stake
              </Button>
              <Button
                onClick={() => unstake(tokenObj.address, inputAmount)}
                color="dark"
              >
                Unstake
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    </div>
  );
}

export default App;
