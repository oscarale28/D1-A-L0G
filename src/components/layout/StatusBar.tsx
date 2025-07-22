import { Battery, Signal } from 'lucide-react'
import Clock from '../ui/Clock';

const StatusBar = () => {

  return (
    <div
      className="status-bar relative h-15 p-3 bg-cyan-950 border-cyan-900 flex items-center justify-between"
    >
      <div className="flex flex-col gap-1 items-center space-x-6">
        <div className="flex items-center gap-x-2">
          <div
            className="w-3 h-3 bg-green-400"
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          ></div>
          <span className="text-xs text-green-400 font-bold">COMMS ACTIVE</span>
        </div>
        <div className="text-xs ms-2 text-gray-400">SECTOR: S1-V4R</div>
      </div>


      <div className="flex flex-col gap-2 items-end md:flex-row md:items-center">
        <Clock />
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Signal className="w-3 h-3 text-cyan-400" />
            <div className="flex space-x-0.5">
              <div className="w-1 h-3 bg-cyan-400"></div>
              <div className="w-1 h-3 bg-cyan-400"></div>
              <div className="w-1 h-3 bg-cyan-600"></div>
              <div className="w-1 h-3 bg-gray-600"></div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Battery className="w-3 h-3 text-green-400" />
            <div
              className="w-6 h-2 bg-green-400"
              style={{
                clipPath: "polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusBar