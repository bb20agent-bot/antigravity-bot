import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = '' }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const fallbackCopyTextToClipboard = (text: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "-9999px";
        textArea.style.position = "fixed";
        textArea.readOnly = true;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            handleSuccess();
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    };

    const handleCopy = () => {
        if (!navigator.clipboard || !window.isSecureContext) {
            fallbackCopyTextToClipboard(textToCopy);
            return;
        }
        navigator.clipboard.writeText(textToCopy).then(() => {
            handleSuccess();
        }).catch(err => {
            console.error('Async: Could not copy text: ', err);
            fallbackCopyTextToClipboard(textToCopy);
        });
    };

    const handleSuccess = () => {
        setIsCopied(true);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);

        // Trigger haptic feedback if available in Telegram WebApp
        try {
            if ((window as any).Telegram?.WebApp?.HapticFeedback) {
                (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
        } catch (e) {
            // Ignore error
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={className}
            aria-label={isCopied ? "Copied to clipboard" : "Copy to clipboard"}
            title={isCopied ? "Copied!" : "Copy"}
        >
            {isCopied ? (
                <Check size={16} className="text-green-500" />
            ) : (
                <Copy size={16} className="text-white" />
            )}
        </button>
    );
};
