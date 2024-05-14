import { useState } from "react";

export default function Essaie() {
  const [sh8_product, setSh8product] = useState(0);
  const [sh2, setSh2product] = useState("");

  const handleSh2 = () => {
    const sh8_string = sh8_product.toString();
    const sh2_string = sh8_string.slice(0, 3).toString();
    setSh2product(sh2_string);
  };

  return (
    <>
      <div>
        <input
          type="number"
          onChange={(event) => setSh8product(Number(event.target.value))}
        />
        <button onClick={handleSh2}>valider</button>
        <pre>{sh2}</pre>
      </div>
    </>
  );
}

