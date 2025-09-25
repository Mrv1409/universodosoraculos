import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
  } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { auth, db } from '../lib/firebase';
  import { Usuario } from '@/types';
  
  export async function cadastrarUsuario(email: string, password: string, nome: string, telefone?: string) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(user, { displayName: nome });
      
      const userData: Usuario = {
        uid: user.uid,
        nome,
        email,
        telefone,
        creditos: 0,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      };
      
      await setDoc(doc(db, 'usuarios', user.uid), userData);
      return userData;//eslint-disable-next-line
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
  export async function entrarUsuario(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;//eslint-disable-next-line
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
  export async function sairUsuario() {
    try {
      await signOut(auth);//eslint-disable-next-line
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
  export async function buscarDadosUsuario(user: User): Promise<Usuario | null> {
    try {
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          criadoEm: data.criadoEm.toDate(),
          atualizadoEm: data.atualizadoEm.toDate()
        } as Usuario;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }