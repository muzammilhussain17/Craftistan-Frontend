import clsx from 'clsx';
import { Bot, User } from 'lucide-react';

export function MessageBubble({ text, isBot, timestamp }) {
    return (
        <div className={clsx(
            "flex gap-3 max-w-[85%]",
            isBot ? "self-start" : "self-end flex-row-reverse"
        )}>
            {/* Avatar */}
            <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                isBot ? "bg-stone-200 text-stone-600" : "bg-ochre text-white"
            )}>
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={clsx(
                "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                isBot
                    ? "bg-white text-stone-800 rounded-tl-none border border-stone-100"
                    : "bg-ochre text-white rounded-tr-none"
            )}>
                <p>{text}</p>
                <div className={clsx(
                    "text-[10px] opacity-70 mt-1",
                    isBot ? "text-stone-400" : "text-white/80"
                )}>
                    {timestamp}
                </div>
            </div>
        </div>
    );
}
