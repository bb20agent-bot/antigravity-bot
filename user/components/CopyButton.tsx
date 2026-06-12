import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

export default function CopyButton({ textToCopy, className = "" }: { textToCopy: string, className?: string }) {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleCopy = () => {
        const copyToClipboardFallback = (text: string) => {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "absolute";
            textArea.style.left = "-999999px";
            textArea.readOnly = true;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
            } catch (err) {
                console.error("Fallback: Oops, unable to copy", err);
            }
            document.body.removeChild(textArea);
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showSuccess();
            }).catch(err => {
                console.error("Async: Could not copy text: ", err);
                copyToClipboardFallback(textToCopy);
                showSuccess();
            });
        } else {
            copyToClipboardFallback(textToCopy);
            showSuccess();
        }
    };

    const showSuccess = () => {
        setIsCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
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
}
