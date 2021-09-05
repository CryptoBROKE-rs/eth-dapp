pragma solidity 0.7.6;
pragma abicoder v2;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@eth-optimism/contracts/iOVM/bridge/tokens/iOVM_L1StandardBridge.sol";
import "synthetix/contracts/interfaces/ISynthetix.sol";
import "synthetix/contracts/interfaces/IAddressResolver.sol";

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import {UniswapV2Library} from "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";

// SPDX-License-Identifier: MIT

contract Campaign {
    
    using SafeMath for uint;
    using SafeERC20 for IERC20;
    
    uint256 constant MAX_UINT = 2 ** 256 - 1;
    
    uint public id;
    string public name;
    uint public currFund;
    uint public goal;
    address payable public owner;
    bool public finished = false;
    string public description;
    string[] public mails;
    uint public mailCount;
    address public wantToken;
    uint public endTimeStamp;
    mapping(address => bool) donators;
    //SimpleNFT public nfts;
    string public URI;
    address public wantTokenL2;
    IAddressResolver public synthetixResolver=IAddressResolver(0x7a6f9eDDC03Db81927eA4131919343f93CA9b6a7);
    address public SNX=0x0064A673267696049938AA47595dD0B3C2e705A1;
    address public v3factory=0x1F98431c8aD98523631AE4a59f267346ea31F984;
    address public v3router=0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address public WETH=0x4200000000000000000000000000000000000006;
    mapping(address => bool) private routerApprovedTokens;
    address public L2;
    address public L1StandardBridge = 0x22F24361D548e5FaAfb36d1437839f080363982B;
    uint24 public constant poolFee = 3000;

    constructor(uint _id, string memory _name, uint _goal, string memory _description, uint _endTimeStamp, address _wantToken, string memory _uri, address payable _beneficiary){
        id = _id;
        name = _name;
        currFund = 0;
        goal = _goal;
        description = _description;
        owner = _beneficiary;
        endTimeStamp = _endTimeStamp;
        wantToken = _wantToken;
        URI = _uri;
    }
    event GoalReached(uint totalFund, uint goal, uint campaignId, string name, string[] mails);
    event Donated(uint amount, uint campaignId, string name, string mail, address donorToken);
    
    function donateTokens(string memory _mail, address _donorToken, uint256 _finalDonationAmount) private {
        IERC20(_donorToken).transferFrom(
                msg.sender,
                address(this),
                _finalDonationAmount
            );
            
        currFund += _finalDonationAmount;
        mails.push(_mail);
        mailCount++;

        if (currFund == goal) {
            emit GoalReached(currFund, goal, id, name, mails);
            finished = true;
            withdraw();
        }
            
        emit Donated(msg.value, id, name, _mail, _donorToken);
        if (donators[msg.sender] == false){
                //nfts.createSimpleNFT(_uri);
            donators[msg.sender] = true;
        }
        return;
    }
    function donate(string memory _mail, address _donorToken, uint256 _amountIn) public payable returns(bool sufficient) {
        require(IERC20(_donorToken).balanceOf(msg.sender) >= _amountIn, "Campaign::donate: Insuficient funds");
        require(endTimeStamp > block.timestamp, "Campaign::donate: This campaign has already finished");
        require(_donorToken != address(0), "SupportChildren::donate: donorToken == 0x, use donateETH instead");
        
        uint256 _finalDonationAmount = 0;

        if (wantToken == _donorToken) {
            _finalDonationAmount = getMaxDonationAmount(_amountIn);
            donateTokens(_mail, _donorToken, _finalDonationAmount);
            return true;
        }else{
        
        require(
             IUniswapV3Factory(v3factory).getPool(_donorToken, wantToken, poolFee) != address(0),
             "SupportChildren::donate: No direct pool exists"
        );

        address[] memory path = new address[](2);
        path[0] = _donorToken;
        path[1] = wantToken;
        uint256 _amountInWantTokens;
        uint256 _maxDonationAmountInWantTokens;

        IERC20(_donorToken).transferFrom(
            msg.sender,
            address(this),
            _amountIn
        );

        if (routerApprovedTokens[_donorToken] != true) {
            IERC20(_donorToken).approve(address(v3router), MAX_UINT);
            routerApprovedTokens[_donorToken] = true;
        }

        uint256 _swapReturnValues;

            ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: path[0],
                tokenOut: path[1],
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
            _swapReturnValues = ISwapRouter(v3router).exactInputSingle(params);
        //     // if (L2 != address(0)){
        //     //     iOVM_L1StandardBridge(L1StandardBridge).depositERC20To(wantToken, wantTokenL2, L2, IERC20(_donorToken).balanceOf(address(this)), 2000000, "0x");
        //     // }
        
        _finalDonationAmount = getMaxDonationAmount(_swapReturnValues);
        uint256 _refund = _swapReturnValues - _finalDonationAmount;
        require(_refund == 0, "Support children donate:: Hard Cap Reached");
        if(_finalDonationAmount < _swapReturnValues){
            IERC20(wantToken).transfer(
            msg.sender,
            _refund
        );
        }
        currFund += _finalDonationAmount;
            mails.push(_mail);
            mailCount++;
        
        if (currFund == goal) {
            emit GoalReached(currFund, goal, id, name, mails);
            finished = true;
            withdraw();
        }
        
        emit Donated(msg.value, id, name, _mail, _donorToken);
        if (donators[msg.sender] == false){
            //nfts.createSimpleNFT(_uri);
            donators[msg.sender] = true;
        }
        return true;
        }
    }
    
    function expiredWithdraw() public {
        require(endTimeStamp < block.timestamp, "Campaign::expiredWithdraw: This campaign is still active");
        require(msg.sender == owner, "campaign::expiredWithdraw: Only the beneficiary can withdraw the funds");
        uint256 balance = IERC20(0x4200000000000000000000000000000000000006).balanceOf(address(this));
        owner.transfer(balance);
    }

    function withdraw() private returns(bool sufficient) {
        uint256 balance = IERC20(0x4200000000000000000000000000000000000006).balanceOf(address(this));
        owner.transfer(balance);
        return true;
        }
        
    function changeEndDate(uint _endTimeStamp) public {
        endTimeStamp = _endTimeStamp;
    }

    function getMaxDonationAmount(uint256 _amountIn) internal view returns (uint256 maxDonationAmount) {
        uint256 _maxPossibleDonation = goal - currFund;
        if (_amountIn <= _maxPossibleDonation) {
            return _amountIn;
        }
        return _maxPossibleDonation;
    }
     

    

    function synthetixIssue() external {
        require(msg.sender == owner);
        if (routerApprovedTokens[wantToken] != true) {
            IERC20(wantToken).approve(address(v3router), MAX_UINT);
            routerApprovedTokens[wantToken] = true;
        }
        if(wantToken != SNX){
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: wantToken,
                tokenOut: SNX,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: currFund,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
            uint256 _swapReturnValues = ISwapRouter(v3router).exactInputSingle(params);
        }
        address synthetix =synthetixResolver.getAddress("Synthetix");
        require(synthetix != address(0), "Synthetix is missing from Synthetix resolver");
    
        // Issue for msg.sender = address(MyContract)
        ISynthetix(synthetix).issueMaxSynths();
    }
    function synthetixBurn() external {
        require(msg.sender == owner);
        address synthetix = synthetixResolver.getAddress("Synthetix");
        require(synthetix != address(0), "Synthetix is missing from Synthetix resolver");

        uint debt = ISynthetix(synthetix).debtBalanceOf(address(this), "sUSD");

        // Burn for msg.sender = address(MyContract)
        ISynthetix(synthetix).burnSynths(debt);

        if (routerApprovedTokens[SNX] != true) {
            IERC20(SNX).approve(address(v3router), MAX_UINT);
            routerApprovedTokens[SNX] = true;
        }
        if(wantToken != SNX){
            uint256 amount = IERC20(SNX).balanceOf(address(this));

            ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: SNX,
                tokenOut: wantToken,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        uint256 _swapReturnValues = ISwapRouter(v3router).exactInputSingle(params);
        }
        currFund = IERC20(wantToken).balanceOf(address(this));
    }
}