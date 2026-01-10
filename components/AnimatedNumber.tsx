
import React, { useEffect, useState } from 'react';

interface DigitProps {
  digit: string;
}

const Digit: React.FC<DigitProps> = ({ digit }) => {
  const isNumber = !isNaN(parseInt(digit));
  
  if (!isNumber) {
    return <span className="inline-block">{digit}</span>;
  }

  const num = parseInt(digit);
  
  return (
    <span className="inline-block overflow-hidden h-[1em] relative align-bottom">
      <span 
        className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.45,0.05,0.55,0.95)]"
        style={{ transform: `translateY(-${num * 10}%)` }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="flex items-center justify-center leading-none h-[1em]">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
};

interface Props {
  value: number;
  decimals?: number;
  className?: string;
}

const AnimatedNumber: React.FC<Props> = ({ value, decimals = 2, className = "" }) => {
  const [displayString, setDisplayString] = useState("");

  useEffect(() => {
    // Format the number to a fixed decimal string
    const formatted = value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    setDisplayString(formatted);
  }, [value, decimals]);

  return (
    <span className={`inline-flex items-baseline ${className}`} aria-label={value.toString()}>
      {displayString.split("").map((char, index) => (
        <Digit key={`${index}-${char}`} digit={char} />
      ))}
    </span>
  );
};

export default AnimatedNumber;
