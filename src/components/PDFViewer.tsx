import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Type,
  PenTool,
  Calendar,
  CheckSquare,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignatureField {
  id: string;
  type: 'signature' | 'initial' | 'text' | 'date' | 'checkbox';
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  label?: string;
  required?: boolean;
  assignedTo?: string;
}

interface PDFViewerProps {
  fileUrl: string;
  documentId: number;
  onFieldsUpdate?: (fields: SignatureField[]) => void;
  editable?: boolean;
}

export default function PDFViewer({ fileUrl, documentId, onFieldsUpdate, editable = true }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [fields, setFields] = useState<SignatureField[]>([]);
  const [selectedFieldType, setSelectedFieldType] = useState<SignatureField['type'] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  // Load PDF using PDF.js
  useEffect(() => {
    const loadPDF = async () => {
      try {
        // Dynamically import pdfjs-dist
        const pdfjsLib = await import('pdfjs-dist');
        
        // Set worker path
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPDF();
  }, [fileUrl]);

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: zoom });

      // Create canvas element
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Clear and append canvas
      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
        canvasRef.current.appendChild(canvas);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, zoom]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedFieldType || !editable) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newField: SignatureField = {
      id: `field-${Date.now()}`,
      type: selectedFieldType,
      x,
      y,
      width: selectedFieldType === 'checkbox' ? 5 : 20,
      height: selectedFieldType === 'checkbox' ? 5 : 8,
      page: currentPage,
      required: true,
    };

    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    onFieldsUpdate?.(updatedFields);
    setSelectedFieldType(null);
  };

  const handleRemoveField = (fieldId: string) => {
    const updatedFields = fields.filter(f => f.id !== fieldId);
    setFields(updatedFields);
    onFieldsUpdate?.(updatedFields);
  };

  const fieldTypeIcons = {
    signature: PenTool,
    initial: Type,
    text: Type,
    date: Calendar,
    checkbox: CheckSquare,
  };

  const fieldTypeLabels = {
    signature: 'Signature',
    initial: 'Initials',
    text: 'Text',
    date: 'Date',
    checkbox: 'Checkbox',
  };

  const fieldTypeColors = {
    signature: 'border-indigo-500 bg-indigo-50',
    initial: 'border-blue-500 bg-blue-50',
    text: 'border-green-500 bg-green-50',
    date: 'border-orange-500 bg-orange-50',
    checkbox: 'border-pink-500 bg-pink-50',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between gap-4">
          {/* Field Types */}
          {editable && (
            <div className="flex gap-2">
              {(['signature', 'initial', 'text', 'date', 'checkbox'] as const).map((type) => {
                const Icon = fieldTypeIcons[type];
                return (
                  <Button
                    key={type}
                    variant={selectedFieldType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFieldType(selectedFieldType === type ? null : type)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {fieldTypeLabels[type]}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[80px] text-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Download */}
          <Button variant="outline" size="sm" asChild>
            <a href={fileUrl} download>
              <Download className="w-4 h-4 mr-2" />
              Download
            </a>
          </Button>
        </div>

        {selectedFieldType && editable && (
          <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-sm text-indigo-900">
              Click on the document to place a <strong>{fieldTypeLabels[selectedFieldType]}</strong> field
            </p>
          </div>
        )}
      </Card>

      {/* PDF Canvas */}
      <Card className="flex-1 relative overflow-auto">
        <div className="p-8 flex justify-center">
          <div 
            ref={canvasRef} 
            className={cn(
              "relative shadow-2xl",
              selectedFieldType && editable && "cursor-crosshair"
            )}
            onClick={handleCanvasClick}
            style={{ minHeight: '600px', background: '#fff' }}
          >
            {/* Render signature fields on current page */}
            {fields
              .filter(field => field.page === currentPage)
              .map(field => {
                const Icon = fieldTypeIcons[field.type];
                return (
                  <div
                    key={field.id}
                    className={cn(
                      "absolute border-2 rounded flex items-center justify-center group",
                      fieldTypeColors[field.type]
                    )}
                    style={{
                      left: `${field.x}%`,
                      top: `${field.y}%`,
                      width: `${field.width}%`,
                      height: `${field.height}%`,
                    }}
                  >
                    <Icon className="w-4 h-4 opacity-50" />
                    {editable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveField(field.id);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </Card>

      {/* Field Summary */}
      {fields.length > 0 && (
        <Card className="mt-4 p-4">
          <h3 className="font-semibold mb-2">Signature Fields ({fields.length})</h3>
          <div className="flex flex-wrap gap-2">
            {fields.map(field => {
              const Icon = fieldTypeIcons[field.type];
              return (
                <div
                  key={field.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full text-sm border-2",
                    fieldTypeColors[field.type]
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {fieldTypeLabels[field.type]} (Page {field.page})
                  {editable && (
                    <button
                      onClick={() => handleRemoveField(field.id)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
