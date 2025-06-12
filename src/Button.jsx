import { useReward } from "partycles";

function Button({ children, className = "", onClick, disabled }) {
  const { reward } = useReward("rewardId", "confetti", {
    particleCount: 100,
    spread: 120,
    colors: ["#f22", "#fc1", "#294"],
    physics: {
      gravity: 0.5,
      wind: 0.1,
    },
  });
  const handleClick = (e) => {
    if (disabled) return; // Verhindere Klicks, wenn der Button deaktiviert ist
    reward(); // Starte Konfetti
    onClick?.(e); // Rufe optional den übergebenen onClick-Handler auf
  };

  return (
    <button
      id="rewardId"
      onClick={handleClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export default Button;
