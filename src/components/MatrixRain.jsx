export default function MatrixRain() {
    const chars = "01アイウエオカキクケコサシスセソタチツテト";
    const columns = 64;

    return (
        <div className="matrix-rain" aria-hidden="true">
            {Array.from({ length: columns }).map((_, i) => (
                <div
                    key={i}
                    className="matrix-column"
                    style={{
                        left: `${(i / columns) * 100}%`,
                        animationDuration: `${5 + Math.random() * 7}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: 0.35 + Math.random() * 0.35,
                    }}
                >
                    {Array.from({ length: 48 })
                        .map(() => chars[Math.floor(Math.random() * chars.length)])
                        .join("\n")}
                </div>
            ))}
        </div>
    );
}