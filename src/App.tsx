import { useEffect, useState } from 'react';
import type { User } from './lib/supabase';
import { getSupabaseClient } from './lib/supabase';
import { LoginView } from './components/LoginView';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setLoading(false);
      return;
    }
    client.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500 animate-pulse" />
          <p className="text-sm font-bold text-slate-500 mt-4">Loading ManzilIQ…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return <AdminDashboard user={user} onSignOut={handleSignOut} />;
}
