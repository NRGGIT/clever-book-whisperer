
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

export const UploadZone = ({ onUpload, uploading }: UploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && acceptedFiles[0]) {
      await onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/epub+zip': ['.epub'],
    },
    multiple: false,
    disabled: uploading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragActive || dragActive
              ? 'border-amber-400 bg-amber-50/50'
              : 'border-gray-300 hover:border-amber-300 hover:bg-gray-50/50'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-white" />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {uploading ? 'Processing your book...' : 'Upload EPUB Book'}
              </h3>
              <p className="text-gray-600 mb-4">
                {uploading 
                  ? 'Please wait while we process your EPUB file'
                  : isDragActive 
                    ? 'Drop your EPUB file here'
                    : 'Drag and drop your EPUB file here, or click to browse'
                }
              </p>
            </div>

            {!uploading && (
              <Button 
                variant="outline" 
                className="border-amber-300 text-amber-600 hover:bg-amber-50"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Choose EPUB File
              </Button>
            )}
          </div>
          
          {uploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">Processing...</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
