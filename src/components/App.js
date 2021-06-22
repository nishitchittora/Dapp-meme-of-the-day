import React, { Component } from 'react';
import './App.css';
const { create } = require('ipfs-http-client')
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {
  state = {
    buffer: null,
    memeHash: null
  }

  captureFile = (event) =>{
      event.preventDefault();
      console.log("file captured");
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
      console.log("submitting.....");
      const file = ipfs.add(this.state.buffer);
      console.log(file);
      file.then((r)=>{
        this.setState({
          memeHash: r.path
        })
      })
  }

  render() {
    console.log(this.state);
    return (
        <div>
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
