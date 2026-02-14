'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Check, X } from 'lucide-react';

// Import the same skills list from your skills page
const ALL_SKILLS = [
  'Clear Communication', 'Active Listening', 'Professional Language',
  'Customer Focus', 'Patience', 'Empathy', 'Punctuality', 'Reliability',
  'Technical Knowledge', 'Attention to Detail', 'Analytical Thinking',
  'Team Player', 'Collaboration', 'Adaptability', 'Quick Learning',
  'Safety Protocols', 'First Aid Certified', 'Physical Stamina',
  'Mobile App Usage', 'Digital Payments', 'Local Language Proficiency',
  'Licensed Professional', 'Certified Technician', 'Trustworthy',
  'Systematic Approach', 'Quality Assurance', 'Clean Workspace'
];

interface SkillPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (skill: string) => void;
  selectedSkills: string[];
  maxSkills: number;
}

export function SkillPickerModal({ 
  open, 
  onClose, 
  onSelect, 
  selectedSkills, 
  maxSkills 
}: SkillPickerModalProps) {
  const { locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSkills, setFilteredSkills] = useState<string[]>(ALL_SKILLS);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredSkills(
        ALL_SKILLS.filter(skill =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredSkills(ALL_SKILLS);
    }
  }, [searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {locale === 'ne' ? 'कौशलहरू छान्नुहोस्' : 'Select Skills'}
          </DialogTitle>
          <DialogDescription>
            {locale === 'ne' 
              ? `तपाईं अधिकतम ${maxSkills} कौशलहरू मात्र चयन गर्न सक्नुहुन्छ`
              : `You can select up to ${maxSkills} skills`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={locale === 'ne' ? 'कौशल खोज्नुहोस्...' : 'Search skills...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Selected count */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {selectedSkills.length} / {maxSkills} selected
            </span>
            <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                style={{ width: `${(selectedSkills.length / maxSkills) * 100}%` }}
              />
            </div>
          </div>

          {/* Skills list */}
          <div className="border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
            {filteredSkills.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  {locale === 'ne' ? 'कुनै कौशल फेला परेन' : 'No skills found'}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  const isMaxReached = selectedSkills.length >= maxSkills && !isSelected;

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => !isMaxReached && onSelect(skill)}
                      disabled={isMaxReached}
                      className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                        isSelected ? 'bg-purple-50 dark:bg-purple-950/30' : ''
                      } ${isMaxReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill}</span>
                        {isSelected && (
                          <Badge variant="default" className="bg-green-500">
                            <Check className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Close button */}
          <Button onClick={onClose} className="w-full">
            {locale === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}