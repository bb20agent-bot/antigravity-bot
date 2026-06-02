import React, { useState, useRef } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = "bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors" }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleCopy = async () => {
        if (isCopied) return;

        let success = false;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
                success = true;
            } else {
                throw new Error("Clipboard API not available");
            }
        } catch (err) {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.readOnly = true;
                textArea.style.position = "absolute";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.select();
                success = document.execCommand("copy");
                document.body.removeChild(textArea);
            } catch (fallbackErr) {
                console.error("Fallback copy failed", fallbackErr);
            }
        }

        if (success) {
            setIsCopied(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={className}
            aria-label={isCopied ? "Copied to clipboard" : "Copy to clipboard"}
        >
            {isCopied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} className="text-white" />}
        </button>
    );
};
