import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Contract ABI - Include only the functions we need
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_platform", "type": "address"},
      {"internalType": "address", "name": "_creator", "type": "address"},
      {"internalType": "uint256", "name": "_platformShare", "type": "uint256"},
      {"internalType": "uint256", "name": "_creatorShare", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "from", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "PaymentReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "platformAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "creatorAmount", "type": "uint256"}
    ],
    "name": "RevenueDistributed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Withdrawn",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "balances",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "checkBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "company",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "creator",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "creatorShare",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractInfo",
    "outputs": [
      {"internalType": "address", "name": "_company", "type": "address"},
      {"internalType": "address", "name": "_platform", "type": "address"},
      {"internalType": "address", "name": "_creator", "type": "address"},
      {"internalType": "uint256", "name": "_platformShare", "type": "uint256"},
      {"internalType": "uint256", "name": "_creatorShare", "type": "uint256"},
      {"internalType": "uint256", "name": "_contractBalance", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platform",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformShare",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Default contract address (will be updated from deployment-info.json)
const DEFAULT_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [contractInfo, setContractInfo] = useState(null);
  const [balances, setBalances] = useState({});
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    initializeEthereum();
  }, []);

  const initializeEthereum = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const web3Signer = await web3Provider.getSigner();
        setSigner(web3Signer);
        
        const address = await web3Signer.getAddress();
        setAccount(address);
        
        // Initialize contract
        const contractInstance = new ethers.Contract(
          DEFAULT_CONTRACT_ADDRESS,
          CONTRACT_ABI,
          web3Signer
        );
        setContract(contractInstance);
        
        await loadContractInfo(contractInstance);
      } catch (error) {
        setError('Failed to connect to MetaMask: ' + error.message);
      }
    } else {
      setError('MetaMask is not installed. Please install MetaMask to use this application.');
    }
  };

  const loadContractInfo = async (contractInstance) => {
    try {
      const info = await contractInstance.getContractInfo();
      const contractInfo = {
        company: info[0],
        platform: info[1],
        creator: info[2],
        platformShare: info[3].toString(),
        creatorShare: info[4].toString(),
        contractBalance: ethers.formatEther(info[5])
      };
      setContractInfo(contractInfo);
      
      // Load balances
      const platformBalance = await contractInstance.checkBalance(info[1]);
      const creatorBalance = await contractInstance.checkBalance(info[2]);
      
      setBalances({
        platform: ethers.formatEther(platformBalance),
        creator: ethers.formatEther(creatorBalance)
      });
    } catch (error) {
      setError('Failed to load contract info: ' + error.message);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || !contract) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const amount = ethers.parseEther(depositAmount);
      const tx = await contract.deposit({ value: amount });
      
      setSuccess('Transaction submitted! Hash: ' + tx.hash);
      
      await tx.wait();
      
      setSuccess('Deposit successful! Funds have been automatically split.');
      setDepositAmount('');
      
      // Refresh contract info
      await loadContractInfo(contract);
    } catch (error) {
      setError('Deposit failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!contract) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const tx = await contract.withdraw();
      
      setSuccess('Withdrawal transaction submitted! Hash: ' + tx.hash);
      
      await tx.wait();
      
      setSuccess('Withdrawal successful!');
      
      // Refresh contract info
      await loadContractInfo(contract);
    } catch (error) {
      setError('Withdrawal failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = () => {
    if (!contractInfo || !account) return 'Unknown';
    
    if (account.toLowerCase() === contractInfo.company.toLowerCase()) return 'Company';
    if (account.toLowerCase() === contractInfo.platform.toLowerCase()) return 'Platform';
    if (account.toLowerCase() === contractInfo.creator.toLowerCase()) return 'Creator';
    return 'Observer';
  };

  const canDeposit = () => {
    return getUserRole() === 'Company';
  };

  const canWithdraw = () => {
    const role = getUserRole();
    return role === 'Platform' || role === 'Creator';
  };

  if (!provider) {
    return (
      <div className="app">
        <div className="container">
          <h1>🔗 Blockchain Ad Revenue Sharing</h1>
          <div className="error">
            Please install MetaMask and connect your wallet to continue.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>🔗 Blockchain Ad Revenue Sharing</h1>
          <div className="account-info">
            <div className="account">Connected: {account.slice(0, 6)}...{account.slice(-4)}</div>
            <div className="role">Role: {getUserRole()}</div>
          </div>
        </header>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {contractInfo && (
          <div className="contract-info">
            <h2>📋 Contract Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Contract Address:</label>
                <span>{DEFAULT_CONTRACT_ADDRESS}</span>
              </div>
              <div className="info-item">
                <label>Company:</label>
                <span>{contractInfo.company.slice(0, 6)}...{contractInfo.company.slice(-4)}</span>
              </div>
              <div className="info-item">
                <label>Platform:</label>
                <span>{contractInfo.platform.slice(0, 6)}...{contractInfo.platform.slice(-4)}</span>
              </div>
              <div className="info-item">
                <label>Creator:</label>
                <span>{contractInfo.creator.slice(0, 6)}...{contractInfo.creator.slice(-4)}</span>
              </div>
              <div className="info-item">
                <label>Platform Share:</label>
                <span>{contractInfo.platformShare}%</span>
              </div>
              <div className="info-item">
                <label>Creator Share:</label>
                <span>{contractInfo.creatorShare}%</span>
              </div>
              <div className="info-item">
                <label>Contract Balance:</label>
                <span>{contractInfo.contractBalance} ETH</span>
              </div>
            </div>
          </div>
        )}

        <div className="balances">
          <h2>💰 Current Balances</h2>
          <div className="balance-grid">
            <div className="balance-item">
              <label>Platform Balance:</label>
              <span>{balances.platform || '0'} ETH</span>
            </div>
            <div className="balance-item">
              <label>Creator Balance:</label>
              <span>{balances.creator || '0'} ETH</span>
            </div>
          </div>
        </div>

        {canDeposit() && (
          <div className="action-section">
            <h2>💸 Deposit Funds (Company Only)</h2>
            <form onSubmit={handleDeposit}>
              <div className="input-group">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount in ETH"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !depositAmount}>
                  {loading ? 'Processing...' : 'Deposit'}
                </button>
              </div>
            </form>
            <p className="helper-text">
              Funds will be automatically split: {contractInfo?.platformShare}% to Platform, {contractInfo?.creatorShare}% to Creator
            </p>
          </div>
        )}

        {canWithdraw() && (
          <div className="action-section">
            <h2>🏦 Withdraw Funds</h2>
            <button onClick={handleWithdraw} disabled={loading} className="withdraw-btn">
              {loading ? 'Processing...' : 'Withdraw Available Balance'}
            </button>
            <p className="helper-text">
              You can withdraw your available balance at any time.
            </p>
          </div>
        )}

        {!canDeposit() && !canWithdraw() && (
          <div className="observer-section">
            <h2>👁️ Observer Mode</h2>
            <p>You can view the contract information and balances, but cannot perform transactions.</p>
            <p>Connect with the Company account to deposit funds, or Platform/Creator accounts to withdraw.</p>
          </div>
        )}

        <footer>
          <p>🚀 Transparent, Automatic, Blockchain-Powered Revenue Sharing</p>
        </footer>
      </div>
    </div>
  );
}

export default App;