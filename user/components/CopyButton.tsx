import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
    iconClassName?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = '', iconClassName = '' }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCopy = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const fallbackCopy = () => {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.readOnly = true;
            textArea.style.position = 'absolute';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopiedState();
            } catch (err) {
                console.error('Fallback copy failed', err);
            } finally {
                document.body.removeChild(textArea);
            }
        };

        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setCopiedState();
                })
                .catch(() => {
                    fallbackCopy();
                });
        } else {
            fallbackCopy();
        }
    };

    const setCopiedState = () => {
        setIsCopied(true);
        timeoutRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    const activeIconClassName = isCopied
        ? `${iconClassName.replace(/text-\w+(-\d+)?/g, '')} text-green-500`.trim()
        : iconClassName;

    return (
        <button
            className={`focus-visible:ring-2 focus-visible:ring-white/50 focus:outline-none ${className}`}
            onClick={handleCopy}
            aria-label={isCopied ? "Copied" : "Copy link"}
        >
            {isCopied ? <Check size={16} className={activeIconClassName} /> : <Copy size={16} className={activeIconClassName} />}
        </button>
    );
};
