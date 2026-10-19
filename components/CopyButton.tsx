import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    ariaLabel?: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, ariaLabel = "Copy to clipboard", className = "" }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleCopy = () => {
        const fallbackCopyTextToClipboard = (text: string) => {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.readOnly = true;
            textArea.style.position = 'absolute';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showFeedback();
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            document.body.removeChild(textArea);
        };

        const showFeedback = () => {
            setIsCopied(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setIsCopied(false), 2000);
        };

        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(showFeedback)
                .catch(() => fallbackCopyTextToClipboard(textToCopy));
        } else {
            fallbackCopyTextToClipboard(textToCopy);
        }
    };

    return (
        <button
            onClick={handleCopy}
            aria-label={isCopied ? "Copied!" : ariaLabel}
            className={`focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${className}`}
        >
            {isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-white" />}
        </button>
    );
};
