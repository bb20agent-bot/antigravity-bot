import React, { useState, useEffect, useRef } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleCopy = () => {
        const fallbackCopy = () => {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.readOnly = true;
            textArea.style.position = 'absolute';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setIsCopied(true);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textArea);
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setIsCopied(true);
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
                })
                .catch(() => fallbackCopy());
        } else {
            fallbackCopy();
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={className || "bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors"}
            aria-label={isCopied ? "Copied" : "Copy to clipboard"}
        >
            {isCopied ? (
                <CheckCircle size={16} className="text-green-500" />
            ) : (
                <Copy size={16} className="text-white" />
            )}
        </button>
    );
};
