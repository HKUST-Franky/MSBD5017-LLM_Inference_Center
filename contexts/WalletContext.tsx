'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  walletAddress: string;
  ethBalance: string;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getWalletBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [ethBalance, setEthBalance] = useState<string>('0');

  const getWalletBalance = async () => {
    if (!walletAddress || typeof window === 'undefined') return;
    
    try {
      const balance = await window.ethereum?.request({
        method: 'eth_getBalance',
        params: [walletAddress, 'latest']
      });
      if (balance) {
        const ethBalance = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
        setEthBalance(ethBalance);
      }
    } catch (error) {
      console.error('获取余额失败:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('请先安装 MetaMask!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts[0]) {
        setWalletAddress(accounts[0]);
        await getWalletBalance();
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setEthBalance('0');
  };

  // 监听账户变化
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // 用户断开了连接
        setWalletAddress('');
        setEthBalance('0');
      } else if (accounts[0] !== walletAddress) {
        // 用户切换了账户
        setWalletAddress(accounts[0]);
        getWalletBalance();
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    
    // 清理监听器
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [walletAddress]);

  // 初始化检查连接状态
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window === 'undefined' || !window.ethereum) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });
        if (accounts[0]) {
          setWalletAddress(accounts[0]);
          await getWalletBalance();
        }
      } catch (error) {
        console.error('检查连接状态失败:', error);
      }
    };

    checkConnection();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        ethBalance,
        isConnected: !!walletAddress,
        connectWallet,
        disconnectWallet,
        getWalletBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}