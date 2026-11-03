import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
    iconClassName?: string;
    iconSize?: number;
    'aria-label'?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
    textToCopy,
    className = '',
    iconClassName = '',
    iconSize = 16,
    'aria-label': ariaLabel = 'Copy to clipboard'
}) => {
    const [isCopied, setIsCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleCopy = async () => {
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
            try {
                await navigator.clipboard.writeText(textToCopy);
            } catch (err) {
                fallbackCopyTextToClipboard(textToCopy);
            }
        } else {
            fallbackCopyTextToClipboard(textToCopy);
        }

        setIsCopied(true);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    const cleanIconClassName = isCopied
        ? iconClassName.replace(/text-\w+(-\d+)?/g, '') + ' text-green-500'
        : iconClassName;

    return (
        <button
            onClick={handleCopy}
            className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111] focus-visible:ring-[#0088cc] ${className}`}
            aria-label={isCopied ? 'Copied' : ariaLabel}
        >
            {isCopied ? (
                <CheckCircle size={iconSize} className={cleanIconClassName} />
            ) : (
                <Copy size={iconSize} className={cleanIconClassName} />
            )}
        </button>
    );
};
