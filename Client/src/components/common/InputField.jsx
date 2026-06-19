import React from "react";

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  error = false, // Added error prop to catch missing inputs
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 mb-4 text-left">
      {label && (
        <label
          className="text-sm font-medium transition-colors"
          style={{ color: error ? "#E8453C" : "#4A4A6A" }} // Red if error, otherwise text-secondary
        >
          {label} {required && <span style={{ color: "#E8453C" }}>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl bg-white transition-all text-base focus:outline-none"
        style={{
          // Base styles using your precise design hex colors
          border: `1px solid ${error ? "#E8453C" : "#E8E8F0"}`, // Default border: #E8E8F0, Error border: #E8453C
          color: "#1A1A2E", // Default body text
        }}
        // Using inline styling overrides or focus states via standard standard attributes
        onFocus={(e) => {
          e.target.style.borderColor = "#E8453C";
          e.target.style.boxShadow = "0 0 0 1px #E8453C";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#E8453C" : "#E8E8F0";
          e.target.style.boxShadow = "none";
        }}
      />

      {/* Optional: Add a small helper text below the input field if an error string exists */}
      {typeof error === "string" && error && (
        <span
          className="text-xs font-medium mt-0.5"
          style={{ color: "#E8453C" }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
