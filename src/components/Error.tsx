import React from "react";

interface ErrorProps {
  errorMessage: string;
}

const styles = {
  errorBox: {
    backgroundColor: "#ffe5e5",   // light red
    color: "#000",                // black text
    padding: "10px 16px",
    borderRadius: "6px",
    width: "99%",                // full width
    marginTop: "12px",            // top margin
    marginRight : "12px",
    minHeight: "50px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    textAlign: "center",
    fontSize: "14px",             // smaller text
    fontWeight: 400,

    boxSizing: "border-box",      // prevents overflow
  } as React.CSSProperties,
};


const ErrorContainer: React.FC<ErrorProps> = ({ errorMessage }) => {
  return (
    <div style={styles.errorBox}>
      {errorMessage}
    </div>
  );
};

export default ErrorContainer;