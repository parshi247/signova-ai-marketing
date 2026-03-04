import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface MobilePDFViewerProps {
  fileUrl: string;
  signatureFields?: any[];
  onFieldClick?: (field: any) => void;
  readOnly?: boolean;
}

export default function MobilePDFViewer({
  fileUrl,
  signatureFields = [],
  onFieldClick,
  readOnly = false,
}: MobilePDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate container width for responsive PDF
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  // Touch gestures for zoom
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; distance: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setTouchStart({
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
        distance,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStart) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const scaleChange = distance / touchStart.distance;
      const newScale = Math.max(0.5, Math.min(3, scale * scaleChange));
      setScale(newScale);
      setTouchStart({ ...touchStart, distance });
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber(Math.max(1, pageNumber - 1));
  };

  const goToNextPage = () => {
    setPageNumber(Math.min(numPages, pageNumber + 1));
  };

  const zoomIn = () => {
    setScale(Math.min(3, scale + 0.25));
  };

  const zoomOut = () => {
    setScale(Math.max(0.5, scale - 0.25));
  };

  const resetZoom = () => {
    setScale(1);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mobile-optimized toolbar */}
      <div className="bg-gray-800 text-white p-2 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm">
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={zoomOut} className="p-2 rounded hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} className="p-2 rounded hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button onClick={resetZoom} className="p-2 rounded hover:bg-gray-700 text-xs">
            Reset
          </button>
        </div>
      </div>

      {/* PDF viewer with touch gestures */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-100"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-center p-4">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-96 text-red-600">
                <p>Failed to load PDF. Please try again.</p>
              </div>
            }
          >
            <div className="relative">
              <Page
                pageNumber={pageNumber}
                scale={isMobile ? scale * 0.8 : scale}
                width={isMobile ? containerWidth - 32 : undefined}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />

              {/* Render signature fields */}
              {!readOnly &&
                signatureFields
                  .filter((field) => field.page === pageNumber)
                  .map((field) => (
                    <div
                      key={field.id}
                      onClick={() => onFieldClick?.(field)}
                      className="absolute border-2 border-dashed border-indigo-600 bg-indigo-100 bg-opacity-30 cursor-pointer hover:bg-opacity-50 transition"
                      style={{
                        left: `${field.x * scale}px`,
                        top: `${field.y * scale}px`,
                        width: `${field.width * scale}px`,
                        height: `${field.height * scale}px`,
                      }}
                    >
                      <div className="text-xs text-indigo-700 p-1 truncate">
                        {field.type === "signature" && "✍️ Sign"}
                        {field.type === "initial" && "📝 Initial"}
                        {field.type === "date" && "📅 Date"}
                        {field.type === "text" && "📄 Text"}
                      </div>
                    </div>
                  ))}
            </div>
          </Document>
        </div>
      </div>

      {/* Mobile swipe hint */}
      {isMobile && (
        <div className="bg-blue-50 border-t border-blue-200 p-2 text-center text-xs text-blue-800">
          💡 Tip: Pinch to zoom, swipe to navigate pages
        </div>
      )}
    </div>
  );
}
