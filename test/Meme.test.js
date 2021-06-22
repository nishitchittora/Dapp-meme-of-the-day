const Meme = artifacts.require("Meme");

require("chai")
  .use(require("chai-as-promised"))
  .should()


contract("Meme", (accounts)=>{
   let meme ;
   before(async()=>{
     meme = await Meme.deployed();
   })

   describe("deployment", async()=>{
      it("deploys successfully", async()=>{
        const address = meme.address;
        console.log(address);
        assert.notEqual(address, '');
        assert.notEqual(address, 0x0);
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
      })
   });

   describe("storage", async()=>{
      it("updates the memeHash", async()=>{
        let memeHash = "abc123";
        await meme.setMemeHash(memeHash);
        let result = await meme.getMemeHash();
        assert.equal(result, memeHash);
      })
   });
})
