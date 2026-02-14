

// import NepaliDate from 'nepali-date';

// export class NepaliDateService {
//   /**
//    * Convert AD date to BS date with validation
//    */
//   static toBS(date: Date | string | null | undefined): NepaliDate | null {
//     if (!date) return null;
    
//     try {
//       // If it's already a Date object
//       if (date instanceof Date) {
//         if (isNaN(date.getTime())) return null;
//         return new NepaliDate(date);
//       }
      
//       // If it's a string
//       if (typeof date === 'string') {
//         // Check if string is empty or invalid
//         if (!date.trim()) return null;
        
//         const parsedDate = new Date(date);
//         if (isNaN(parsedDate.getTime())) return null;
//         return new NepaliDate(parsedDate);
//       }
      
//       return null;
//     } catch (error) {
//       console.error('Error converting to BS date:', error);
//       return null;
//     }
//   }

//   /**
//    * Get current Nepali date
//    */
//   static now(): NepaliDate {
//     return new NepaliDate(new Date());
//   }

//   /**
//    * Format Nepali date with safe handling
//    */
//   static format(date: NepaliDate | Date | string | null | undefined, formatStr: string = 'yyyy-MM-dd'): string {
//     if (!date) return 'N/A';
    
//     try {
//       if (date instanceof NepaliDate) {
//         return date.format(formatStr);
//       }
//       const nepaliDate = this.toBS(date);
//       return nepaliDate ? nepaliDate.format(formatStr) : 'N/A';
//     } catch (error) {
//       return 'N/A';
//     }
//   }

//   /**
//    * Format with time
//    */
// static formatWithTime(date: string | null | undefined): string {
//   if (!date) return 'N/A';

//   try {
//     const datePart = date.split(' ')[0]; // 2082-11-01
//     const timePart = this.formatTime(date);

//     return `${datePart}, ${timePart}`;
//   } catch {
//     return 'N/A';
//   }
// }

//   /**
//    * Format date only
//    */
//   static formatDate(date: NepaliDate | Date | string | null | undefined): string {
//     if (!date) return 'N/A';
    
//     try {
//       const nepaliDate = date instanceof NepaliDate ? date : this.toBS(date);
//       return nepaliDate ? nepaliDate.format('yyyy-MM-dd') : 'N/A';
//     } catch (error) {
//       return 'N/A';
//     }
//   }

//   /**
//    * Format time only
//    */
//   static formatTime(date: NepaliDate | Date | string | null | undefined): string {
//     if (!date) return 'N/A';
    
//     try {
//       const nepaliDate = date instanceof NepaliDate ? date : this.toBS(date);
//       return nepaliDate ? nepaliDate.format('hh:mm:ss a') : 'N/A';
//     } catch (error) {
//       return 'N/A';
//     }
//   }

//   /**
//    * Format for header display with safe handling
//    */
//   static formatHeader(date: NepaliDate | Date | string | null | undefined): string {
//     if (!date) return 'Date not available';
    
//     try {
//       const nepaliDate = date instanceof NepaliDate ? date : this.toBS(date);
//       if (!nepaliDate) return 'Date not available';
      
//       const year = nepaliDate.getYear();
//       const month = nepaliDate.getMonth();
//       const day = nepaliDate.getDate();
//       const monthNames = [
//         'Baisakh', 'Jestha', 'Ashad', 'Shrawan', 'Bhadra', 'Ashwin',
//         'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
//       ];
//       return `${monthNames[month]} ${day}, ${year}`;
//     } catch (error) {
//       return 'Date not available';
//     }
//   }

//   /**
//    * Get date from filter - with null check
//    */
//   static getDateFromFilter(filter: string): NepaliDate | null {
//     const days = this.getDaysFromFilter(filter);
//     if (days === null) return null;
    
//     try {
//       const date = new Date();
//       date.setDate(date.getDate() - days);
//       return this.toBS(date);
//     } catch (error) {
//       return null;
//     }
//   }

//   private static getDaysFromFilter(filter: string): number | null {
//     const filterMap: Record<string, number> = {
//       '3_days': 3,
//       'week': 7,
//       '15_days': 15,
//       'month': 30,
//       '3_months': 90,
//       '6_months': 180,
//       'year': 365
//     };
//     return filterMap[filter] ?? null;
//   }

//   /**
//    * Compare two Nepali dates with null checks
//    */
//   static compare(date1: NepaliDate | null, date2: NepaliDate | null): number {
//     if (!date1 || !date2) return 0;
    
//     try {
//       const d1 = new Date(date1.getYear(), date1.getMonth(), date1.getDate());
//       const d2 = new Date(date2.getYear(), date2.getMonth(), date2.getDate());
//       return d2.getTime() - d1.getTime();
//     } catch (error) {
//       return 0;
//     }
//   }

//   /**
//    * Check if date is after start date with null checks
//    */
//   static isAfter(date: NepaliDate | null, startDate: NepaliDate | null): boolean {
//     if (!date || !startDate) return false;
//     return this.compare(date, startDate) <= 0;
//   }

//   /**
//    * Safely get year from date
//    */
//   static getYear(date: NepaliDate | Date | string | null | undefined): number {
//     if (!date) return new Date().getFullYear();
    
//     try {
//       const nepaliDate = date instanceof NepaliDate ? date : this.toBS(date);
//       return nepaliDate?.getYear() ?? new Date().getFullYear();
//     } catch (error) {
//       return new Date().getFullYear();
//     }
//   }

//   /**
//    * Safely get month from date
//    */
//   static getMonth(date: NepaliDate | Date | string | null | undefined): number {
//     if (!date) return new Date().getMonth();
    
