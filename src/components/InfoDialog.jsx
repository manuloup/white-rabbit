export default function InfoDialog({ cellData, onClose }) {
    if (!cellData) return null;

    const variant =
        cellData.type === "bonus" ? "dialog dialog-bonus" : "dialog dialog-info";

    return (
        <div className="modal-overlay">
            <div className={variant}>
                <div className="dialog-titlebar">
                    <span className="dialog-title">
                        {cellData.type === "bonus" ? "RED PILL" : "INFO"}
                    </span>
                    <button className="dialog-x" onClick={onClose}>X</button>
                </div>

                <div className="dialog-body">
                    <div className="dialog-meta">{cellData.title}</div>

                    <div className="dialog-question">
                        <span className="cursor-block" />
                        <span>{cellData.content}</span>
                    </div>

                    {cellData.type === "bonus" && (
                        <div className="pill-bonus">+{cellData.points} POINTS</div>
                    )}

                    <div className="dialog-actions" style={{ marginTop: 18 }}>
                        <span className="intro-link" onClick={onClose} role="button" tabIndex={0}>
                            CONTINUE
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}