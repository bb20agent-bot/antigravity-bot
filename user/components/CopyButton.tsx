import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
    iconSize?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = "bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors focus-visible:ring-2", iconSize = 16 }) => {
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
        const copyFallback = () => {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "absolute";
            textArea.style.left = "-9999px";
            textArea.readOnly = true;
            document.body.appendChild(textArea);
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
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        };

        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(setCopiedState).catch(() => {
                copyFallback();
            });
        } else {
            copyFallback();
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={className}
            aria-label={isCopied ? "Copied" : "Copy to clipboard"}
        >
            {isCopied ? (
                <CheckCircle size={iconSize} className="text-green-400" />
            ) : (
                <Copy size={iconSize} className="text-white" />
            )}
        </button>
    );
};
