import React from "react";

export default function StarRating({ value, onChange }) {
  return (
    <div>
      {[1,2,3,4].map(n => (
        <span
          key={n}
          style={{
            fontSize: "26px",
            cursor: "pointer",
            color: n <= value ? "gold" : "gray"
          }}
          onClick={() => onChange(n)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
