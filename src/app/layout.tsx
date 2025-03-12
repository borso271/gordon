"use client";
import '../styles/globals.css'; // Import global styles
// import TopNavBar from '../components/TopNavbar';
import Footer from '../components/Footer';

import I18nProvider from '../components/I18nProvider';
import { ScreenSizeProvider } from './context/screenSizeContext';

import ClientWrapper from './clientWrapper'
import NavBar from '../components/Layout/Navbar';

type RootLayoutProps = React.PropsWithChildren<unknown>;

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          <I18nProvider> 
            <ScreenSizeProvider>
              <NavBar />
              <main>{children}</main> {/* Page-specific content */}
              <Footer /> {/* Footer appears on all pages */}
            </ScreenSizeProvider>
          </I18nProvider> 
        </ClientWrapper>
      </body>
    </html>
  );
}

export default RootLayout;
