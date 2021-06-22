pragma solidity >=0.4.21 <0.6.0;


contract Meme{
    string memeHash;

    function setMemeHash(string memory _val) public{
        memeHash = _val;
    }

    function getMemeHash() public view returns(string memory) {
        return memeHash;
    }

}
