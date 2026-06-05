import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = '' }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        // Fallback for document.execCommand('copy') as requested by memory
        const copyFallback = () => {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.readOnly = true;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                setIsCopied(true);
            } catch (err) {
                console.error('Fallback copy failed', err);
            } finally {
                document.body.removeChild(textarea);
            }
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setIsCopied(true);
            }).catch((err) => {
                console.error('Clipboard write failed, using fallback', err);
                copyFallback();
            });
        } else {
            copyFallback();
        }

        // Provide haptic feedback if available
        try {
            if ((window as any).Telegram?.WebApp?.HapticFeedback) {
                (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
        } catch (e) {
            // ignore haptic error
        }

        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <button
            className={`bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors ${className}`}
            onClick={handleCopy}
            aria-label={isCopied ? "Copied" : "Copy to clipboard"}
        >
            {isCopied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} className="text-white" />}
        </button>
    );
};
