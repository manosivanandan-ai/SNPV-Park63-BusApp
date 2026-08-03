import confetti from "canvas-confetti";

export function fireConfetti() {
  const colors = ["#a58ef8", "#55bdf7", "#52d495", "#ff9d57"];
  confetti({
    particleCount: 100,
    spread: 75,
    origin: { y: 0.6 },
    colors,
    ticks: 200,
    scalar: 0.9,
  });
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 60,
    origin: { x: 0, y: 0.7 },
    colors,
  });
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 60,
    origin: { x: 1, y: 0.7 },
    colors,
  });
}
