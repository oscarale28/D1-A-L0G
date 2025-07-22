import { useSidebar } from "@/lib/providers/SidebarProvider"

const Backdrop = () => {
  const { isOpen } = useSidebar()
  return (
    <div className={`absolute top-0 left-0 w-full h-full bg-black/50 z-50 ${isOpen ? 'max-md:block hidden' : 'hidden'}`}></div>
  )
}

export default Backdrop