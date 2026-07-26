import React, { useState, useEffect, useRef } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    text: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, className }) => {
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
        if (isCopied) return;

        const fallbackCopyTextToClipboard = (textToCopy: string) => {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;

            textArea.style.top = '0';
            textArea.style.left = '-9999px';
            textArea.style.position = 'absolute';
            textArea.readOnly = true;

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                setCopiedState();
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }

            document.body.removeChild(textArea);
        };

        const setCopiedState = () => {
            setIsCopied(true);
            timerRef.current = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        };

        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedState();
            }).catch(() => {
                fallbackCopyTextToClipboard(text);
            });
        } else {
            fallbackCopyTextToClipboard(text);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={className || "bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors focus-visible:ring-2"}
            aria-label={isCopied ? "Copied" : "Copy referral link to clipboard"}
        >
            {isCopied ? (
                <CheckCircle size={16} className="text-green-500" />
            ) : (
                <Copy size={16} className="text-white" />
            )}
        </button>
    );
};
