import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
    iconSize?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = "", iconSize = 16 }) => {
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

        const fallbackCopy = () => {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.position = "absolute";
                textArea.style.left = "-9999px";
                textArea.readOnly = true;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                setCopiedState();
            } catch (err) {
                console.error("Fallback copy failed", err);
            }
        };

        const setCopiedState = () => {
            setIsCopied(true);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(setCopiedState).catch(fallbackCopy);
        } else {
            fallbackCopy();
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none focus-visible:ring-offset-1 focus-visible:ring-offset-[#111] ${className}`}
            aria-label={isCopied ? "Copied" : "Copy link"}
        >
            {isCopied ? <Check size={iconSize} className="text-green-400" /> : <Copy size={iconSize} className="text-white" />}
        </button>
    );
};