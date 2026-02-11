'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useProfessionalStore } from '@/stores/professional-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import {
  Save,
  Search,
  X,
  RefreshCw,
  Plus,
  Check,
  AlertTriangle,
  Star,
  Award,
  Briefcase,
  Settings,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock professional ID - in real app, get from auth or params
const MOCK_PROFESSIONAL_ID = 24;

// Skills data matching your Flutter app
const ALL_SKILLS = [
  // Communication Skills
  'Clear Communication',
  'Active Listening',
  'Professional Language',
  'Multilingual',
  'Client Consultation',
  'Explaining Technical Terms',
  'Phone Etiquette',
  'Written Communication',
  'Non-Verbal Communication',
  'Conflict Resolution',

  // Customer Service Skills
  'Customer Focus',
  'Patience',
  'Empathy',
  'Professional Demeanor',
  'Problem-Solving Attitude',
  'Service Orientation',
  'Client Relationship Management',
  'Customer Satisfaction Focus',
  'Complaint Handling',
  'Follow-up Service',

  // Professionalism
  'Punctuality',
  'Reliability',
  'Professional Appearance',
  'Work Ethic',
  'Integrity',
  'Confidentiality',
  'Respect for Property',
  'Clean Work Habits',
  'Time Management',
  'Accountability',

  // Technical & Problem-Solving Skills
  'Technical Knowledge',
  'Attention to Detail',
  'Analytical Thinking',
  'Troubleshooting',
  'Quality Focus',
  'Safety Consciousness',
  'Precision Work',
  'Technical Adaptability',
  'Equipment Knowledge',
  'Standards Compliance',

  // Teamwork & Collaboration
  'Team Player',
  'Collaboration',
  'Mentoring',
  'Coordination',
  'Interpersonal Skills',
  'Leadership',
  'Supervision',
  'Delegation',
  'Cross-functional Coordination',
  'Conflict Management',

  // Adaptability & Learning
  'Adaptability',
  'Quick Learning',
  'Technology Adoption',
  'Process Improvement',
  'Continuous Learning',
  'Flexibility',
  'Stress Management',
  'Multitasking',
  'Open to Feedback',
  'Innovative Thinking',

  // Business Skills
  'Cost Estimation',
  'Budget Management',
  'Material Planning',
  'Resource Management',
  'Project Management',
  'Documentation',
  'Record Keeping',
  'Quoting Skills',
  'Inventory Management',
  'Quality Control',

  // Safety & Compliance
  'Safety Protocols',
  'Risk Assessment',
  'Emergency Response',
  'Regulatory Compliance',
  'Safety Training',
  'Equipment Safety',
  'Site Safety',
  'First Aid Certified',
  'Environmental Awareness',
  'Hazard Identification',

  // Physical & Personal Skills
  'Physical Stamina',
  'Manual Dexterity',
  'Hand-eye Coordination',
  'Strength',
  'Endurance',
  'Spatial Awareness',
  'Color Vision',
  'Height Work Comfort',
  'Confined Space Work',
  'Weather Tolerance',

  // Digital Literacy
  'Mobile App Usage',
  'Digital Documentation',
  'Online Booking Management',
  'Digital Payments',
  'GPS Navigation',
  'Photo Documentation',
  'Email Communication',
  'Digital Reporting',
  'Online Training',
  'Social Media Professionalism',

  // Specialized Professional Skills
  'Estimation Accuracy',
  'Waste Management',
  'Energy Efficiency',
  'Sustainable Practices',
  'Code Compliance',
  'Permit Knowledge',
  'Inspection Readiness',
  'Warranty Management',
  'Guarantee Provision',
  'After-Sales Service',

  // Language & Cultural Skills
  'Local Language Proficiency',
  'Cultural Sensitivity',
  'Age Group Adaptation',
  'Gender Sensitivity',
  'Disability Awareness',
  'Privacy Respect',
  'Cultural Norms Understanding',
  'Local Regulations Knowledge',
  'Community Engagement',
  'Regional Expertise',

  // Certifications & Qualifications
  'Licensed Professional',
  'Certified Technician',
  'Insurance Coverage',
  'Background Verified',
  'Training Certified',
  'Apprenticeship Completed',
  'Trade School Graduate',
  'Experience Verified',
  'Reference Available',
  'Portfolio Showcase',

  // Personal Attributes
  'Trustworthy',
  'Honest',
  'Dependable',
  'Courteous',
  'Polite',
  'Friendly',
  'Respectful',
  'Patient',
  'Calm Under Pressure',
  'Positive Attitude',

  // Work Methodology
  'Systematic Approach',
  'Efficient Workflow',
  'Quality Assurance',
  'Double-checking',
  'Clean Workspace',
  'Tool Organization',
  'Material Conservation',
  'Waste Reduction',
  'Energy Conservation',
  'Sustainable Methods',

  // Communication Specifics
  'Clear Instructions',
  'Progress Updates',
  'Transparent Pricing',
  'Honest Timelines',
  'Regular Follow-ups',
  'Feedback Acceptance',
  'Question Encouragement',
  'Technical Translation',
  'Visual Demonstrations',
  'Written Confirmations',
];

// Maximum number of skills allowed
const MAX_SKILLS = 10;

// Form validation schema
const skillsFormSchema = z.object({
  newSkill: z.string().optional(),
});

type SkillsFormValues = z.infer<typeof skillsFormSchema>;

export default function ProfessionalSkillsPage() {
  const { locale } = useI18n();
  const {
    profile,
    isLoading,
    error,
    isUpdating,
    fetchProfile,
    patchProfile,
    clearError,
  } = useProfessionalStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [originalSkills, setOriginalSkills] = useState<string[]>([]);
  const [showSkillPicker, setShowSkillPicker] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [filteredSkills, setFilteredSkills] = useState<string[]>(ALL_SKILLS);

  // Initialize form
  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      newSkill: '',
    },
  });

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: locale === 'ne' ? 'त्रुटि' : 'Error',
        description: error,
        variant: 'destructive',
      });
      clearError();
    }
  }, [error]);

