import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
    iconSize?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
    textToCopy,
    className = "bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors",
    iconSize = 16
}) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCopy = async () => {
        if (isCopied) return;

        let success = false;

        if (window.isSecureContext && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                success = true;
            } catch (err) {
                console.error("Clipboard API failed:", err);
            }
        }

        if (!success) {
            // Fallback for Telegram Mini Apps / non-secure contexts
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "absolute";
            textArea.style.left = "-9999px";
            textArea.readOnly = true; // Prevent virtual keyboard
            document.body.appendChild(textArea);
            textArea.select();

            try {
                success = document.execCommand("copy");
            } catch (err) {
                console.error("Fallback copy failed:", err);
            } finally {
                document.body.removeChild(textArea);
            }
        }

        if (success) {
            setIsCopied(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
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
            {isCopied ? (
                <Check size={iconSize} className="text-emerald-400" />
            ) : (
                <Copy size={iconSize} className="text-white" />
            )}
        </button>
    );
};