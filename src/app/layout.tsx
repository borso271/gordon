"use client";
import '../styles/globals.css'; // Import global styles
// import TopNavBar from '../components/TopNavbar';
import Footer from '../components/Footer';

import {ReduxProvider} from './redux/provider.js'

import I18nProvider from '../components/I18nProvider';
import { ScreenSizeProvider } from './context/screenSizeContext';

import ClientWrapper from './clientWrapper'
import NavBar from '../components/Layout/Navbar';

type RootLayoutProps = React.PropsWithChildren<{}>;



function RootLayout({ children }: RootLayoutProps) {
  // useStockWebSocket(); // ✅ Start WebSocket connection when app loads
  return (
    <html lang="en">
      
      <body>
      <ClientWrapper>
       <I18nProvider> 
       <ScreenSizeProvider>
       <NavBar></NavBar>
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