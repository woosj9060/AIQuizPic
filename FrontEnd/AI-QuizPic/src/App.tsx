import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => {
        console.error(err);
        setMessage("메시지 불러오기 실패");
      });
  }, []);

  return (
    <div>
      <h1>Spring에서 온 메시지:</h1>
      <p>{message || "불러오는 중..."}</p>
    </div>
  );
}

export default App;