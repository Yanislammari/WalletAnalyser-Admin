const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #eee",
    borderTop: "5px solid #7c3fe8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  }
};

interface LoadingProps {
  style?: React.CSSProperties;
  spinnerSize?: number;
  fullPage?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ style, spinnerSize = 50, fullPage = true }) => {
  const containerStyle = {
    ...styles.container,
    ...(fullPage && { height: "100vh" }),
    ...style,
  };

  const spinnerStyle = {
    ...styles.spinner,
    width: `${spinnerSize}px`,
    height: `${spinnerSize}px`,
    border: `${Math.max(2, spinnerSize / 10)}px solid #eee`,
    borderTop: `${Math.max(2, spinnerSize / 10)}px solid #7c3fe8`,
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
    </div>
  );
};

export default Loading;