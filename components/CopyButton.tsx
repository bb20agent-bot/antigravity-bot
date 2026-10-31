import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
    iconClassName?: string;
}

export function CopyButton({ textToCopy, className = '', iconClassName = '' }: CopyButtonProps) {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCopy = async () => {
        let success = false;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
                success = true;
            } else {
                throw new Error("Clipboard API not available");
            }
        } catch (err) {
            // Fallback for Telegram Mini Apps / insecure contexts
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;

            // Prevent scrolling and virtual keyboard popup
            textArea.style.position = "absolute";
            textArea.style.left = "-9999px";
            textArea.setAttribute("readonly", "true");

            document.body.appendChild(textArea);
            textArea.select();

            try {
                success = document.execCommand('copy');
            } catch (fallbackErr) {
                console.error("Fallback copy failed", fallbackErr);
            }

            document.body.removeChild(textArea);
        }

        if (success) {
            // Trigger haptic feedback if available
            try {
                (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
            } catch (e) {
                // Ignore
            }

            setIsCopied(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        }
    };

    // Remove conflicting color classes for success state
    const currentIconClassName = isCopied
        ? `${iconClassName.replace(/text-\w+(-\d+)?/g, '')} text-green-500`
        : iconClassName;

    return (
        <button
            onClick={handleCopy}
            className={`focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-amber-500 ${className}`}
            aria-label={isCopied ? "Copied to clipboard" : "Copy referral link"}
        >
            {isCopied ? (
                <Check size={16} className={currentIconClassName} />
            ) : (
                <Copy size={16} className={currentIconClassName} />
            )}
        </button>
    );
}
