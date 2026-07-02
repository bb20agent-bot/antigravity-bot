import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

export function CopyButton({ textToCopy, className = "" }: { textToCopy: string, className?: string }) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    const handleCopy = () => {
        const fallback = () => {
            const ta = document.createElement("textarea");
            ta.value = textToCopy;
            ta.readOnly = true;
            ta.style.position = 'absolute';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(ta);
        };

        if (window.isSecureContext && navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => showSuccess())
                .catch(() => { fallback(); showSuccess(); });
        } else {
            fallback();
            showSuccess();
        }
    };

    const showSuccess = () => {
        setCopied(true);
        try { (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred('light'); } catch (e) {}
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={className}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
        >
            {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} className="text-white" />}
        </button>
    );
}
