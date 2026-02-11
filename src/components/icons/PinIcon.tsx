import * as React from "react";

export const PinIcon = ({color, ...props}: React.SVGProps<SVGSVGElement> & { color: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="40"
        height="40"
        fill={color}
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))'}}
        {...props}
    >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3" fill="white"/>
    </svg>
);