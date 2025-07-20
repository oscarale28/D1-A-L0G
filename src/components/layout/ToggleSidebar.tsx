import { useSidebar } from "@/lib/providers/SidebarProvider"

type ToggleSidebarProps = {
  id: string
  customClasses: string,
  icon: React.ReactNode
}

const ToggleSidebar = ({ id, customClasses, icon }: ToggleSidebarProps) => {

  const { toggleSidebar } = useSidebar()

  return (
    <button id={id} className={`toggle-sidebar absolute w-8 h-16 ps-1 ${customClasses}`} onClick={toggleSidebar} >
      {icon}
    </button>
  )
}

export default ToggleSidebar