import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCopy = async () => {
        if (isCopied) return;

        const fallbackCopyTextToClipboard = (text: string) => {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.readOnly = true;
            textArea.style.position = "absolute";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            document.body.removeChild(textArea);
        };

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                fallbackCopyTextToClipboard(textToCopy);
            }
        } catch (err) {
            fallbackCopyTextToClipboard(textToCopy);
        }

        setIsCopied(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <button
            onClick={handleCopy}
            aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
            className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none"
        >
            {isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-white" />}
        </button>
    );
};
