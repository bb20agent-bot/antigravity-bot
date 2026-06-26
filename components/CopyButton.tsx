import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = "bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors" }) => {
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
        const fallbackCopy = () => {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                // Prevent keyboard from popping up on mobile
                textArea.readOnly = true;
                // Move element out of screen to avoid scrolling
                textArea.style.position = 'absolute';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                handleSuccess();
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
        };

        const handleSuccess = () => {
            setIsCopied(true);

            // Provide haptic feedback if available (Telegram Mini App)
            if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
                try {
                    (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
                } catch (e) {
                    // Ignore haptic feedback errors
                }
            }

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    handleSuccess();
                })
                .catch(() => {
                    // Fallback if clipboard API fails
                    fallbackCopy();
                });
        } else {
            // Fallback if clipboard API is not available (e.g. some webviews)
            fallbackCopy();
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={className}
            aria-label={isCopied ? "Copied to clipboard" : "Copy to clipboard"}
            title="Copy to clipboard"
        >
            {isCopied ? (
                <CheckCircle size={16} className="text-green-500" />
            ) : (
                <Copy size={16} className="text-white" />
            )}
        </button>
    );
};
