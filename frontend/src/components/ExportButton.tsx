import { Button } from './ui/button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ExportButtonProps {
  data: any;
  filename: string;
  title?: string;
}

export function ExportButton({ data, filename, title }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = () => {
    setIsExporting(true);
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      let csvContent = '';
      
      if (Array.isArray(data)) {
        if (data.length === 0) return;
        
        // Get headers from first object
        const headers = Object.keys(data[0]);
        csvContent = headers.join(',') + '\n';
        
        // Add rows
        data.forEach(row => {
          const values = headers.map(header => {
            const value = row[header];
            // Escape commas and quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          });
          csvContent += values.join(',') + '\n';
        });
      } else {
        // Convert object to CSV
        csvContent = Object.entries(data)
          .map(([key, value]) => `${key},${value}`)
          .join('\n');
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    setIsExporting(true);
    try {
      // Create a simple text-based PDF report
      let content = `${title || 'Export Report'}\n`;
      content += `Generated: ${new Date().toLocaleString()}\n\n`;
      content += '='.repeat(60) + '\n\n';
      
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          content += `Entry ${index + 1}:\n`;
          Object.entries(item).forEach(([key, value]) => {
            content += `  ${key}: ${value}\n`;
          });
          content += '\n';
        });
      } else {
        Object.entries(data).forEach(([key, value]) => {
          content += `${key}: ${value}\n`;
        });
      }
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting} className="gap-2">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV} className="gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="gap-2">
          <FileText className="w-4 h-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="gap-2">
          <FileText className="w-4 h-4" />
          Export as Text Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
