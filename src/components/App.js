import React, { Component } from 'react';
import './App.css';
import Web3 from "web3";
import Meme from '../abis/Meme.json';
const { create } = require('ipfs-http-client')
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {
  state = {
    buffer: null,
    memeHash: '',
    account: "",
    contract: null
  }

  async componentWillMount(){
      await this.loadWeb3();
      await this.loadBlockchainData();
  }

  async loadBlockchainData(){
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const networkID = await web3.eth.net.getId();
      const networkData = Meme.networks[networkID];
      if(networkData){
          const abi = Meme.abi;
          const address = networkData.address;
          const contract = web3.eth.Contract(abi, address);
          this.setState({
            contract
          })
          const memeHash = await contract.methods.getMemeHash().call()
          this.setState({
            memeHash
          })
      }else{
        window.alert("no contract found!!");
      }
      this.setState({
        account: accounts[0]
      })
  }

  async loadWeb3() {
      if(window.ethereum){
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
      }else if(window.web3){
          window.web3 = new Web3(window.web3.currentProvider);
      }else{
          window.alert("Please use metamask");
      }
  }

  captureFile = (event) =>{
      event.preventDefault();
      const file = event.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () =>{
          this.setState({
              buffer: Buffer(reader.result)
          })
      }
  }

  submitMeme = (event) =>{
      event.preventDefault();
      const _this = this;
      const file = ipfs.add(this.state.buffer);
      file.then((r)=>{
          this.state.contract.methods.setMemeHash(r.path)
            .send({from:this.state.account}, function(error, trans){
              _this.setState({
                memeHash: r.path
              })
          })
      })

  }

  render() {
    return (
        <div>
          <p>Account: {this.state.account}</p>
          <img alt="asdasd" src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} />
          <h2>Change Meme</h2>
          <form onSubmit={this.submitMeme}>
              <input type="file" onChange={this.captureFile}/>
              <input type="submit" />
          </form>
        </div>
    );
  }
}

export default App;
