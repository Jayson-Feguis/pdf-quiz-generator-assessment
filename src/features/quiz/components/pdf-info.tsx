import { Card, CardContent } from "@/components/ui/card";
import { FileText, FilesIcon as Pages, Type } from "lucide-react";

type Props = {
  pageCount: number;
  textLength: number;
  truncated?: boolean;
};

export function PdfInfo({ pageCount, textLength, truncated }: Props) {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4 text-sm text-green-800">
          <div className="flex items-center">
            <Pages className="h-4 w-4 mr-1" />
            <span>{pageCount} pages</span>
          </div>
          <div className="flex items-center">
            <Type className="h-4 w-4 mr-1" />
            <span>{textLength.toLocaleString()} characters</span>
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            <span>Text extracted successfully</span>
          </div>
        </div>
        {truncated && (
          <p className="text-xs text-green-700 mt-2">
            Note: Document was truncated due to length limits
          </p>
        )}
      </CardContent>
    </Card>
  );
}
