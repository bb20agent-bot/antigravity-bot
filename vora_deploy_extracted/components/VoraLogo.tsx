import React from 'react';

export const VoraLogo = ({ className = '', style = {} }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: '1em', height: '1em', ...style }}>
            <svg viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <linearGradient id="voraTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#00C9A7', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#00897B', stopOpacity: 1 }} />
                    </linearGradient>

                    <filter id="voraGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="voraCoreGlow" x="-80%" y="-80%" width="260%" height="260%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="voraDotGlow" x="-200%" y="-200%" width="500%" height="500%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background circle */}
                <circle cx="130" cy="130" r="120" fill="none" stroke="#00C9A7" strokeWidth="0.4" opacity="0.08" />

                {/* Outer orbit ring */}
                <g className="vora-orbit-outer" style={{ transformOrigin: '130px 130px', animation: 'spin-slow 18s linear infinite' }}>
                    <circle cx="130" cy="130" r="108" fill="none" stroke="#00C9A7" strokeWidth="0.8" strokeDasharray="6 14" opacity="0.2" />
                    <g className="vora-node-dot" style={{ animation: 'sparkle 2s ease-in-out infinite', animationDelay: '0s' }}>
                        <circle cx="130" cy="22" r="4.5" fill="#00C9A7" filter="url(#voraDotGlow)" opacity="0.9" />
                    </g>
                    <g className="vora-node-dot" style={{ animation: 'sparkle 2s ease-in-out infinite', animationDelay: '0.4s' }}>
                        <circle cx="223.5" cy="76" r="4.5" fill="#00C9A7" filter="url(#voraDotGlow)" opacity="0.9" />
                    </g>
                    <g className="vora-node-dot" style={{ animation: 'sparkle 2s ease-in-out infinite', animationDelay: '0.8s' }}>
                        <circle cx="223.5" cy="184" r="4.5" fill="#00C9A7" filter="url(#voraDotGlow)" opacity="0.9" />
                    </g>
                    <g className="vora-node-dot" style={{ animation: 'sparkle 2s ease-in-out infinite', animationDelay: '1.2s' }}>
                        <circle cx="130" cy="238" r="4.5" fill="#00C9A7" filter="url(#voraDotGlow)" opacity="0.9" />
                    </g>
                    <g className="vora-node-dot" style={{ animation: 'sparkle 2s ease-in-out infinite', animationDelay: '1.6s' }}>
                        <circle cx="36.5" cy="184" r="4.5" fill="#00C9A7" filter="url(#voraDotGlow)" opacity="0.9" />
                    </g>
                    <g className="vora-node-dot" style={{ animation: 'sparkle 2s ease-in-out infinite', animationDelay: '2.0s' }}>
                        <circle cx="36.5" cy="76" r="4.5" fill="#00C9A7" filter="url(#voraDotGlow)" opacity="0.9" />
                    </g>
                </g>

                {/* Middle orbit ring */}
                <g className="vora-orbit-mid" style={{ transformOrigin: '130px 130px', animation: 'spin-slow 11s linear infinite reverse' }}>
                    <path d="M 130 50 A 80 80 0 0 1 199.3 210" fill="none" stroke="url(#voraTealGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" className="vora-arc-dash" style={{ strokeDasharray: '60 400', animation: 'arc-flow 3s ease-in-out infinite' }} />
                    <path d="M 199.3 210 A 80 80 0 0 1 60.7 210" fill="none" stroke="url(#voraTealGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" className="vora-arc-dash-2" style={{ strokeDasharray: '40 400', animation: 'arc-flow 3s ease-in-out infinite 1s' }} />
                    <path d="M 60.7 210 A 80 80 0 0 1 130 50" fill="none" stroke="url(#voraTealGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" className="vora-arc-dash-3" style={{ strokeDasharray: '50 400', animation: 'arc-flow 3s ease-in-out infinite 2s' }} />
                </g>

                {/* Inner structure ring */}
                <circle cx="130" cy="130" r="62" fill="none" stroke="#00C9A7" strokeWidth="0.6" opacity="0.15" />

                {/* Spokes */}
                <line x1="130" y1="130" x2="130" y2="42" stroke="#00C9A7" strokeWidth="0.7" opacity="0.18" />
                <line x1="130" y1="130" x2="215.6" y2="80" stroke="#00C9A7" strokeWidth="0.7" opacity="0.18" />
                <line x1="130" y1="130" x2="215.6" y2="180" stroke="#00C9A7" strokeWidth="0.7" opacity="0.18" />
                <line x1="130" y1="130" x2="130" y2="218" stroke="#00C9A7" strokeWidth="0.7" opacity="0.18" />
                <line x1="130" y1="130" x2="44.4" y2="180" stroke="#00C9A7" strokeWidth="0.7" opacity="0.18" />
                <line x1="130" y1="130" x2="44.4" y2="80" stroke="#00C9A7" strokeWidth="0.7" opacity="0.18" />

                {/* Core mark */}
                <polygon points="130,82 169.4,105 169.4,151 130,174 90.6,151 90.6,105" fill="none" stroke="#00C9A7" strokeWidth="1.2" opacity="0.25" />
                <polygon points="130,82 169.4,105 169.4,151 130,174 90.6,151 90.6,105" fill="#00C9A7" opacity="0.04" />

                {/* Momentum bolt */}
                <g className="vora-core-pulse" filter="url(#voraCoreGlow)" style={{ transformOrigin: '130px 130px', animation: 'core-breathe 2.5s ease-in-out infinite' }}>
                    <polyline points="102,97 130,156 158,97" fill="none" stroke="url(#voraTealGrad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
                    <polyline points="108,97 130,147 152,97" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.22" />
                    <polyline points="122,156 130,168 138,156" fill="none" stroke="#00C9A7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                </g>

                {/* Center dot */}
                <circle cx="130" cy="130" r="3.5" fill="#FFFFFF" opacity="0.7" filter="url(#voraDotGlow)" />
                <circle cx="130" cy="130" r="1.5" fill="#00C9A7" opacity="1" />
            </svg>
            <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes arc-flow {
          0% { stroke-dashoffset: 0; opacity: 0.4; }
          50% { opacity: 1; }
          100% { stroke-dashoffset: -460; opacity: 0.4; }
        }
        @keyframes core-breathe {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.5; r: 4; }
          50% { opacity: 1; r: 6; }
        }
      `}</style>
        </div>
    );
};
