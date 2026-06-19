/* Shared notice state hook. */
import { useState } from "react";

function useNotice(delay = 3000) {
  const [notice, setNotice] = useState(null);
  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), delay);
  };
  return { notice, setNotice, showNotice };
}
export default useNotice;
