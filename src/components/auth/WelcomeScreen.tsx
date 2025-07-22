
import { signInAnonymously } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { motion } from "framer-motion";

const WelcomeScreen = () => {
  const handleSignIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-4 h-screen bg-gray-900 text-white crt-container"
    >
      <h1 className="text-8xl font-bold text-cyan-500 font-display">D1-A-L0G</h1>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSignIn}
        className="welcome-button cursor-pointer px-8 py-4 bg-transparent border-2 border-cyan-900 hover:bg-gradient-to-r from-cyan-600 to-cyan-900 text-lg font-semibold"
      >
        Welcome
      </motion.button>
    </motion.div>
  );
};

export default WelcomeScreen;
