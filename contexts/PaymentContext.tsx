'use client';

import { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

interface PaymentContextType {
  processPayment: () => Promise<string | false>;
  isProcessing: boolean;
}

const PaymentContext = createContext<PaymentContextType>({} as PaymentContextType);

function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async () => {
    try {
      setIsProcessing(true);
      if (!window.ethereum) {
        throw new Error('请安装MetaMask钱包');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const transaction = {
        to: process.env.NEXT_PUBLIC_RECEIVER_WALLET,
        value: ethers.utils.parseEther('0.05')
      };

      const tx = await signer.sendTransaction(transaction);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('支付失败:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PaymentContext.Provider value={{ processPayment, isProcessing }}>
      {children}
    </PaymentContext.Provider>
  );
}

function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}

export { PaymentProvider, usePayment };