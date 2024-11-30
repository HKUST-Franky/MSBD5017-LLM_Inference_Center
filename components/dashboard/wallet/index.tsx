'use client';
/*eslint-disable*/

import MessageBoxChat from '@/components/MessageBoxChat';
import DashboardLayout from '@/components/layout';
import TransactionHistory from './component/TransactionHistory';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { useTheme } from 'next-themes';
import { HiExclamationCircle } from 'react-icons/hi2';
import { useWallet } from '@/contexts/WalletContext';
import { useEffect, useState } from 'react';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

export default function WalletPage(props: Props) {
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  
  const { 
    walletAddress, 
    ethBalance, 
    isConnected,
    connectWallet, 
    disconnectWallet,
    getWalletBalance 
  } = useWallet();

  // 客户端检查
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 如果不是客户端，返回加载状态
  if (!isClient) {
    return (
      <DashboardLayout
        user={props.user}
        userDetails={props.userDetails}
        title="My Wallet"
        description="Wallet Management"
      >
        <div className="container mx-auto p-4">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="My Wallet"
      description="Wallet Management"
    >
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">
          {props.user ? `${props.user.email}'s Wallet` : 'My Wallet'}
        </h1>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="crypto-wallet" className="border rounded-lg">
            <AccordionTrigger className="px-4">Crypto Wallet</AccordionTrigger>
            <AccordionContent>
              <div className="p-4">
                {typeof window !== 'undefined' && !window.ethereum?.isMetaMask ? (
                  <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-4 rounded-lg">
                    <HiExclamationCircle className="h-5 w-5 flex-shrink-0" />
                    <p>Please install MetaMask first</p>
                    <a 
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline ml-2"
                    >
                      Download MetaMask
                    </a>
                  </div>
                ) : isConnected ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-lg font-medium mb-2">Connected Wallet Address:</p>
                      <p className="font-mono text-sm break-all bg-white dark:bg-gray-800 p-2 rounded">
                        {walletAddress}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-lg font-medium mb-2">ETH Balance:</p>
                      <p className="text-2xl font-bold">{ethBalance} ETH</p>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => getWalletBalance()}
                        className="flex-1"
                      >
                        Refresh Balance
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={disconnectWallet}
                        className="flex-1"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-lg mb-4">Connect your crypto wallet to enable crypto features</p>
                      <Button 
                        onClick={connectWallet}
                        className="w-full"
                      >
                        Connect MetaMask
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="balance" className="border rounded-lg">
            <AccordionTrigger className="px-4">Platform Balance</AccordionTrigger>
            <AccordionContent>
              <div className="p-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-lg mb-2">
                    Current Balance: ${props.userDetails?.balance || '0.00'}
                  </p>
                  {props.user ? (
                    <Button className="w-full">Top Up</Button>
                  ) : (
                    <p className="text-sm text-gray-500">Please login to view balance</p>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="transactions" className="border rounded-lg">
            <AccordionTrigger className="px-4">Transaction History</AccordionTrigger>
            <AccordionContent>
              <div className="p-4">
                {isConnected ? (
                  <TransactionHistory />
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-500">Please connect your wallet to view transactions</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8">
          <MessageBoxChat 
            title="Need Help?"
            content="If you have any questions about using the wallet, please contact our support team."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}