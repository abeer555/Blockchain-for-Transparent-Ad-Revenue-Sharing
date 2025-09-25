// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title Transparent Ad Revenue Sharing
/// @notice Company deposits ad payment, automatically split between Platform and Creator
contract AdRevenueSharing {
    address public company;   // the advertiser or company who funds the contract
    address public platform;  // the ad platform
    address public creator;   // the content creator

    uint public platformShare; // percentage (e.g., 30)
    uint public creatorShare;  // percentage (e.g., 70)

    event PaymentReceived(address indexed from, uint amount);
    event RevenueDistributed(uint platformAmount, uint creatorAmount);
    event Withdrawn(address indexed to, uint amount);

    mapping(address => uint) public balances;

    /// @param _platform address of the platform
    /// @param _creator address of the creator
    /// @param _platformShare % share for platform (0–100)
    /// @param _creatorShare % share for creator (0–100), must sum to 100 with platformShare
    constructor(address _platform, address _creator, uint _platformShare, uint _creatorShare) {
        require(_platform != address(0), "Invalid platform address");
        require(_creator != address(0), "Invalid creator address");
        require(_platformShare + _creatorShare == 100, "Shares must add up to 100");

        company = msg.sender; // deployer is the company
        platform = _platform;
        creator = _creator;
        platformShare = _platformShare;
        creatorShare = _creatorShare;
    }

    /// @notice Deposit ad revenue, only callable by company
    function deposit() public payable {
        require(msg.value > 0, "Must deposit funds");
        require(msg.sender == company, "Only company can deposit");

        emit PaymentReceived(msg.sender, msg.value);

        uint platformAmt = (msg.value * platformShare) / 100;
        uint creatorAmt  = (msg.value * creatorShare) / 100;

        balances[platform] += platformAmt;
        balances[creator]  += creatorAmt;

        emit RevenueDistributed(platformAmt, creatorAmt);
    }

    /// @notice Withdraw available funds for caller (platform or creator)
    function withdraw() public {
        uint amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");

        balances[msg.sender] = 0;
        (bool ok,) = payable(msg.sender).call{value: amount}("");
        require(ok, "Transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Check balance of any participant
    function checkBalance(address user) public view returns (uint) {
        return balances[user];
    }

    /// @notice Get contract information
    function getContractInfo() public view returns (
        address _company,
        address _platform,
        address _creator,
        uint _platformShare,
        uint _creatorShare,
        uint _contractBalance
    ) {
        return (
            company,
            platform,
            creator,
            platformShare,
            creatorShare,
            address(this).balance
        );
    }
}