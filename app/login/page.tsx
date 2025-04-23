import { AuthForm } from '@/components/AuthForm';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <AuthForm type="login" />
      </main>
      <Footer />
    </div>
  );
}