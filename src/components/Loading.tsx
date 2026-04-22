const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
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

const Loading : React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
    </div>
  );
}

export default Loading;