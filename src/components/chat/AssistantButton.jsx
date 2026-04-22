import { MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export function AssistantButton({ onClick, isOpen }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={onClick}
            aria-label={isOpen ? "Close Chat" : "Open Chat"}
            className={clsx(
                "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-soft-lg flex items-center justify-center transition-colors duration-300",
                isOpen
                    ? "bg-stone-200 text-stone-600 rotate-90"
                    : "bg-ochre text-white hover:bg-ochre-dark"
            )}
        >
            <MessageCircle className={clsx("w-7 h-7 transition-all", isOpen && "rotate-[-90deg]")} />

            {/* Pulse effect when closed */}
            {!isOpen && (
                <span className="absolute inset-0 rounded-full bg-ochre/30 animate-ping pointer-events-none"></span>
            )}
        </motion.button>
    );
}
