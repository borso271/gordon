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
type RootLayoutProps = React.PropsWithChildren<unknown>;


function RootLayout({ children }: RootLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          <I18nProvider>
            <ScreenSizeProvider>
              <ConversationProvider forceNewSession={true}>
                <FunctionExecutionProvider>
                 

                <div className={styles.layout}>
          <MainNavSidebar onToggle={setSidebarExpanded} />

          <div className={styles.rightPanel}>
            <NavBar />
            <div className={styles.pageContent}>{children}</div>
          </div>
        </div>
                  
                </FunctionExecutionProvider>
              </ConversationProvider>
            </ScreenSizeProvider>
          </I18nProvider>
        </ClientWrapper>
      </body>
    </html>
  );

  // return (
  
  //   <html lang="en">
  //     <body>
  //       <ClientWrapper>
  //         <I18nProvider> 
  //           <ScreenSizeProvider>
  //           {/* <ConversationProvider> */}
  //           <ConversationProvider forceNewSession={true}>

  //           <FunctionExecutionProvider>
  //             <NavBar/>
  //             <main>{children}</main> {/* Page-specific content */}
  //             </FunctionExecutionProvider>
  //             </ConversationProvider>
  //           </ScreenSizeProvider>
  //         </I18nProvider> 
  //       </ClientWrapper>
  //     </body>
  //   </html>
  // );
}

export default RootLayout;

