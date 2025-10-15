/**
 * Sidebar Character Component
 *
 * Displays a friendly character illustration in the sidebar
 * to add personality to the application interface.
 */

export function SidebarCharacter() {
  return (
    <div className="mt-12">
      <svg
        width="200"
        height="240"
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto"
      >
        {/* Head */}
        <circle cx="100" cy="70" r="40" fill="#f0f0f0" stroke="#333" strokeWidth="3" />

        {/* Eyes */}
        <line x1="85" y1="65" x2="85" y2="70" stroke="#333" strokeWidth="3" />
        <line x1="115" y1="65" x2="115" y2="70" stroke="#333" strokeWidth="3" />

        {/* Smile */}
        <path d="M 80 85 Q 100 95 120 85" stroke="#333" strokeWidth="3" fill="none" />

        {/* Hair - long straight */}
        <path d="M 65 50 L 65 20 L 75 20 L 75 50" stroke="#333" strokeWidth="3" fill="none" />
        <path d="M 125 50 L 125 20 L 135 20 L 135 50" stroke="#333" strokeWidth="3" fill="none" />
        <line x1="70" y1="30" x2="70" y2="50" stroke="#333" strokeWidth="2" />
        <line x1="130" y1="30" x2="130" y2="50" stroke="#333" strokeWidth="2" />

        {/* Body */}
        <rect x="70" y="110" width="60" height="80" rx="10" fill="#dde5ff" stroke="#333" strokeWidth="3" />

        {/* Arms */}
        <line x1="65" y1="130" x2="45" y2="150" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        <line x1="135" y1="130" x2="155" y2="150" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
