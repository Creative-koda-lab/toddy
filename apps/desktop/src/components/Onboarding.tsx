/**
 * Onboarding Component
 *
 * Displays a welcome screen for first-time users with the app branding
 * and a call-to-action button to begin using the application.
 */

interface OnboardingProps {
  onGetStarted: () => void;
}

/**
 * Simple character illustration component used in the onboarding screen
 */
interface CharacterProps {
  bodyColor: string;
  hairType: "long" | "short" | "wavy";
}

function Character({ bodyColor, hairType }: CharacterProps) {
  return (
    <div className="flex flex-col items-center">
      <svg
        width="60"
        height="80"
        viewBox="0 0 80 100"
        className="mb-2 md:w-20 md:h-24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <circle cx="40" cy="30" r="20" fill="#f0f0f0" stroke="#333" strokeWidth="2" />

        {/* Eyes */}
        <line x1="30" y1="25" x2="30" y2="30" stroke="#333" strokeWidth="2" />
        <line x1="50" y1="25" x2="50" y2="30" stroke="#333" strokeWidth="2" />

        {/* Smile */}
        <path
          d={hairType === "wavy" ? "M 30 38 Q 40 40 50 38" : "M 30 38 Q 40 42 50 38"}
          stroke="#333"
          strokeWidth="2"
          fill="none"
        />

        {/* Hair variations */}
        {hairType === "long" && (
          <path d="M 25 20 L 25 10 L 55 10 L 55 20" stroke="#333" strokeWidth="2" fill="none" />
        )}
        {hairType === "short" && (
          <path d="M 35 15 Q 40 12 45 15" stroke="#333" strokeWidth="2" fill="none" />
        )}
        {hairType === "wavy" && (
          <>
            <path d="M 20 25 Q 18 20 20 15" stroke="#333" strokeWidth="2" fill="none" />
            <path d="M 60 25 Q 62 20 60 15" stroke="#333" strokeWidth="2" fill="none" />
            <line x1="35" y1="12" x2="35" y2="8" stroke="#333" strokeWidth="2" />
            <line x1="45" y1="12" x2="45" y2="8" stroke="#333" strokeWidth="2" />
          </>
        )}

        {/* Body */}
        <rect x="25" y="50" width="30" height="35" rx="5" fill={bodyColor} stroke="#333" strokeWidth="2" />
      </svg>
    </div>
  );
}

/**
 * Onboarding screen displayed to first-time users
 */
export function Onboarding({ onGetStarted }: OnboardingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-6xl md:text-8xl font-bold tracking-wider">
          <span className="text-blue-300">t</span>
          <span className="text-red-300">o</span>
          <span className="text-green-300">d</span>
          <span className="text-purple-300">d</span>
          <span className="text-blue-400">y</span>
        </h1>
      </div>

      {/* Description */}
      <p className="text-center text-gray-600 max-w-md mb-8 leading-relaxed text-base md:text-lg px-4">
        Your simple and beautiful task manager.
        <br />
        Organize your day, categorize your tasks, and get things done.
      </p>

      {/* Get Started Button */}
      <button
        onClick={onGetStarted}
        className="px-8 md:px-12 py-3 md:py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-base md:text-lg font-medium transition-colors shadow-lg mb-12 md:mb-16"
      >
        Get Started
      </button>

      {/* Illustration with Characters */}
      <div className="flex items-end gap-4 md:gap-8 mb-8">
        <Character bodyColor="#dde5ff" hairType="long" />
        <Character bodyColor="#ffe5f0" hairType="short" />
        <Character bodyColor="#e5d5ff" hairType="wavy" />
      </div>
    </div>
  );
}
