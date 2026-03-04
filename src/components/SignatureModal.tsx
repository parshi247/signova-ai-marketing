import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenTool, Type, Upload, Eraser, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignatureModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (signatureData: string, type: 'draw' | 'type' | 'upload') => void;
  title?: string;
  description?: string;
}

export default function SignatureModal({
  open,
  onClose,
  onSave,
  title = 'Add Your Signature',
  description = 'Draw, type, or upload your signature',
}: SignatureModalProps) {
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [selectedFont, setSelectedFont] = useState('cursive');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && activeTab === 'draw') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    let signatureData = '';

    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        signatureData = canvas.toDataURL('image/png');
      }
    } else if (activeTab === 'type') {
      // Create a canvas with typed text
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = `48px ${selectedFont}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);
        signatureData = canvas.toDataURL('image/png');
      }
    } else if (activeTab === 'upload') {
      signatureData = uploadedImage || '';
    }

    if (signatureData) {
      onSave(signatureData, activeTab);
      handleClose();
    }
  };

  const handleClose = () => {
    clearCanvas();
    setTypedSignature('');
    setUploadedImage(null);
    onClose();
  };

  const fonts = [
    { name: 'Cursive', value: 'cursive', style: 'cursive' },
    { name: 'Brush Script', value: 'Brush Script MT', style: 'Brush Script MT, cursive' },
    { name: 'Lucida Handwriting', value: 'Lucida Handwriting', style: 'Lucida Handwriting, cursive' },
    { name: 'Dancing Script', value: 'Dancing Script', style: 'Dancing Script, cursive' },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="draw" className="gap-2">
              <PenTool className="w-4 h-4" />
              Draw
            </TabsTrigger>
            <TabsTrigger value="type" className="gap-2">
              <Type className="w-4 h-4" />
              Type
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-4 bg-white">
              <canvas
                ref={canvasRef}
                width={700}
                height={300}
                className="w-full cursor-crosshair border border-gray-300 rounded"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={clearCanvas}>
                <Eraser className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="type" className="space-y-4">
            <div>
              <Label htmlFor="signature-text">Type your name</Label>
              <Input
                id="signature-text"
                placeholder="John Doe"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                className="text-lg"
              />
            </div>

            <div>
              <Label>Choose a font style</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {fonts.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => setSelectedFont(font.value)}
                    className={cn(
                      'p-4 border-2 rounded-lg text-center text-2xl transition-all',
                      selectedFont === font.value
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    style={{ fontFamily: font.style }}
                  >
                    {typedSignature || font.name}
                  </button>
                ))}
              </div>
            </div>

            {typedSignature && (
              <div className="border-2 border-dashed rounded-lg p-8 bg-white text-center">
                <p className="text-sm text-gray-600 mb-4">Preview</p>
                <p
                  className="text-5xl"
                  style={{ fontFamily: selectedFont }}
                >
                  {typedSignature}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center bg-white">
              {uploadedImage ? (
                <div className="space-y-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded signature"
                    className="max-h-48 mx-auto"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedImage(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-4">
                    Upload an image of your signature
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: PNG, JPG, GIF
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-700 hover:bg-indigo-800"
            disabled={
              (activeTab === 'draw' && !canvasRef.current) ||
              (activeTab === 'type' && !typedSignature) ||
              (activeTab === 'upload' && !uploadedImage)
            }
          >
            <Check className="w-4 h-4 mr-2" />
            Save Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
