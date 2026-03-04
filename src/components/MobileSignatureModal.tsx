import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

interface MobileSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
  fieldType: "signature" | "initial" | "text" | "date";
}

export default function MobileSignatureModal({
  isOpen,
  onClose,
  onSave,
  fieldType,
}: MobileSignatureModalProps) {
  const [mode, setMode] = useState<"draw" | "type" | "upload">("draw");
  const [typedText, setTypedText] = useState("");
  const [selectedFont, setSelectedFont] = useState("cursive");
  const [isMobile, setIsMobile] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 200 });

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCanvasSize({
        width: mobile ? window.innerWidth - 64 : 500,
        height: mobile ? 150 : 200,
      });
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isOpen) return null;

  const handleClear = () => {
    sigCanvas.current?.clear();
    setTypedText("");
  };

  const handleSave = () => {
    if (mode === "draw") {
      if (sigCanvas.current?.isEmpty()) {
        alert("Please provide a signature");
        return;
      }
      const signatureData = sigCanvas.current?.toDataURL();
      onSave(signatureData || "");
    } else if (mode === "type") {
      if (!typedText.trim()) {
        alert("Please type your signature");
        return;
      }
      // Convert typed text to canvas image
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.font = `${isMobile ? "32px" : "48px"} ${selectedFont}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(typedText, canvas.width / 2, canvas.height / 2);
      }
      onSave(canvas.toDataURL());
    }
  };

  const fonts = [
    { name: "Cursive", value: "cursive" },
    { name: "Script", value: "'Dancing Script', cursive" },
    { name: "Elegant", value: "'Great Vibes', cursive" },
    { name: "Modern", value: "'Pacifico', cursive" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">
            {fieldType === "signature" && "Add Signature"}
            {fieldType === "initial" && "Add Initials"}
            {fieldType === "text" && "Add Text"}
            {fieldType === "date" && "Add Date"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mode Selection */}
        <div className="p-4 border-b">
          <div className="flex space-x-2">
            <button
              onClick={() => setMode("draw")}
              className={`flex-1 py-2 px-4 rounded-lg transition ${
                mode === "draw"
                  ? "bg-indigo-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ✍️ Draw
            </button>
            <button
              onClick={() => setMode("type")}
              className={`flex-1 py-2 px-4 rounded-lg transition ${
                mode === "type"
                  ? "bg-indigo-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ⌨️ Type
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {mode === "draw" && (
            <div>
              <div className="border-2 border-gray-300 rounded-lg bg-white overflow-hidden">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    className: "signature-canvas touch-none",
                  }}
                  backgroundColor="white"
                  penColor="black"
                  minWidth={isMobile ? 1.5 : 1}
                  maxWidth={isMobile ? 3 : 2}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {isMobile ? "Draw your signature with your finger" : "Draw your signature with your mouse"}
              </p>
            </div>
          )}

          {mode === "type" && (
            <div>
              {/* Font Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Font Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {fonts.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setSelectedFont(font.value)}
                      className={`p-3 border-2 rounded-lg transition ${
                        selectedFont === font.value
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                      style={{ fontFamily: font.value }}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type Your {fieldType === "signature" ? "Full Name" : "Initials"}
                </label>
                <input
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  placeholder={fieldType === "signature" ? "John Doe" : "JD"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  maxLength={fieldType === "initial" ? 3 : 50}
                />
              </div>

              {/* Preview */}
              {typedText && (
                <div className="border-2 border-gray-300 rounded-lg bg-white p-8 flex items-center justify-center">
                  <div
                    style={{
                      fontFamily: selectedFont,
                      fontSize: isMobile ? "32px" : "48px",
                    }}
                  >
                    {typedText}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-between sticky bottom-0 bg-white">
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .signature-canvas {
          touch-action: none;
        }
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script&family=Great+Vibes&family=Pacifico&display=swap');
      `}</style>
    </div>
  );
}
