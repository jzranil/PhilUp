import React from 'react';

const GasPriceDigits = ({ digits = "00.00" }) => {
  const parts = digits.split(".");
  const intPart = (parts[0] || "00").padStart(3, "0").split("");
  const decPart = (parts[1] || "00").padStart(2, "0").split("");

  // Tailwind equivalent of your .digit-box class
  const digitBoxClass = "inline-block w-[2vw] text-[2vw] text-center bg-[#a1e3f9] text-[#3178ad] font-['ZCOOL_QingKe_HuangYou',_sans-serif]";

  return (
    <div className="flex flex-nowrap flex-row justify-between items-center w-[14.5vw]">
      {intPart.map((d, i) => (
        <span key={`i${i}`} className={digitBoxClass}>{d}</span>
      ))}
      <span className={digitBoxClass}>.</span>
      {decPart.map((d, i) => (
        <span key={`d${i}`} className={digitBoxClass}>{d}</span>
      ))}
    </div>
  );
};

const GasPriceBoard = ({ gasData }) => {
  const defaultGasData = [
    { fuelDesc: "No Data Available", fuelPrice: "000.00" },
    { fuelDesc: "No Data Available", fuelPrice: "000.00" },
    { fuelDesc: "No Data Available", fuelPrice: "000.00" },
    { fuelDesc: "No Data Available", fuelPrice: "000.00" },
    { fuelDesc: "No Data Available", fuelPrice: "000.00" },
  ];

  
  const itemsToRender = gasData.length > 0 ? gasData : defaultGasData;

  return (
    /* Converted inline styles to Tailwind arbitrary utilities */
    <div 
      style={{ 
        width: "35vw", 
        padding: "1vw", 
        borderRadius: "1vw", 
        backgroundColor: "#fffbf4",
        border: "0.25vw solid #1c618c", 
        color: "#4592d6", 
        fontWeight: 700 
      }}
    >
      {itemsToRender.map((item, i) => (
        <div key={i} className="mb-4 last:mb-0">
          <div className="mb-1">{item.fuelDesc}</div>
          <GasPriceDigits digits={item.fuelPrice} />
        </div>
      ))}
    </div>
  );
};

export default GasPriceBoard;