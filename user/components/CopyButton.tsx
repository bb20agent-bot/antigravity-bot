import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const CopyButton: React.FC<{ textToCopy: string; ariaLabel?: string }> = ({ textToCopy, ariaLabel = "Copy to clipboard" }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        // Fallback for Telegram Mini Apps / unsupported environments
        const fallbackCopyTextToClipboard = (text: string) => {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "absolute";
            textArea.style.left = "-9999px";
            textArea.readOnly = true;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
            } catch (err) {
                console.error("Fallback copy failed", err);
            }
            document.body.removeChild(textArea);
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).catch((err) => {
                console.warn("Clipboard API failed, using fallback", err);
                fallbackCopyTextToClipboard(textToCopy);
            });
        } else {
            fallbackCopyTextToClipboard(textToCopy);
        }

        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            aria-label={isCopied ? "Copied" : ariaLabel}
            className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none"
        >
            {isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-white" />}
        </button>
    );
};
