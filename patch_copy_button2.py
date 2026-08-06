with open('user/UserApp.tsx', 'r') as f:
    content = f.read()

copy_button_code = """
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = React.useState(false);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const fallbackCopy = (str: string) => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    const handleCopy = () => {
        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
            }).catch(() => {
                fallbackCopy(text);
                setCopied(true);
            });
        } else {
            fallbackCopy(text);
            setCopied(true);
        }

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors focus-visible:ring-2"
        >
            {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} className="text-white" />}
        </button>
    );
};
"""

content = content.replace(
    """const NavItem: React.FC<{ icon: React.ReactNode; active: boolean; onClick: () => void }> = ({ icon, active, onClick }) => (""",
    copy_button_code + "\n\n" + """const NavItem: React.FC<{ icon: React.ReactNode; active: boolean; onClick: () => void }> = ({ icon, active, onClick }) => ("""
)

# Search for the specific button and replace it
search_block = """                                <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors">
                                    <Copy size={16} className="text-white" />
                                </button>"""

replace_block = """                                <CopyButton text={`t.me/Vora_Brown_bot?start=${(window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id || 'TESTUSER'}`} />"""

content = content.replace(search_block, replace_block)

with open('user/UserApp.tsx', 'w') as f:
    f.write(content)
