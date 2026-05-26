export const Icons = {
    Plus: ({ className }: { className?: string }) => (
      <svg className={className} width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    Search: ({ className }: { className?: string }) => (
      <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    MessageSquare: ({ className }: { className?: string }) => (
      <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M2 2.5A1.5 1.5 0 013.5 1h7A1.5 1.5 0 0112 2.5v6A1.5 1.5 0 0110.5 10H7.5L5 12.5V10H3.5A1.5 1.5 0 012 8.5v-6z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
    Send: ({ className }: { className?: string }) => (
      <svg className={className} width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M13 7.5L1.5 2l2.5 5.5-2.5 5.5L13 7.5z" fill="currentColor" />
      </svg>
    ),
    PanelLeft: ({ className }: { className?: string }) => (
      <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5.5 1v14" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
    Bot: ({ className }: { className?: string }) => (
      <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="7" width="16" height="11" rx="3" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="7" cy="12.5" r="1.5" fill="currentColor" />
        <circle cx="13" cy="12.5" r="1.5" fill="currentColor" />
        <path d="M10 3v4M7.5 3h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    Sparkles: ({ className }: { className?: string }) => (
      <svg className={className} width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2l1.8 5.5H17l-4.3 3.1 1.6 5L10 13l-4.3 2.6 1.6-5L3 7.5h5.2L10 2z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
    Trash: ({ className }: { className?: string }) => (
      <svg className={className} width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M1.5 3.5h10M4.5 3.5V2h4v1.5M5.5 6v4M7.5 6v4M2.5 3.5l.7 7.5h6.6l.7-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };