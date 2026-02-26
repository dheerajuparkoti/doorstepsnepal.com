// lib/utils/formatters.ts
export class CurrencyFormatter {
  static format(amount: number | null | undefined): string {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return 'Rs. 0';
    }
    return `Rs. ${amount.toFixed(0)}`;
  }

  static formatWithoutSymbol(amount: number | null | undefined): string {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '0.00';
    }
    return amount.toFixed(0);
  }

  static formatCompact(amount: number | null | undefined): string {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return 'Rs. 0';
    }
    
    if (amount >= 1000000) {
      return `Rs. ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `Rs. ${(amount / 1000).toFixed(1)}K`;
    }
    return `Rs. ${amount.toFixed(0)}`;
  }
}

export class ProperCaseFormatter {
  static format(text: string | null | undefined): string {
    if (!text) return '';
     const sanitized = text.replace(/[^A-Za-z0-9 .,;:!?'"()\-@#&%$/\\\n\r]/g, '');
    return sanitized
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

export class FileDownloader {
  static async download(url: string, filename: string): Promise<void> {
    if (!url) return;
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  }

  static async downloadFromData(data: Blob | null | undefined, filename: string): Promise<void> {
    if (!data) return;
    
    try {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  }
}