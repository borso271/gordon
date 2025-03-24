"use client";
import '../styles/globals.css'; // Import global styles
import I18nProvider from '../components/I18nProvider';
import { ScreenSizeProvider } from './context/screenSizeContext';
import { ConversationProvider } from './context/conversationContext';
import { FunctionExecutionProvider } from './context/functionExecutionContext';
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
            <ConversationProvider>
            <FunctionExecutionProvider>
              <NavBar/>
              <main>{children}</main> {/* Page-specific content */}
              </FunctionExecutionProvider>
              </ConversationProvider>
            </ScreenSizeProvider>
          </I18nProvider> 
        </ClientWrapper>
      </body>
    </html>
  );
}

export default RootLayout;

