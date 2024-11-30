'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface Transaction {
  baseFee: string;
  from: string;
  gasLimit: string;
  gasUsed: string;
  hash: string;
  nonce: number;
  status: 'Confirmed' | 'Failed';
  timestamp: string;
  to: string;
  value: string;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const walletAddress = process.env.NEXT_PUBLIC_RECEIVER_WALLET;
        const latestBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(0, latestBlock - 1000);

        const blocks = await Promise.all(
          Array.from({ length: latestBlock - fromBlock }, (_, i) => 
            provider.getBlockWithTransactions(fromBlock + i)
          )
        );

        const relevantTxs = blocks.flatMap(block => 
          block.transactions.filter(tx => 
            tx.to?.toLowerCase() === walletAddress?.toLowerCase() || 
            tx.from?.toLowerCase() === walletAddress?.toLowerCase()
          )
        );

        const formattedTransactions = await Promise.all(
          relevantTxs.map(async (tx, index) => {
            const receipt = await provider.getTransactionReceipt(tx.hash);
            return {
              baseFee: receipt.effectiveGasPrice.toString(),
              from: tx.from,
              gasLimit: tx.gasLimit.toString(),
              gasUsed: receipt.gasUsed.toString(),
              hash: tx.hash,
              nonce: index,
              status: receipt.status === 1 ? 'Confirmed' : 'Failed',
              timestamp: new Date(blocks.find(b => b.hash === tx.blockHash)?.timestamp! * 1000).toISOString(),
              to: tx.to!,
              value: tx.value.toString()
            };
          })
        );

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error('获取交易历史失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="space-y-4">
      {transactions.map((tx, index) => (
        <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-mono text-xs break-all">{tx.hash}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-block px-2 py-1 text-xs rounded ${
                tx.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {tx.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="font-mono text-xs break-all">{tx.from}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">To</p>
              <p className="font-mono text-xs break-all">{tx.to}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Value</p>
              <p className="font-medium">{ethers.utils.formatEther(tx.value)} ETH</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="text-sm">{new Date(tx.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      )}
      {!isLoading && transactions.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No transactions found
        </div>
      )}
    </div>
  );
}
