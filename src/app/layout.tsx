"use client";
import '../styles/globals.css'; // Import global styles
import I18nProvider from '../components/I18nProvider';
import { ScreenSizeProvider } from './context/screenSizeContext';
import { ConversationProvider } from './context/conversationContext';
import { FunctionExecutionProvider } from './context/functionExecutionContext';
import ClientWrapper from './clientWrapper'
import NavBar from '../components/Layout/Navbar';
import {useState} from 'react'
import MainNavSidebar from '../components/MainNavSidebar';
import styles from './Layout.module.css'
import { BuySellModalProvider } from './context/buySellModalContext';
import BuySellModalPortal from '../components/BuySell/BuySellModalPortal';
import OverlayRenderer from '../components/OverlayRenderer';
import { OverlayProvider } from './context/overlayContext';
import NavigationSidebar from '../components/NavigationSidebar';
import { ChatNavigationSidebarProvider } from './context/chatNavigationContext';
// _app.tsx or wherever you define providers
import { SpeakingProvider } from './context/speakingContext';



type RootLayoutProps = React.PropsWithChildren<unknown>;
function RootLayout({ children }: RootLayoutProps) {

  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          <I18nProvider>
            <ScreenSizeProvider>
              <ConversationProvider forceNewSession={true}>
              <SpeakingProvider>
                <FunctionExecutionProvider>
                <BuySellModalProvider>
                <OverlayProvider>
                <ChatNavigationSidebarProvider>
               {children}
               </ChatNavigationSidebarProvider>
        <BuySellModalPortal /> {/* always rendered */}
    <OverlayRenderer />
    </OverlayProvider>
    </BuySellModalProvider>
                </FunctionExecutionProvider>
                </SpeakingProvider>
              </ConversationProvider>
            </ScreenSizeProvider>
          </I18nProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}

export default RootLayout;







// return (
//   <html lang="en">
//     <body>
//       <ClientWrapper>
//         <I18nProvider>
//           <ScreenSizeProvider>
//             <ConversationProvider forceNewSession={true}>
//               <FunctionExecutionProvider>
//               <OverlayProvider>
//               <BuySellModalProvider>

//               <div className={styles.layout}>

//         <MainNavSidebar onToggle={setSidebarExpanded} />
//         <div className={styles.rightPanel}>
//           <div className={styles.pageContent}>{children}</div>
//         </div>

//       </div>

//       <BuySellModalPortal /> {/* always rendered */}
//   </BuySellModalProvider>
//   <OverlayRenderer />
//   </OverlayProvider>
                
//               </FunctionExecutionProvider>
//             </ConversationProvider>
//           </ScreenSizeProvider>
//         </I18nProvider>
//       </ClientWrapper>
//     </body>
//   </html>
// );