import './globals.css';
import Header from '../components/Header'; // Assuming Header is a client component
import Footer from '../components/Footer'; // Assuming Footer is a client component
import ClientProvider from '../components/ClientProvider'; // Import the new ClientProvider component

export const metadata = {
  title: 'POSC Tutoring',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>{metadata.title}</title>
      </head>
      <body className="min-h-screen flex flex-col">
        <ClientProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
