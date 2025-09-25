'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { buscarDadosUsuario } from '@/hooks/auth';
import { Usuario } from '@/types';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função que "escuta" mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        // Usuário está logado - busca dados do Firestore
        setUser(firebaseUser);
        const dadosUsuario = await buscarDadosUsuario(firebaseUser);
        setUserData(dadosUsuario);
      } else {
        // Usuário não está logado - limpa tudo
        setUser(null);
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Cleanup: para de "escutar" quando componente é desmontado
    return () => unsubscribe();
  }, []);

  return {
    user,        // Dados básicos do Firebase Auth
    userData,    // Dados completos do Firestore (créditos, nome, etc)
    loading      // True enquanto está carregando
  };
}