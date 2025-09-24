import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useEnsureUser() {
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data?.user;
      if (user) {
        const { data: existing } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();
        if (!existing) {
          await supabase.from('users').insert([{ id: user.id, email: user.email }]);
        }
      }
    });
  }, []);
}