// SPDX-License-Identifier: MIT
pragma solidity =0.8.19;

import "./interfaces/IERC20.sol";

contract StakeApp {
    event newStakedTokenAdded(
        address tokenAddr,
        uint8 position,
        uint blocktime
    );
    event tokenStaked(address tokenAddr, address user, uint stakedAmount);
    event tokenUnstaked(address tokenAddr, address user, uint unstakedAmount);

    // Reward Token Object
    IERC20 public immutable RewardToken;

    // owner to restrict few function calls
    address public owner;

    // rewards Rate
    uint8 rate;

    // Count of no.of stake tokens in this contract
    uint8 count;

    // Unstake time from the time of staking in minutes
    uint endTime;

    // uint to staked Token Address mapping
    mapping(address => uint) public stakingTokensTracker;

    // ERC20 <=> User <=> End Time
    mapping(address => mapping(address => uint)) private userUnstakeTime;

    // ERC20 <=> User <=> Staked Amount
    mapping(address => mapping(address => uint)) public userStakedAmount;

    // ERC20 <=> User <=> Reward Amount
    mapping(address => mapping(address => uint)) public userRewardAmount;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier tokenExists(address _tokenAddr) {
        require(
            stakingTokensTracker[_tokenAddr] > 0,
            "Token Does not Exist for staking in this contract"
        );
        _;
    }

    constructor(address _rewardToken) {
        owner = msg.sender;
        count = 1;
        endTime = 5 minutes;
        rate = 2;
        RewardToken = IERC20(_rewardToken);
    }

    function addStakeToken(
        address _stakeAddress
    ) external onlyOwner returns (bool) {
        require(
            _stakeAddress != address(0),
            "Zero Address cannot be staked token"
        );
        require(
            stakingTokensTracker[_stakeAddress] == 0,
            "This token is already beenStaked"
        );

        stakingTokensTracker[_stakeAddress] = count;
        count++;

        emit newStakedTokenAdded(_stakeAddress, count - 1, block.timestamp);

        return true;
    }

    function stake(
        address tokenAddr,
        uint amount
    ) external tokenExists(tokenAddr) returns (bool) {
        require(
            IERC20(tokenAddr).balanceOf(msg.sender) >= amount,
            "Insufficient Token Balance"
        );
        require(
            IERC20(tokenAddr).transferFrom(msg.sender, address(this), amount),
            "TF Failed - stake method"
        );

        userStakedAmount[tokenAddr][msg.sender] += amount;
        userUnstakeTime[tokenAddr][msg.sender] = block.timestamp + endTime;

        emit tokenStaked(tokenAddr, msg.sender, amount);

        return true;
    }

    function unstake(
        address tokenAddr,
        uint amount
    ) external tokenExists(tokenAddr) returns (bool) {
        require(
            block.timestamp > userUnstakeTime[tokenAddr][msg.sender],
            "You have to lock your tokens for atleast 5 minutes"
        );
        require(
            userStakedAmount[tokenAddr][msg.sender] >= amount,
            "Insufficient Staked Amount cannot be withdrawn"
        );

        uint timeStaked = block.timestamp -
            (userUnstakeTime[tokenAddr][msg.sender] - endTime); // in seconds

        userStakedAmount[tokenAddr][msg.sender] -= amount;
        userRewardAmount[tokenAddr][msg.sender] =
            amount *
            (timeStaked / 30 days) *
            (rate / 100);

        IERC20(tokenAddr).transfer(msg.sender, amount);
        IERC20(address(RewardToken)).transfer(
            msg.sender,
            userRewardAmount[tokenAddr][msg.sender]
        );

        emit tokenUnstaked(tokenAddr, msg.sender, amount);

        return true;
    }

    function getUserBalance(address tokenAddr) public view returns (uint) {
        return userStakedAmount[tokenAddr][msg.sender];
    }

    function getUserRewards(address tokenAddr) public returns (uint) {
        uint timeStaked = block.timestamp -
            (userUnstakeTime[tokenAddr][msg.sender] - endTime);
        userRewardAmount[tokenAddr][msg.sender] =
            userStakedAmount[tokenAddr][msg.sender] *
            (timeStaked / 30 days) *
            (rate / 100);
        return userRewardAmount[tokenAddr][msg.sender];
    }
}
