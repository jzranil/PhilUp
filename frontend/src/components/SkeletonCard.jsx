export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <style>{`
        .skeleton-card {
          display: flex;
          align-items: center;
          gap: clamp(12px, 1.2vw, 18px);
          padding: clamp(10px, 1vw, 14px) 0;
          border-bottom: 1px solid #1c618c18;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-logo {
          width: clamp(48px, 5vw, 72px);
          height: clamp(48px, 5vw, 72px);
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          border-radius: 8px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skeleton-line {
          height: 12px;
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-line:first-child {
          width: 80%;
        }

        .skeleton-line:last-child {
          width: 60%;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>

      <div className="skeleton-logo" />
      <div className="skeleton-text">
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
    </div>
  );
}