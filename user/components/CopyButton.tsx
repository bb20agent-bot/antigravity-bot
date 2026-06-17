import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = '' }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleCopy = async () => {
        try {
            if (window.isSecureContext && navigator.clipboard) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                throw new Error('Clipboard API not available');
            }
        } catch (err) {
            // Fallback for Telegram Mini Apps and insecure contexts
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "absolute";
            textArea.style.left = "-9999px";
            textArea.readOnly = true;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand("copy");
            } catch (fallbackErr) {
                console.error("Fallback copy failed", fallbackErr);
                // Even if it fails, we shouldn't crash, but we won't show success.
                document.body.removeChild(textArea);
                return;
            }
            document.body.removeChild(textArea);
        }

        setIsCopied(true);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <button
            onClick={handleCopy}
            className={`transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${className}`}
            aria-label={isCopied ? "Copied to clipboard" : "Copy Fandom Link"}
            title={isCopied ? "Copied!" : "Copy"}
        >
            {isCopied ? (
                <CheckCircle size={16} className="text-green-400" />
            ) : (
                <Copy size={16} className="text-white" />
            )}
        </button>
    );
};
