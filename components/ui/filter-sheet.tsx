
'use client';

import { ReactNode } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X } from 'lucide-react';

export interface FilterOption {
  id: string;
  labelEn: string;
  labelNp: string;
  icon?: ReactNode;
  value?: any;
}

export interface FilterSection {
  id: string;
  titleEn: string;
  titleNp: string;
  type: 'single' | 'multiple' | 'range' | 'custom';
  options?: FilterOption[];
  component?: ReactNode;
}

interface FilterSheetProps {
  trigger?: ReactNode;
  title?: string;
  description?: string;
  sections: FilterSection[];
  activeFilters: Record<string, any>;
  onApplyFilters: (filters: Record<string, any>) => void;
  onReset: () => void;
  showTrigger?: boolean;
  triggerClassName?: string;
  side?: 'left' | 'right';
}

export function FilterSheet({
  trigger,
  title,
  description,
  sections,
  activeFilters,
  onApplyFilters,
  onReset,
  showTrigger = true,
  triggerClassName = "",
  side = "left",
}: FilterSheetProps) {
  const { language } = useI18n();
  
  const getLocalizedText = (en: string, np: string) => {
    return language === 'ne' ? np : en;
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(v => 
      v && (Array.isArray(v) ? v.length > 0 : true)
    ).length;
  };

  const handleToggleOption = (sectionId: string, optionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    if (section.type === 'multiple') {
      const current = activeFilters[sectionId] || [];
      const newValue = current.includes(optionId)
        ? current.filter((id: string) => id !== optionId)
        : [...current, optionId];
      
      onApplyFilters({ ...activeFilters, [sectionId]: newValue });
    } else if (section.type === 'single') {
      const newValue = activeFilters[sectionId] === optionId ? null : optionId;
      onApplyFilters({ ...activeFilters, [sectionId]: newValue });
    }
  };

  const isOptionSelected = (sectionId: string, optionId: string) => {
    const value = activeFilters[sectionId];
    if (Array.isArray(value)) {
      return value.includes(optionId);
    }
    return value === optionId;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Sheet>
      {showTrigger && (
        <SheetTrigger asChild>
          {trigger || (
            <Button
              variant="outline"
              size="icon"
              className={`relative ${triggerClassName}`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center animate-in zoom-in">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
        </SheetTrigger>
      )}
      
      <SheetContent side={side} className="w-full sm:max-w-md p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-xl">
              {title || getLocalizedText('Filters', 'फिल्टरहरू')}
            </SheetTitle>
            {description && (
              <SheetDescription>
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
          
          <ScrollArea className="flex-1">
            <div className="px-6 py-4 space-y-6">
              {sections.map((section, index) => (
                <div key={section.id} className="space-y-4">
                  {/* Section Title */}
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {getLocalizedText(section.titleEn, section.titleNp)}
                    </Label>
                   {activeFilters[section.id] && (
  <Button
    variant="ghost"
    size="sm"
    className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
    onClick={() => {
      if (section.type === 'multiple') {
        // For multiple select, set empty array instead of null
        onApplyFilters({ ...activeFilters, [section.id]: [] });
      } else {
        onApplyFilters({ ...activeFilters, [section.id]: null });
      }
    }}
  >
    <X className="h-3 w-3 mr-1" />
    {getLocalizedText('Clear', 'हटाउनुहोस्')}
  </Button>
)}
                  </div>

                  {/* Section Content */}
                  {section.type === 'custom' ? (
                    section.component
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {section.options?.map((option) => {
                        const isSelected = isOptionSelected(section.id, option.id);
                        
                        return (
                          <Badge
                            key={option.id}
                            variant={isSelected ? "default" : "outline"}
                            className={`
                              cursor-pointer transition-all duration-200 py-2 px-3 gap-1.5
                              ${isSelected 
                                ? 'bg-primary hover:bg-primary/90 shadow-md shadow-primary/20' 
                                : 'hover:border-primary hover:text-primary hover:bg-primary/5'
                              }
                            `}
                            onClick={() => handleToggleOption(section.id, option.id)}
                          >
                            {option.icon && (
                              <span className={isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}>
                                {option.icon}
                              </span>
                            )}
                            <span className={isSelected ? 'font-medium' : ''}>
                              {getLocalizedText(option.labelEn, option.labelNp)}
                            </span>
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  {index < sections.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="border-t p-6 bg-gradient-to-t from-background to-transparent">
            <div className="flex gap-3">
              <Button 
                className="flex-1 h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
                onClick={() => onApplyFilters(activeFilters)}
              >
                {getLocalizedText('Apply Filters', 'फिल्टर लागू गर्नुहोस्')}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-11 text-base font-medium border-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
                onClick={() => {
                  onReset();
                }}
              >
                {getLocalizedText('Reset All', 'सबै रिसेट')}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}