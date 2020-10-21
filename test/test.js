const Magnolia = artifacts.require('./Magnolia.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Magnolia', ([deployer, author, tipper]) => {
  let magnolia

  before(async () => {
    magnolia = await Magnolia.deployed()
  })

  //deployment successfull
  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await magnolia.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    //Has a name
    it('has a name', async () => {
      const name = await magnolia.name()
      assert.equal(name, 'Magnolia')
    })
  })

  describe('images', async () => {
    let result, imageCount
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44QgrBCr739BN9Wb'

    before(async () => {
      result = await magnolia.uploadImage(hash, 'Image description', {from: author})
      imageCount = await magnolia.imageCount()
    })

    //creates images
    it('creates images', async () => {

      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, 'Image description', 'description is correct')
      assert.equal(event.tipAmount, '0', 'tip is correct')
      assert.equal(event.author, author, 'author is correct')

      //Failure test 1 no imgHash
      await magnolia.uploadImage('','Image description', {from: author}).should.be.rejected;

      //Failure test 2 no description
      await magnolia.uploadImage('ajbnajn213','', {from: author}).should.be.rejected;
    })

    //check that struct is correct
   it('lists images', async () => {
     const image = await magnolia.images(imageCount)
     assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
     assert.equal(image.hash, hash, 'Hash is correct')
     assert.equal(image.description, 'Image description', 'description is correct')
     assert.equal(image.tipAmount, '0', 'tip amount is correct')
     assert.equal(image.author, author, 'author is correct')
   })

   it('allows users to donate to images', async () => {

     // Track the author balance before tip
     let oldAuthorBalance
     oldAuthorBalance = await web3.eth.getBalance(author)
     oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

     result = await magnolia.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })


     const event = result.logs[0].args
     assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
     assert.equal(event.hash, hash, 'Hash is correct')
     assert.equal(event.description, 'Image description', 'description is correct')
     assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
     assert.equal(event.author, author, 'author is correct')

     // Check that author received funds
     let newAuthorBalance
     newAuthorBalance = await web3.eth.getBalance(author)
     newAuthorBalance = new web3.utils.BN(newAuthorBalance)

     let tipImageOwner
     tipImageOwner = web3.utils.toWei('1', 'Ether')
     tipImageOwner = new web3.utils.BN(tipImageOwner)

     const expectedBalance = oldAuthorBalance.add(tipImageOwner)

     assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

     // FAILURE: Tries to tip a image that does not exist
     await magnolia.tipImageOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
   })
 })
})
