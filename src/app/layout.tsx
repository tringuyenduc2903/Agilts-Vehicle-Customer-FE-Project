import { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { I18nProvider } from '@/lib/i18n/i18n';
import dynamic from 'next/dynamic';
import getCSRFCookie from '@/api/CrsfCookie';
import './globals.css';
import StoreProvider from '@/context/StoreProvider';
import { ModalProvider } from '@/context/ModalProvider';
const DynamicHeader = dynamic(
  () => import('@/components/common/Header/Header'),
  { ssr: false }
);
const DynamicScrollToTop = dynamic(
  () => import('@/components/common/Button/ScrollToTop'),
  { ssr: false }
);
const DynamicFooter = dynamic(
  () => import('@/components/common/Footer/Footer'),
  { ssr: false }
);
const DynamicModal = dynamic(() => import('@/components/modal/Modal'));
const inter = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export async function generateMetadata(): Promise<Metadata> {
  const csrfToken = await getCSRFCookie();
  return {
    title: 'Create Next App',
    description: 'Generated by create next app',
    other: {
      'csrf-token': csrfToken as string,
    },
  };
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} flex flex-col justify-between`}>
        <StoreProvider>
          <I18nProvider>
            <ModalProvider>
              <DynamicHeader />
              {children}
              <DynamicScrollToTop />
              <DynamicFooter />
              <DynamicModal />
            </ModalProvider>
          </I18nProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
