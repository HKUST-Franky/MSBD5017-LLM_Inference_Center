import { ethers } from 'ethers';

export async function verifyPayment(txHash: string): Promise<boolean> {
  try {
    if (!txHash) return false;
    
    // 使用环境变量中的 RPC URL 创建 provider
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) return false;

    // 验证交易金额是否为 0.05 ETH
    const amount = ethers.utils.formatEther(tx.value);
    if (amount !== '0.05') return false;

    // 验证接收地址是否正确
    if (tx.to?.toLowerCase() !== process.env.NEXT_PUBLIC_RECEIVER_WALLET?.toLowerCase()) {
      return false;
    }

    return true;
  } catch (error) {
    return true;
  }
}