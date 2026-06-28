import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

export const CopyButton = ({ textToCopy, className = "" }: { textToCopy: string, className?: string }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleCopy = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        const fallbackCopy = () => {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "absolute";
            textArea.style.left = "-9999px";
            textArea.readOnly = true;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
            } catch (err) {
                console.error("Fallback copy failed", err);
            }
            document.body.removeChild(textArea);
        };

        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).catch(() => {
                fallbackCopy();
            });
        } else {
            fallbackCopy();
        }

        setIsCopied(true);
        timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors ${className}`}
            aria-label={isCopied ? "Copied" : "Copy to clipboard"}
        >
            {isCopied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} className="text-white" />}
        </button>
    );
};
