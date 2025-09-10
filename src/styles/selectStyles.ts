// src/constants/selectStyles.ts
export const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderColor: state.isFocused ? "var(--auditly-orange)" : "#D1D5DB",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(255, 127, 127, 0.2)" : "none",
    borderRadius: "0.5rem",
    padding: "4px",
    minHeight: "48px",
    backgroundColor: "white",
    cursor: "pointer",
    "&:hover": {
      borderColor: state.isFocused ? "var(--auditly-orange)" : "#9CA3AF",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "0.5rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    zIndex: 50,
    border: "1px solid #E5E7EB",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? "rgba(255, 127, 127, 0.1)"
      : state.isSelected
      ? "var(--auditly-orange)"
      : "white",
    color: state.isFocused
      ? "var(--auditly-dark-blue)"
      : state.isSelected
      ? "white"
      : "#374151",
    cursor: "pointer",
    padding: "12px 16px",
    "&:active": {
      backgroundColor: "rgba(255, 127, 127, 0.2)",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#9CA3AF",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#374151",
  }),
  input: (provided: any) => ({
    ...provided,
    color: "#374151",
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: 0,
  }),
};

export const multiSelectStyles = {
  ...selectStyles,
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "rgba(255, 127, 127, 0.2)",
    borderRadius: "0.375rem",
    margin: "2px",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "var(--auditly-dark-blue)",
    fontSize: "14px",
    fontWeight: "500",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "var(--auditly-dark-blue)",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#DC2626",
      color: "white",
    },
  }),
};
