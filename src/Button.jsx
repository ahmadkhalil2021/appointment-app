import { useReward } from "partycles";

function Button({ children, className = "" }) {
  const { reward } = useReward("rewardId", "confetti", {
    particleCount: 100,
    spread: 120,
    colors: ["#f22", "#fc1", "#294"],
    physics: {
      gravity: 0.5,
      wind: 0.1,
    },
  });

  return (
    <button id="rewardId" onClick={reward} className={className}>
      {children}
    </button>
  );
}
export default Button;
