// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}



contract Marketplace {

    // Variables
    address payable public immutable seller; // the account that receives payment
    address public nftAddress;

    struct Item {
        address owner;
        uint price;
        bool sold;
        uint itemid;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    modifier onlySeller(){
        require(msg.sender==seller,"message sender is not a seller");
        _;
    }

   
    event Bought(
        uint itemid,
        uint price,
        address indexed owner
    );

    constructor(
        address _nftAddress,
        address payable _seller
    ) {
        seller =_seller;
        nftAddress=_nftAddress;
    }

    // Make item to offer on the marketplace
    function makeItem(uint _nftID, uint _price) public payable onlySeller {
        require(_price > 0, "Price must be greater than zero");
        
        // transfer nft
        IERC721(nftAddress).transferFrom(msg.sender,address(this),_nftID);
        // add new item to items mapping
        items[_nftID] = Item (
            address(this),
            _price,
            false,
            _nftID
        );
        
    }

    function purchaseItem(uint _itemId) external payable{
        Item storage item = items[_itemId];
        uint _totalPrice = item.price;
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        
        IERC721(nftAddress).transferFrom(address(this), msg.sender, _itemId);
        seller.transfer(_totalPrice);

        // update item to sold
        item.sold = true;
        item.owner=msg.sender;
        // transfer nft to buyer
        // emit Bought event
        emit Bought(
            _itemId,
            item.price,
            msg.sender
        );
    }

    function getBalance()public view returns(uint256) {
        return address(this).balance;

    }


}