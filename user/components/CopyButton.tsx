import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
    ariaLabel?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
    textToCopy,
    className = "bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors",
    ariaLabel = "Copy link"
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        const fallbackCopy = () => {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "absolute";
            textArea.style.left = "-9999px";
            textArea.readOnly = true;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setIsCopied(true);
            } catch (err) {
                console.error("Fallback copy failed", err);
            }
            document.body.removeChild(textArea);
        };

        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => setIsCopied(true))
                .catch(() => fallbackCopy());
        } else {
            fallbackCopy();
        }

        if ((window as any).Telegram?.WebApp?.HapticFeedback) {
            (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }

        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={className}
            aria-label={isCopied ? "Copied to clipboard" : ariaLabel}
        >
            {isCopied ? <CheckCircle size={16} className="text-emerald-400" /> : <Copy size={16} className="text-white" />}
        </button>
    );
};
