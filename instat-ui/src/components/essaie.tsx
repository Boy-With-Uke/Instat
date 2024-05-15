import { useState } from "react";

export default function Essaie() {
  const [sh8_product, setSh8product] = useState(0);
  const [sh2, setSh2product] = useState("");

  const handleSh2 = () => {
    console.log(sh8_product);
    const sh2_string = sh8_product.toString().slice(0, 2);
    const paddedSh2 = sh2_string.padStart(2, "0");
    setSh2product(paddedSh2);
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
