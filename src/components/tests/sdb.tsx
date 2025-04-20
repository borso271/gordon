import { useState } from "react";
import SymbolDropdownButton from "../Buttons/SymbolDropdownButton";
const TestSymbolDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div style={{ padding: "20px" }}>
      <SymbolDropdownButton
        text="Apple Inc."
        ticker_symbol="AAPL"
        asset_type="stock"
        onClick={handleToggle}
        toggle={isOpen}
        width={240}
      />

      {isOpen && (
        <div style={{ marginTop: "12px", padding: "8px", background: "#f9f9f9" }}>
          <p>This is the dropdown content.</p>
        </div>
      )}
    </div>
  );
};

export default TestSymbolDropdown;
