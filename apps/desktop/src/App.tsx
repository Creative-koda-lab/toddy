import { useState, useEffect } from "react";
import { TodoList } from "./components/TodoList";
import { Onboarding } from "./components/Onboarding";

const ONBOARDING_KEY = "toddy_onboarding_completed";

/**
 * Main App Component
 *
 * Manages the application state and determines whether to show
 * the onboarding screen or the main todo list interface.
 */
function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem(ONBOARDING_KEY);
    setHasCompletedOnboarding(completed === "true");
  }, []);

  /**
   * Handles the completion of onboarding process
   */
  const handleGetStarted = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setHasCompletedOnboarding(true);
  };

  if (hasCompletedOnboarding) {
    return <TodoList />;
  }

  return <Onboarding onGetStarted={handleGetStarted} />;
}

export default App;
