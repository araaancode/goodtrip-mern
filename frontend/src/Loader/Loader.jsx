import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <motion.img
        src="../logo.svg" // replace with your house logo path
        alt="در حال بارگزاری..."
        className="w-20 h-20"
        animate={{
          y: [0, 30, 0], // only vertical movement
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default Loader;
