import { motion } from "framer-motion";

interface CursorProps {
  name: string;
  color: string;
  position: { x: number; y: number };
}

export function Cursor({ name, color, position }: CursorProps) {
  return (
    <motion.div
      className="pointer-events-none absolute z-50"
      style={{
        left: 0,
        top: 0,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: position.x,
        y: position.y,
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 500,
        mass: 0.5,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
      >
        <path
          d="M5.65376 12.456H5.46026L5.31717 12.5765L2.16171 15.1385L7.05023 2.2852L19.8545 14.458L6.20728 11.5L5.65376 12.456Z"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
        />
      </svg>
      <div
        className="absolute left-4 top-4 rounded-full px-2 py-1 text-xs text-white whitespace-nowrap"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </motion.div>
  );
}
