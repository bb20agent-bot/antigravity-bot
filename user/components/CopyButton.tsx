import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    ariaLabel?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, ariaLabel = "Copy to clipboard" }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCopy = () => {
        const fallbackCopy = () => {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.readOnly = true;
            textArea.style.position = "absolute";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showCopiedFeedback();
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textArea);
        };

        const showCopiedFeedback = () => {
            setIsCopied(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy)
                .then(showCopiedFeedback)
                .catch(() => fallbackCopy());
        } else {
            fallbackCopy();
        }
    };

    return (
        <button
            onClick={handleCopy}
            aria-label={isCopied ? "Copied" : ariaLabel}
            className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors flex-shrink-0"
        >
            {isCopied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} className="text-white" />}
        </button>
    );
};
