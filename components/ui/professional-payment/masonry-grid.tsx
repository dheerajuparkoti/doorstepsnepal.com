// // components/ui/MasonryGrid.tsx
// import React, { useMemo } from 'react';

// interface MasonryGridProps<T> {
//   items: T[];
//   renderItem: (item: T, index: number) => React.ReactNode;
//   columnCount?: {
//     default: number;
//     sm?: number;
//     md?: number;
//     lg?: number;
//     xl?: number;
//   };
//   gap?: number;
//   className?: string;
// }

// export function MasonryGrid<T>({
//   items,
//   renderItem,
//   columnCount = { default: 1, sm: 1, md: 2, lg: 2, xl: 2 },
//   gap = 16,
//   className = ''
// }: MasonryGridProps<T>) {
//   const columns = useMemo(() => {
//     const cols: T[][] = Array(columnCount.default).fill([]).map(() => []);
    
//     items.forEach((item, index) => {
//       const colIndex = index % columnCount.default;
//       cols[colIndex] = [...cols[colIndex], item];
//     });
    
//     return cols;
//   }, [items, columnCount.default]);

//   return (
//     <div 
//       className={`
//         grid 
//         grid-cols-1 
//         sm:grid-cols-${columnCount.sm || 1} 
//         md:grid-cols-${columnCount.md || 2} 
//         lg:grid-cols-${columnCount.lg || 2} 
//         xl:grid-cols-${columnCount.xl || 2}
//         gap-${gap}
//         ${className}
//       `}
//       style={{ gap: `${gap}px` }}
//     >
//       {columns.map((column, colIndex) => (
//         <div key={colIndex} className="flex flex-col" style={{ gap: `${gap}px` }}>
//           {column.map((item, itemIndex) => renderItem(item, itemIndex))}
//         </div>
//       ))}
//     </div>
//   );
// }



// components/ui/professional-payment/masonry-grid.tsx
import React, { useMemo } from 'react';

interface MasonryGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columnCount?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
  // Add keyExtractor prop to allow custom key generation
  keyExtractor?: (item: T, index: number) => string;
}

export function MasonryGrid<T>({
  items,
  renderItem,
  columnCount = { default: 1, sm: 1, md: 2, lg: 2, xl: 2 },
  gap = 16,
  className = '',
  keyExtractor
}: MasonryGridProps<T>) {
  const columns = useMemo(() => {
    const cols: T[][] = Array(columnCount.default).fill([]).map(() => []);
    
    items.forEach((item, index) => {
      const colIndex = index % columnCount.default;
      cols[colIndex] = [...cols[colIndex], item];
    });
    
    return cols;
  }, [items, columnCount.default]);

  return (
    <div 
      className={`
        grid 
        grid-cols-1 
        sm:grid-cols-${columnCount.sm || 1} 
        md:grid-cols-${columnCount.md || 2} 
        lg:grid-cols-${columnCount.lg || 2} 
        xl:grid-cols-${columnCount.xl || 2}
        ${className}
      `}
      style={{ gap: `${gap}px` }}
    >
      {columns.map((column, colIndex) => (
        <div key={`col-${colIndex}`} className="flex flex-col" style={{ gap: `${gap}px` }}>
          {column.map((item, itemIndex) => {
            // Generate a unique key for each item
            const key = keyExtractor 
              ? keyExtractor(item, itemIndex) 
              : `item-${colIndex}-${itemIndex}`;
            
            return (
              <React.Fragment key={key}>
                {renderItem(item, itemIndex)}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
}