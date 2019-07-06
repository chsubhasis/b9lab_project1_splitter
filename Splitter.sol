pragma solidity >=0.4.21 <0.6.0;

contract Splitter {
    address payable public alice;
    address payable public bob;
    address payable public carol;

   constructor(address payable _bob, address payable _carol) payable public {
        alice = msg.sender;
        bob = _bob;
        carol = _carol;
    }

    modifier isRich() {
        require(msg.value < alice.balance, "Insufficient Fund");
        _;
    }
    
    function getBalanceBob() public returns (uint)  {
        return bob.balance;
    }
    
    function getBalanceCarol() public returns (uint)  {
        return carol.balance;
    }

    function getBalanceAlice() public returns (uint)  {
        return alice.balance;
    }
    
    function splitMe() public payable isRich() {
       bob.transfer(msg.value/2);
       carol.transfer(msg.value/2);
    }
}