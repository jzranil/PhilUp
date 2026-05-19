const DEFAULT_ITEMS = [];

export default function BurgerDropdown({ items = DEFAULT_ITEMS, actions = {} }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 0.7vw)",
        left: 0,
        zIndex: 1000,
        width: "20.5vw",
        minWidth: "220px",
        backgroundColor: "#fffbf4",
        border: "0.25vw solid #1c618c",
        borderRadius: "1vw",
        padding: "clamp(14px, 1.4vw, 24px)",
        boxSizing: "border-box",
        color: "#1c618c",
        fontFamily: '"Roboto Mono", monospace',
        fontSize: "clamp(15px, 1.45vw, 24px)",
        fontWeight: 700,
        boxShadow: "0 14px 32px rgba(28, 97, 140, 0.16)",
      }}
    >
      {items.map((label) => (
        <p
          key={label}
          onClick={actions[label]}
          style={{
            cursor: "pointer",
            margin: "0 0 clamp(7px, 0.55vw, 12px)",
            lineHeight: 1.15,
            transition: "opacity .15s",
          }}
          onMouseEnter={(event) => { event.currentTarget.style.opacity = ".7"; }}
          onMouseLeave={(event) => { event.currentTarget.style.opacity = "1"; }}
        >
          {label}
        </p>
      ))}
    </div>
  );
}
