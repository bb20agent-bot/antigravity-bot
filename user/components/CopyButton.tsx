import React, { useState, useEffect, useRef } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
}

export function CopyButton({ textToCopy, className = "" }: CopyButtonProps) {
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
            }
            document.body.removeChild(textArea);
        };

        const setCopiedState = () => {
            setIsCopied(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        };

        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(setCopiedState)
                .catch(() => fallbackCopy());
        } else {
            fallbackCopy();
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`focus-visible:ring-2 focus-visible:outline-none ${className}`}
            aria-label={isCopied ? "Copied to clipboard" : "Copy link to clipboard"}
        >
            {isCopied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} className="text-white" />}
        </button>
    );
}
