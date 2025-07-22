import StatusBar from './components/layout/StatusBar';
import ChatContainer from './components/chat-container/ChatContainer';
import { SidebarProvider } from './lib/providers/SidebarProvider';
import Backdrop from './components/layout/Backdrop';
import ChatsList from './components/chats-list/ChatsListContainer';
import { useAuth } from './lib/providers/AuthProvider';
import WelcomeScreen from './components/auth/WelcomeScreen';
import { CharacterProvider } from './lib/providers/CharacterProvider';
import ProgressBar from './components/ui/ProgressBar';
import { ChatListProvider } from './lib/providers/ChatListProvider';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <ProgressBar />;
  }

  if (!user) {
    return <WelcomeScreen />;
  }

  return (
    <SidebarProvider>
      <CharacterProvider>
        <ChatListProvider>
          <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800 crt-container">
            <Backdrop />
            <StatusBar />
            <main className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_2fr] overflow-hidden">
              <ChatsList />
              <ChatContainer />
            </main>
          </div>
        </ChatListProvider>
      </CharacterProvider>
    </SidebarProvider>
  );
}

export default App;

