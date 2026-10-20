import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    ariaLabel?: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
    textToCopy,
    ariaLabel = "Copy to clipboard",
    className = "bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors"
}) => {
    const [isCopied, setIsCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleCopy = async () => {
        let success = false;
        if (window.isSecureContext && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                success = true;
            } catch (err) {
                // Fallback to execCommand will happen below
            }
        }

        if (!success) {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.readOnly = true;
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                success = true;
            } catch (err) {
                console.error('Fallback copy failed', err);
            } finally {
                document.body.removeChild(textarea);
            }
        }

        if (success) {
            setIsCopied(true);
            try {
                (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
            } catch (e) {}
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            aria-label={isCopied ? "Copied" : ariaLabel}
            className={`focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none ${className}`}
        >
            {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-white" />}
        </button>
    );
};
