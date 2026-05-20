import { useEffect, useState } from "react";
import philUpLogo from "../assets/Phil Up 2.png";
import nozzleGas from "../assets/NOZZLE GAS.png";

export default function LoadingScreen() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <style>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #1c618c 0%, #4592d6 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
        }

        .loading-logo-container {
          position: relative;
          margin-bottom: 3vw;
          animation: float 3s ease-in-out infinite;
        }

        .loading-logo {
          width: clamp(120px, 20vw, 280px);
          height: clamp(120px, 20vw, 280px);
          filter: drop-shadow(0 8px 24px rgba(255, 251, 244, 0.3));
        }

        .loading-nozzle {
          position: absolute;
          width: clamp(80px, 12vw, 180px);
          height: auto;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-15deg);
          animation: pump 1.5s ease-in-out infinite;
        }

        .loading-text {
          font-family: "Roboto Mono", monospace;
          font-size: clamp(18px, 2.5vw, 36px);
          font-weight: 700;
          color: #fffbf4;
          margin-top: 2vw;
          letter-spacing: 0.1em;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .loading-dots {
          display: inline-block;
          width: 3ch;
          text-align: left;
        }

        .loading-bar-container {
          width: clamp(200px, 40vw, 500px);
          height: clamp(6px, 0.8vw, 12px);
          background-color: rgba(255, 251, 244, 0.2);
          border-radius: 100px;
          overflow: hidden;
          margin-top: 2vw;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .loading-bar {
          height: 100%;
          background: linear-gradient(90deg, #fffbf4 0%, #a1e3f9 50%, #fffbf4 100%);
          background-size: 200% 100%;
          border-radius: 100px;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .loading-subtext {
          font-family: "Roboto Mono", monospace;
          font-size: clamp(12px, 1.2vw, 16px);
          color: #a1e3f9;
          margin-top: 1.5vw;
          opacity: 0.9;
        }

        .loading-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 30vh;
          background: linear-gradient(180deg, transparent, rgba(161, 227, 249, 0.1));
          animation: wave 8s linear infinite;
        }

        .loading-wave:nth-child(2) {
          animation-delay: -4s;
          opacity: 0.5;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pump {
          0%, 100% {
            transform: translate(-50%, -50%) rotate(-15deg) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) rotate(-15deg) scale(1.1);
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

        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* Animated Background Waves */}
      <div className="loading-wave" />
      <div className="loading-wave" />

      {/* Logo with Nozzle */}
      <div className="loading-logo-container">
        <img src={philUpLogo} alt="Phil Up" className="loading-logo" />
        <img src={nozzleGas} alt="Loading" className="loading-nozzle" />
      </div>

      {/* Loading Text */}
      <div className="loading-text">
        Finding the best prices<span className="loading-dots">{dots}</span>
      </div>

      {/* Progress Bar */}
      <div className="loading-bar-container">
        <div className="loading-bar" />
      </div>

      {/* Subtext */}
      <div className="loading-subtext">
        Please wait while we locate stations near you
      </div>
    </div>
  );
}