useEffect(() => {
  if (profile && profile.skill) {
    // Parse skills from profile - handle multiple separators: comma, slash, and combinations
    const profileSkills = profile.skill

      .split(/[,\/]/)
  
      .map(s => s.trim())
   
      .filter(s => s.length > 0)
  
      .filter((skill, index, array) => array.indexOf(skill) === index);
    
    setSkills(profileSkills);
    setOriginalSkills([...profileSkills]);
  } else {
 
    setSkills([]);
    setOriginalSkills([]);
  }
}, [profile]);

  useEffect(() => {
    // Filter skills based on search query
    if (!skillSearchQuery.trim()) {
      setFilteredSkills(ALL_SKILLS);
    } else {
      setFilteredSkills(
        ALL_SKILLS.filter(skill =>
          skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
        )
      );
    }
  }, [skillSearchQuery]);

  const loadProfile = async () => {
    try {
      await fetchProfile(MOCK_PROFESSIONAL_ID);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleAddSkill = (skill: string) => {
    if (skills.length >= MAX_SKILLS) {
      toast({
        title: locale === 'ne' ? 'सीमा पुग्यो' : 'Limit Reached',
        description: locale === 'ne'
          ? 'तपाईं केवल १० कौशलहरू मात्र थप्न सक्नुहुन्छ'
          : 'You can only add up to 10 skills',
        variant: 'destructive',
      });
      return;
    }

    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    
    setSkillSearchQuery('');
    setShowSkillPicker(false);
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSaveSkills = async () => {
    try {
      // Check if skills have changed
      const hasChanges = JSON.stringify(skills) !== JSON.stringify(originalSkills);
      
      if (!hasChanges) {
        toast({
          title: locale === 'ne' ? 'जानकारी' : 'Info',
          description: locale === 'ne'
            ? 'कुनै परिवर्तनहरू फेला परेन'
            : 'No changes detected',
        });
        return;
      }

      if (skills.length === 0) {
        toast({
          title: locale === 'ne' ? 'चेतावनी' : 'Warning',
          description: locale === 'ne'
            ? 'कृपया कम्तिमा एक कौशल थप्नुहोस्'
            : 'Please add at least one skill',
          variant: 'destructive',
        });
        return;
      }

      // Update profile with new skills
      await patchProfile(MOCK_PROFESSIONAL_ID, {
        skill: skills.join(', '),
      });

      toast({
        title: locale === 'ne' ? 'सफलता' : 'Success',
        description: locale === 'ne'
          ? 'कौशलहरू सफलतापूर्वक बचत गरियो'
          : 'Skills saved successfully',
      });

      setOriginalSkills([...skills]);
    } catch (err) {
      // Error handled by store
    }
  };

  const getSkillCategory = (skill: string) => {
    // You can implement categorization logic here
    // For now, we'll use simple detection
    if (skill.includes('Communication') || skill.includes('Language')) {
      return 'Communication';
    } else if (skill.includes('Customer') || skill.includes('Client')) {
      return 'Customer Service';
    } else if (skill.includes('Professional') || skill.includes('Work Ethic')) {
      return 'Professionalism';
    } else if (skill.includes('Technical') || skill.includes('Troubleshooting')) {
      return 'Technical';
    } else if (skill.includes('Team') || skill.includes('Collaboration')) {
      return 'Teamwork';
    } else if (skill.includes('Safety') || skill.includes('Compliance')) {
      return 'Safety';
    } else {
      return 'Other';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Communication':
        return 'bg-blue-100 text-blue-800';
      case 'Customer Service':
        return 'bg-purple-100 text-purple-800';
      case 'Professionalism':
        return 'bg-green-100 text-green-800';
      case 'Technical':
        return 'bg-orange-100 text-orange-800';
      case 'Teamwork':
        return 'bg-indigo-100 text-indigo-800';
      case 'Safety':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {locale === 'ne' ? 'मेरो कौशलहरू' : 'My Skills'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne'
                ? 'आफ्ना विशेषज्ञता र कौशलहरू व्यवस्थापन गर्नुहोस्'
                : 'Manage your expertise and professional skills'}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={loadProfile}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {locale === 'ne' ? 'ताजा पार्नुहोस्' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current Skills */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Skills Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>
                      {locale === 'ne' ? 'वर्तमान कौशलहरू' : 'Current Skills'}
                    </CardTitle>
                    <CardDescription>
                      {locale === 'ne'
                        ? `तपाईंका विशेषज्ञताहरू (${skills.length}/${MAX_SKILLS})`
                        : `Your expertise (${skills.length}/${MAX_SKILLS})`}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={skills.length > 0 ? "default" : "outline"}>
                  {skills.length} {locale === 'ne' ? 'कौशल' : 'skills'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {locale === 'ne' ? 'कुनै कौशल फेला परेन' : 'No Skills Found'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {locale === 'ne'
                      ? 'कृपया तपाईंका कौशलहरू थप्नुहोस्'
                      : 'Please add your skills to get started'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => {
                      const category = getSkillCategory(skill);
                      return (
                        <div
                          key={index}
                          className="group relative"
                        >
                          <Badge
                            className={`${getCategoryColor(category)} px-4 py-2 rounded-lg border`}
                          >
                            <span className="mr-2">{skill}</span>
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {category}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Skills Progress */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {locale === 'ne' ? 'कौशल सीमा' : 'Skills Limit'}
                      </span>
                      <span className="text-sm">
                        {skills.length}/{MAX_SKILLS}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(skills.length / MAX_SKILLS) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {locale === 'ne'
                        ? `तपाईं ${MAX_SKILLS - skills.length} कौशल थप्न सक्नुहुन्छ`
                        : `You can add ${MAX_SKILLS - skills.length} more skills`}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add New Skill Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>
                    {locale === 'ne' ? 'नयाँ कौशल थप्नुहोस्' : 'Add New Skill'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'ne'
                      ? 'तपाईंका विशेषज्ञताहरू थप्नुहोस्'
                      : 'Add your areas of expertise'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Dialog open={showSkillPicker} onOpenChange={setShowSkillPicker}>
                    <DialogTrigger asChild>
                      <div className="flex-1">
                        <div className="relative">
                          <Input
                            placeholder={
                              skills.length >= MAX_SKILLS
                                ? locale === 'ne'
                                  ? 'कौशल सीमा पुग्यो'
                                  : 'Skill limit reached'
                                : locale === 'ne'
                                ? 'कौशल खोज्नुहोस्...'
                                : 'Search for skills...'
                            }
                            value={skillSearchQuery}
                            onChange={(e) => setSkillSearchQuery(e.target.value)}
                            onClick={() => setShowSkillPicker(true)}
                            readOnly
                            disabled={skills.length >= MAX_SKILLS}
                            className="cursor-pointer"
                          />
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle>
                          {locale === 'ne' ? 'कौशलहरू छान्नुहोस्' : 'Select Skills'}
                        </DialogTitle>
                        <DialogDescription>
                          {locale === 'ne'
                            ? 'तपाईंका विशेषज्ञताका कौशलहरू छान्नुहोस्'
                            : 'Select skills that match your expertise'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder={locale === 'ne' ? 'कौशल खोज्नुहोस्...' : 'Search skills...'}
                          value={skillSearchQuery}
                          onChange={(e) => setSkillSearchQuery(e.target.value)}
                          className="w-full"
                        />
                        <div className="border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                          {filteredSkills.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                              {locale === 'ne' ? 'कुनै कौशल फेला परेन' : 'No skills found'}
                            </div>
                          ) : (
                            <div className="divide-y">
                              {filteredSkills.map((skill) => {
                                const isSelected = skills.includes(skill);
                                const category = getSkillCategory(skill);
                                return (
                                  <button
                                    key={skill}
                                    type="button"
                                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                                      isSelected ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => !isSelected && handleAddSkill(skill)}
                                    disabled={isSelected}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="font-medium">{skill}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                          {category}
                                        </div>
                                      </div>
                                      {isSelected && (
                                        <Check className="w-5 h-5 text-green-600" />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    type="button"
                    onClick={() => setShowSkillPicker(true)}
                    disabled={skills.length >= MAX_SKILLS}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {locale === 'ne' ? 'थप्नुहोस्' : 'Add'}
                  </Button>
                </div>

                {/* Skill Limit Warning */}
                {skills.length >= MAX_SKILLS && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">
                          {locale === 'ne' ? 'कौशल सीमा' : 'Skill Limit Reached'}
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          {locale === 'ne'
                            ? 'तपाईंले अधिकतम १० कौशलहरू मात्र थप्न सक्नुहुन्छ। नयाँ कौशल थप्न पहिला केही हटाउनुहोस्।'
                            : 'You can only add up to 10 skills. Remove some skills to add new ones.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Settings className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle>
                    {locale === 'ne' ? 'कौशल तथ्याङ्क' : 'Skill Statistics'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'ne'
                      ? 'तपाईंका कौशलहरूको विश्लेषण'
                      : 'Analysis of your skills'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {skills.length}
                    </div>
                    <div className="text-sm text-blue-600">
                      {locale === 'ne' ? 'कौशलहरू' : 'Skills'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {MAX_SKILLS - skills.length}
                    </div>
                    <div className="text-sm text-green-600">
                      {locale === 'ne' ? 'थप्न सकिने' : 'Available'}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">
                    {locale === 'ne' ? 'कौशल वर्गहरू' : 'Skill Categories'}
                  </h4>
                  <div className="space-y-2">
                    {Array.from(
                      new Set(skills.map(skill => getSkillCategory(skill)))
                    ).map((category) => {
                      const count = skills.filter(
                        skill => getSkillCategory(skill) === category
                      ).length;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getCategoryColor(category).split(' ')[0]}`} />
                            <span className="text-sm">{category}</span>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Star className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle>
                    {locale === 'ne' ? 'कार्यहरू' : 'Actions'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'ne'
                      ? 'कौशलहरू व्यवस्थापन गर्ने विकल्पहरू'
                      : 'Options to manage your skills'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleSaveSkills}
                disabled={isUpdating || JSON.stringify(skills) === JSON.stringify(originalSkills)}
                className="w-full gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {locale === 'ne' ? 'बचत हुदैछ...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {locale === 'ne' ? 'कौशलहरू बचत गर्नुहोस्' : 'Save Skills'}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setSkills([...originalSkills]);
                  toast({
                    title: locale === 'ne' ? 'रद्द गरियो' : 'Cancelled',
                    description: locale === 'ne'
                      ? 'परिवर्तनहरू रद्द गरियो'
                      : 'Changes cancelled',
                  });
                }}
                disabled={JSON.stringify(skills) === JSON.stringify(originalSkills)}
                className="w-full gap-2"
              >
                <X className="w-4 h-4" />
                {locale === 'ne' ? 'परिवर्तनहरू रद्द गर्नुहोस्' : 'Cancel Changes'}
              </Button>

              {skills.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm(
                      locale === 'ne'
                        ? 'के तपाईं सबै कौशलहरू हटाउन चाहनुहुन्छ?'
                        : 'Are you sure you want to remove all skills?'
                    )) {
                      setSkills([]);
                    }
                  }}
                  className="w-full gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {locale === 'ne' ? 'सबै कौशल हटाउनुहोस्' : 'Remove All Skills'}
                </Button>
              )}

              {/* Tips */}
              <div className="p-4 bg-gray-50 rounded-lg mt-4">
                <h4 className="font-medium mb-2">
                  {locale === 'ne' ? 'सुझावहरू' : 'Tips'}
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <Star className="w-3 h-3 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>
                      {locale === 'ne'
                        ? 'तपाईंको मुख्य कौशलहरू पहिलो राख्नुहोस्'
                        : 'List your most important skills first'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-3 h-3 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>
                      {locale === 'ne'
                        ? 'ग्राहकहरूले खोज्ने कौशलहरू थप्नुहोस्'
                        : 'Add skills that customers are looking for'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-3 h-3 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>
                      {locale === 'ne'
                        ? 'विविध कौशलहरू राख्नुहोस्'
                        : 'Maintain a diverse set of skills'}
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}