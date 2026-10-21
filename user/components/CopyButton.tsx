import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
    iconClassName?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = '', iconClassName = '' }) => {
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
        const fallbackCopy = () => {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.readOnly = true;
            textArea.style.position = 'absolute';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);

            try {
                textArea.select();
                const successful = document.execCommand('copy');
                if (successful) {
                    showSuccess();
                }
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            } finally {
                document.body.removeChild(textArea);
            }
        };

        const showSuccess = () => {
            setIsCopied(true);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        };

        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                showSuccess();
            } catch (err) {
                fallbackCopy();
            }
        } else {
            fallbackCopy();
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none ${className}`}
            aria-label={isCopied ? "Copied" : "Copy to clipboard"}
            title={isCopied ? "Copied" : "Copy to clipboard"}
        >
            {isCopied ? (
                <Check size={16} className={`text-green-500 ${iconClassName.replace(/text-\w+(-\d+)?/g, '')}`} />
            ) : (
                <Copy size={16} className={iconClassName} />
            )}
        </button>
    );
};
