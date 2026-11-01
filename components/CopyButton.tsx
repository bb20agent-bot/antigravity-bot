import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
    iconClassName?: string;
    ariaLabel?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
    textToCopy,
    className = "bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none",
    iconClassName = "text-white",
    ariaLabel = "Copy to clipboard"
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

    const handleCopy = () => {
        // Fallback for clipboard
        const fallbackCopy = (text: string) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'absolute';
            textArea.style.left = '-9999px';
            textArea.readOnly = true;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                handleSuccess();
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textArea);
        };

        const handleSuccess = () => {
            setIsCopied(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy)
                .then(handleSuccess)
                .catch(() => fallbackCopy(textToCopy));
        } else {
            fallbackCopy(textToCopy);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={className}
            aria-label={isCopied ? "Copied" : ariaLabel}
            title={isCopied ? "Copied!" : ariaLabel}
        >
            {isCopied ? (
                <CheckCircle size={16} className={iconClassName.replace(/text-\w+(-\d+)?/g, '') + ' text-green-500'} />
            ) : (
                <Copy size={16} className={iconClassName} />
            )}
        </button>
    );
};
