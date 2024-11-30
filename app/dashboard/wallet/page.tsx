import Settings from '@/components/dashboard/settings';
import { createClient } from '@/utils/supabase/server';
import { getUser, getUserDetails } from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';
import Wallet from '@/components/dashboard/wallet';

export default async function WalletPage() {
    const supabase = createClient();
    const [user, userDetails] = await Promise.all([
      getUser(supabase),
      getUserDetails(supabase)
    ]);

    if (!user) {
      return redirect('/dashboard/signin');
    }
  
    return <Wallet user={user} userDetails={userDetails} />;
  }