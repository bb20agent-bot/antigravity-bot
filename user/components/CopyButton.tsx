import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        const copyText = async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    throw new Error('Clipboard API not available');
                }
            } catch (err) {
                // Fallback mechanism
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.readOnly = true; // Prevent virtual keyboard
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                } catch (fallbackErr) {
                    console.error('Fallback copy failed', fallbackErr);
                } finally {
                    document.body.removeChild(textarea);
                }
            }

            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        };

        copyText();
    };

    return (
        <button
            onClick={handleCopy}
            aria-label={isCopied ? "Copied" : "Copy to clipboard"}
            className={className || "bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors"}
        >
            {isCopied ? (
                <Check size={16} className="text-green-500" />
            ) : (
                <Copy size={16} className="text-white" />
            )}
        </button>
    );
};