//     try {
//       const nepaliDate = date instanceof NepaliDate ? date : this.toBS(date);
//       return nepaliDate?.getMonth() ?? new Date().getMonth();
//     } catch (error) {
//       return new Date().getMonth();
//     }
//   }

//   /**
//    * Safely get day from date
//    */
//   static getDay(date: NepaliDate | Date | string | null | undefined): number {
//     if (!date) return new Date().getDate();
    
//     try {
//       const nepaliDate = date instanceof NepaliDate ? date : this.toBS(date);
//       return nepaliDate?.getDate() ?? new Date().getDate();
//     } catch (error) {
//       return new Date().getDate();
//     }
//   }
// }



import NepaliDate from 'nepali-datetime';
type NepaliDate = InstanceType<typeof NepaliDate>;
export class NepaliDateService {
  /**
   * Convert AD date or BS string to NepaliDate
   */
  static toBS(date: Date | string | null | undefined): NepaliDate | null {
    if (!date) return null;

    try {
      if (date instanceof Date) {
        return new NepaliDate(date);
      }

      if (typeof date === 'string') {
        if (!date.trim()) return null;
        return new NepaliDate(date);
      }

      return null;
    } catch (error) {
      console.error('Error converting to BS date:', error);
      return null;
    }
  }

  /**
   * Current Nepali date-time
   */
  static now(): NepaliDate {
    return new NepaliDate();
  }

  /**
   * Generic formatting
   */
  static format(
    date: NepaliDate | Date | string | null | undefined,
    formatStr: string = 'YYYY-MM-DD'
  ): string {
    const d = date instanceof NepaliDate ? date : this.toBS(date);
    return d ? d.format(formatStr) : 'N/A';
  }

  /**
   * Format date + time: "2082-11-01, 12:11 PM"
   */
  static formatWithTime(date: NepaliDate | Date | string | null | undefined): string {
    const d = date instanceof NepaliDate ? date : this.toBS(date);
    return d ? d.format('YYYY-MM-DD, hh:mm A') : 'N/A';
  }

  /**
   * Format date only: "2082-11-01"
   */
  static formatDate(date: NepaliDate | Date | string | null | undefined): string {
    const d = date instanceof NepaliDate ? date : this.toBS(date);
    return d ? d.format('YYYY-MM-DD') : 'N/A';
  }

  /**
   * Format time only: "12:11 PM"
   */
  static formatTime(date: NepaliDate | Date | string | null | undefined): string {
    const d = date instanceof NepaliDate ? date : this.toBS(date);
    return d ? d.format('hh:mm A') : 'N/A';
  }

  /**
   * Header style: "Mangsir 1, 2082"
   */
  static formatHeader(date: NepaliDate | Date | string | null | undefined): string {
    const d = date instanceof NepaliDate ? date : this.toBS(date);
    return d ? d.format('MMMM D, YYYY') : 'Date not available';
  }

  /**
   * Get Nepali date from filter string
   */
  static getDateFromFilter(filter: string): NepaliDate | null {
    const days = this.getDaysFromFilter(filter);
    if (days === null) return null;

    try {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return this.toBS(date);
    } catch {
      return null;
    }
  }

  private static getDaysFromFilter(filter: string): number | null {
    const filterMap: Record<string, number> = {
      '3_days': 3,
      week: 7,
      '15_days': 15,
      month: 30,
      '3_months': 90,
      '6_months': 180,
      year: 365,
    };
    return filterMap[filter] ?? null;
  }

  /**
   * Compare two NepaliDates
   */
  static compare(date1: NepaliDate | null, date2: NepaliDate | null): number {
    if (!date1 || !date2) return 0;

    try {
      const d1 = new Date(date1.getYear(), date1.getMonth(), date1.getDate());
      const d2 = new Date(date2.getYear(), date2.getMonth(), date2.getDate());
      return d2.getTime() - d1.getTime();
    } catch {
      return 0;
    }
  }

  /**
   * Check if date is after startDate
   */
  static isAfter(date: NepaliDate | null, startDate: NepaliDate | null): boolean {
    if (!date || !startDate) return false;
    return this.compare(date, startDate) <= 0;
  }

  /**
   * Safely get year
   */
  static getYear(date: NepaliDate | Date | string | null | undefined): number {
    const d = date instanceof NepaliDate ? date : this.toBS(date);
    return d ? d.getYear() : new Date().getFullYear();
  }

  /**
   * Safely get month (0-11)
   */
  static getMonth(date: NepaliDate | Date | string | null | undefined): number {
    const d = date instanceof NepaliDate ? date : this.toBS(date);
    return d ? d.getMonth() : new Date().getMonth();
  }

  /**
   * Safely get day of month
   */
  static getDay(date: NepaliDate | Date | string | null | undefined): number {
    const d = date instanceof NepaliDate ? date : this.toBS(date);
    return d ? d.getDate() : new Date().getDate();
  }



  //    * Format for header display with safe handling

  static formatNepaliMonth(date: NepaliDate | Date | string | null | undefined): string {
    if (!date) return 'Date not available';
    
    try {
      const nepaliDate = date instanceof NepaliDate ? date : this.toBS(date);
      if (!nepaliDate) return 'Date not available';
      
      const year = nepaliDate.getYear();
      const month = nepaliDate.getMonth();
      const day = nepaliDate.getDate();
      const monthNames = [
        'Baisakh', 'Jestha', 'Ashad', 'Shrawan', 'Bhadra', 'Ashwin',
        'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
      ];
      return `${monthNames[month]} ${day}, ${year}`;
    } catch (error) {
      return 'Date not available';
    }
  }
}
