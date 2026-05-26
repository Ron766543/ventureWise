import React from 'react';
import { Link } from 'react-router-dom';



function Logo({ size = 80, showText = true, className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2.0 select-none ${className}`}>
      <img
        src="/logo.png"
        alt="VentureWise"
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
      />
      {showText && (
        <span className="font-display font-bold text-2xl leading-none text-slate-900">
          Venture<span className="text-emerald-600">Wise</span>
        </span>
      )}
    </Link>
  );
}


export function LogoIcon({ size = 70 }) {
  return (
    <img
      src="/logo.png"
      alt="VentureWise"
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}

export default Logo;
