import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = "" }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleCopy = async () => {
        const fallbackCopy = () => {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.readOnly = true;
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();

            try {
                document.execCommand('copy');
                setIsCopied(true);
            } catch (err) {
                console.error('Fallback copy failed:', err);
            } finally {
                document.body.removeChild(textarea);
            }
        };

        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => setIsCopied(true))
                .catch(() => fallbackCopy());
        } else {
            fallbackCopy();
        }

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 focus:outline-none ${className}`}
            aria-label={isCopied ? "Copied to clipboard" : "Copy referral link"}
        >
            {isCopied ? <CheckCircle size={16} className="text-emerald-400" /> : <Copy size={16} className="text-white" />}
        </button>
    );
};
