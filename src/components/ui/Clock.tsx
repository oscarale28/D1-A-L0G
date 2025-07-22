import { useEffect, useState } from "react";

const Clock = () => {

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", {
        hour12: false
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-xs text-gray-400">
      {currentTime}
    </div>
  )
}

export default Clock