pragma solidity ^0.5.0;

contract Magnolia {
  string public name = "Magnolia";



  //Store images
  uint public imageCount = 0;
  mapping(uint => Image) public images;

  struct Image{
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
   }

   event ImageCreated(
     uint id,
     string hash,
     string description,
     uint tipAmount,
     address payable author
   );

   event ImageTipped(
     uint id,
     string hash,
     string description,
     uint tipAmount,
     address payable author
     );

  //Create images
  function uploadImage(string memory _imgHash, string memory _description) public {

    //make sure description is not empty
    require(bytes(_description).length > 0);

    //make sure image hash exists
    require(bytes(_imgHash).length > 0);

    //make sure uploader address exists
    require(msg.sender != address(0x0));
    //increment image imageCount
    imageCount++;

    //Add image to contract
    images[imageCount] = Image(imageCount,_imgHash, _description, 0, msg.sender);

    //Trigger event
    emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);

  }
  //Tip images
  function tipImageOwner(uint _id) public payable{

    //make sure the id is valid
    require(_id > 0 && _id <= imageCount);

    //Fetch image from storage
    Image memory _image = images[_id];

    //Fetch img Author
    address payable _author = _image.author;

    //Pay author
    address(_author).transfer(msg.value);

    //increment tip Amount
    _image.tipAmount = _image.tipAmount + msg.value;

    //Update img
    images[_id] = _image;

    //Trigger tip event
    emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);

  }
}
