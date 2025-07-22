
import { useSidebar } from "../../lib/providers/SidebarProvider";
import { PanelLeftClose } from "lucide-react";
import ToggleSidebar from "../layout/ToggleSidebar";
import ChatsList from "./ChatsList";

const ChatContainer = () => {
  const { isOpen } = useSidebar();
  return (
    <div data-open={isOpen} className={`chats-list 
      absolute md:relative 
      top-0 left-0 h-full w-80 
      md:w-auto md:h-auto
      bg-gradient-to-b from-[#112636] to-[#071827] md:bg-transparent
      transform transition-transform duration-700 ease-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
      flex flex-col
      z-50 md:z-auto
    `}>
      <div className="flex flex-col h-full  py-12 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col mx-4 mb-4">
          <h1 className="text-5xl font-bold text-cyan-500 font-display">D1-A-L0G</h1>
          <p className="text-sm text-gray-400">Chat with your favorite characters from the Star Wars universe.</p>
        </div>
        <ChatsList />
      </div>
      {
        isOpen && (
          <ToggleSidebar
            id="toggle-close-sidebar"
            customClasses="-right-8 top-0 z-10 block md:hidden bg-[#112636]"
            icon={<PanelLeftClose className="text-cyan-600 w-5 h-5 cursor-pointer" />}
          />
        )
      }
    </div>
  );
};

export default ChatContainer;
