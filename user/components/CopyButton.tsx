import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = "" }) => {
    const [isCopied, setIsCopied] = useState(false);

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
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            document.body.removeChild(textArea);
        };

        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).catch(() => {
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
            className={`bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors ${className}`}
            aria-label={isCopied ? "Copied" : "Copy to clipboard"}
        >
            {isCopied ? (
                <Check size={16} className="text-green-500" />
            ) : (
                <Copy size={16} className="text-white" />
            )}
        </button>
    );
};
