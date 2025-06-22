import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
export default function HomePage() {
  const router = useRouter();
  useEffect(() => { router.push('/desk'); }, [router]);
  return ( <Head><title>Carregando...</title></Head> );
}