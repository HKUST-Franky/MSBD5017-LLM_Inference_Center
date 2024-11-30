import SupabaseProvider from './supabase-provider';
import { PropsWithChildren } from 'react';
import '@/styles/globals.css';
import { ThemeProvider } from './theme-provider';
import { WalletProvider } from '@/contexts/WalletContext';
import { PaymentProvider } from '@/contexts/PaymentContext';

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children
}: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <title>
          LLM Inference Platform
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <!--  Social tags   --> */}
        <meta
          name="keywords"
          content="LLM, AI, Inference, Platform, Machine Learning, Decentralized, Model Deployment, AI Infrastructure"
        />
        <meta name="description" content="Add here your website description" />
        {/* <!-- Schema.org markup for Google+ --> */}
        <meta itemProp="name" content="Add here your website name / title" />
        <meta
          itemProp="description"
          content="Add here your website description"
        />
        <meta
          itemProp="image"
          content="Add here the link for your website SEO image"
        />
        {/* <!-- Twitter Card data --> */}
        <meta name="twitter:card" content="product" />
        <meta
          name="twitter:title"
          content="Add here your website name / title"
        />
        <meta
          name="twitter:description"
          content="Add here your website description"
        />
        <meta
          name="twitter:image"
          content="Add here the link for your website SEO image"
        />
        {/* <!-- Open Graph data --> */}
        <meta
          property="og:title"
          content="Add here your website name / title"
        />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://your-website.com" />
        <meta
          property="og:image"
          content="Add here the link for your website SEO image"
        />
        <meta
          property="og:description"
          content="Add here your website description"
        />
        <meta
          property="og:site_name"
          content="Add here your website name / title"
        />
        <link rel="canonical" href="https://your-website.com" />
        <link rel="icon" href="/img/website_icon.jpg" />
      </head>
      <body id={'root'} className="loading bg-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseProvider>
            <WalletProvider>
              <PaymentProvider>
                <main id="skip">{children}</main>
              </PaymentProvider>
            </WalletProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
