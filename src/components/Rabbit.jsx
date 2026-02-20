// Rabbit.css n'est plus importé ici — les styles sont dans App.css
// pour éviter tout conflit de stacking context

export default function Rabbit({ position }) {
    return (
        <div
            style={{
                position: "absolute",
                left: `${position.x - 32}px`,
                top: `${position.y - 52}px`,
                zIndex: 20,
                pointerEvents: "none",
                // PAS de mixBlendMode ici — c'est lui qui faisait passer le lapin sous les cases
            }}
        >
            <img
                src="/src/assets/rabbit.png"
                alt="White Rabbit"
                style={{
                    width: "64px",
                    height: "auto",
                    opacity: 0.97,
                    filter:
                        "grayscale(1) brightness(2.2) contrast(1.05) drop-shadow(0 0 8px rgba(255,255,255,0.55)) drop-shadow(0 0 22px rgba(232,255,244,0.28))",
                    animation: "rabbitBreath 2.8s ease-in-out infinite",
                }}
            />
        </div>
    );
}
