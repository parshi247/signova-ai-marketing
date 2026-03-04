import { buildTemplateSignupPath } from "@/const";
import React, { useState, useEffect } from 'react';
import { Link } from "wouter";
import { 
  FileText, Star, Sparkles, Crown, Check, Download, 
  Shield, FileCheck, Briefcase, Users, Handshake, ShoppingCart,
  ArrowRight, Lock, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import MarketingNav from '@/components/MarketingNav';

// Document type definitions
const DEMO_DOCUMENT_TYPES = [
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement (NDA)',
    description: 'Protect confidential information shared between parties',
    icon: Shield,
    color: 'from-indigo-700 to-indigo-900',
    questions: ['parties', 'ndaType', 'infoTypes', 'purpose', 'duration', 'jurisdiction']
  },
  {
    id: 'employment',
    name: 'Employment Contract',
    description: 'Define terms and conditions for hiring employees',
    icon: Briefcase,
    color: 'from-indigo-600 to-indigo-700',
    questions: ['parties', 'position', 'salary', 'startDate', 'benefits', 'jurisdiction']
  },
  {
    id: 'service',
    name: 'Service Agreement',
    description: 'Outline terms for freelancers and service providers',
    icon: FileCheck,
    color: 'from-slate-600 to-slate-700',
    questions: ['parties', 'services', 'payment', 'timeline', 'deliverables', 'jurisdiction']
  },
  {
    id: 'consulting',
    name: 'Consulting Agreement',
    description: 'Define scope and terms for consulting engagements',
    icon: Users,
    color: 'from-indigo-500 to-indigo-600',
    questions: ['parties', 'scope', 'fees', 'duration', 'confidentiality', 'jurisdiction']
  },
  {
    id: 'partnership',
    name: 'Partnership Agreement',
    description: 'Establish terms for business partnerships',
    icon: Handshake,
    color: 'from-slate-500 to-slate-600',
    questions: ['parties', 'contributions', 'profitSharing', 'management', 'dissolution', 'jurisdiction']
  },
  {
    id: 'sales',
    name: 'Sales Contract',
    description: 'Document terms for selling goods or services',
    icon: ShoppingCart,
    color: 'from-indigo-700 to-indigo-800',
    questions: ['parties', 'goods', 'price', 'delivery', 'warranty', 'jurisdiction']
  }
];

// International jurisdictions for governing law selection (165+ countries)
// Grouped by country for the dropdown UI
const JURISDICTIONS = [
  { country: 'United States', divisions: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington D.C.', 'Puerto Rico', 'Guam'] },
  { country: 'Canada', divisions: ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'] },
  { country: 'United Kingdom', divisions: ['England', 'Scotland', 'Wales', 'Northern Ireland'] },
  { country: 'Australia', divisions: ['Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia'] },
  { country: 'New Zealand', divisions: ['New Zealand (National)'] },
  { country: 'Ireland', divisions: ['Ireland (National)'] },
  { country: 'Germany', divisions: ['Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'] },
  { country: 'France', divisions: ['France (National)', 'Alsace', 'Aquitaine', 'Auvergne', 'Brittany', 'Burgundy', 'Centre-Val de Loire', 'Champagne-Ardenne', 'Corsica', 'Franche-Comté', 'Île-de-France', 'Languedoc-Roussillon', 'Limousin', 'Lorraine', 'Midi-Pyrénées', 'Nord-Pas-de-Calais', 'Normandy', 'Pays de la Loire', 'Picardy', 'Poitou-Charentes', 'Provence-Alpes-Cote d\'Azur', 'Rhône-Alpes'] },
  { country: 'Netherlands', divisions: ['Netherlands (National)'] },
  { country: 'Belgium', divisions: ['Belgium (National)', 'Brussels', 'Flanders', 'Wallonia'] },
  { country: 'Switzerland', divisions: ['Switzerland (National)', 'Zurich', 'Geneva', 'Basel', 'Bern', 'Vaud'] },
  { country: 'Austria', divisions: ['Austria (National)', 'Vienna', 'Lower Austria', 'Upper Austria', 'Styria', 'Tyrol', 'Carinthia', 'Salzburg', 'Vorarlberg', 'Burgenland'] },
  { country: 'Spain', divisions: ['Spain (National)', 'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country', 'Canary Islands', 'Cantabria', 'Castile and León', 'Castile-La Mancha', 'Catalonia', 'Extremadura', 'Galicia', 'La Rioja', 'Madrid', 'Murcia', 'Navarre', 'Valencia'] },
  { country: 'Italy', divisions: ['Italy (National)', 'Abruzzo', 'Aosta Valley', 'Apulia', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardy', 'Marche', 'Molise', 'Piedmont', 'Sardinia', 'Sicily', 'Trentino-Alto Adige', 'Tuscany', 'Umbria', 'Veneto'] },
  { country: 'Portugal', divisions: ['Portugal (National)', 'Azores', 'Madeira'] },
  { country: 'Sweden', divisions: ['Sweden (National)'] },
  { country: 'Norway', divisions: ['Norway (National)'] },
  { country: 'Denmark', divisions: ['Denmark (National)'] },
  { country: 'Finland', divisions: ['Finland (National)'] },
  { country: 'Poland', divisions: ['Poland (National)'] },
  { country: 'Czech Republic', divisions: ['Czech Republic (National)'] },
  { country: 'Hungary', divisions: ['Hungary (National)'] },
  { country: 'Romania', divisions: ['Romania (National)'] },
  { country: 'Greece', divisions: ['Greece (National)'] },
  { country: 'India', divisions: ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir'] },
  { country: 'Singapore', divisions: ['Singapore (National)'] },
  { country: 'Hong Kong', divisions: ['Hong Kong (SAR)'] },
  { country: 'Japan', divisions: ['Japan (National)', 'Tokyo', 'Osaka', 'Kyoto', 'Kanagawa', 'Aichi', 'Saitama', 'Chiba', 'Hyogo', 'Fukuoka', 'Hokkaido'] },
  { country: 'South Korea', divisions: ['South Korea (National)', 'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Ulsan', 'Gyeonggi', 'Gangwon', 'North Chungcheong', 'South Chungcheong', 'North Jeolla', 'South Jeolla', 'North Gyeongsang', 'South Gyeongsang', 'Jeju'] },
  { country: 'China', divisions: ['China (National)', 'Beijing', 'Shanghai', 'Guangdong', 'Zhejiang', 'Jiangsu', 'Shandong', 'Sichuan', 'Hubei', 'Hunan', 'Fujian', 'Anhui', 'Liaoning', 'Chongqing', 'Tianjin', 'Shenzhen'] },
  { country: 'Taiwan', divisions: ['Taiwan (National)'] },
  { country: 'Malaysia', divisions: ['Malaysia (National)', 'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Malacca', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'] },
  { country: 'Indonesia', divisions: ['Indonesia (National)', 'Jakarta', 'East Java', 'West Java', 'Central Java', 'Bali', 'North Sumatra', 'South Sumatra', 'East Kalimantan', 'South Sulawesi'] },
  { country: 'Philippines', divisions: ['Philippines (National)', 'Metro Manila', 'Cebu', 'Davao', 'Laguna', 'Cavite', 'Rizal', 'Bulacan', 'Pampanga', 'Batangas', 'Quezon'] },
  { country: 'Thailand', divisions: ['Thailand (National)', 'Bangkok', 'Chiang Mai', 'Phuket', 'Chonburi', 'Nonthaburi', 'Pathum Thani', 'Samut Prakan', 'Khon Kaen', 'Nakhon Ratchasima', 'Songkhla'] },
  { country: 'Vietnam', divisions: ['Vietnam (National)', 'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hai Phong', 'Can Tho', 'Bien Hoa', 'Hue', 'Nha Trang', 'Vung Tau'] },
  { country: 'United Arab Emirates', divisions: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'] },
  { country: 'Saudi Arabia', divisions: ['Saudi Arabia (National)', 'Riyadh', 'Mecca', 'Medina', 'Eastern Province', 'Asir', 'Jizan', 'Najran', 'Al Bahah', 'Northern Borders', 'Jawf', 'Hail', 'Tabuk', 'Qassim'] },
  { country: 'Qatar', divisions: ['Qatar (National)'] },
  { country: 'Kuwait', divisions: ['Kuwait (National)'] },
  { country: 'Bahrain', divisions: ['Bahrain (National)'] },
  { country: 'Oman', divisions: ['Oman (National)'] },
  { country: 'Israel', divisions: ['Israel (National)'] },
  { country: 'Turkey', divisions: ['Turkey (National)', 'Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Kocaeli', 'Mersin'] },
  { country: 'South Africa', divisions: ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'] },
  { country: 'Nigeria', divisions: ['Nigeria (National)', 'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Kaduna', 'Port Harcourt', 'Benin City', 'Maiduguri', 'Zaria', 'Aba'] },
  { country: 'Kenya', divisions: ['Kenya (National)', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega'] },
  { country: 'Ghana', divisions: ['Ghana (National)', 'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta', 'Northern', 'Upper East', 'Upper West', 'Brong-Ahafo'] },
  { country: 'Egypt', divisions: ['Egypt (National)', 'Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Mansoura', 'Tanta', 'Asyut'] },
  { country: 'Morocco', divisions: ['Morocco (National)', 'Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Fès-Meknès', 'Marrakech-Safi', 'Tanger-Tétouan-Al Hoceïma', 'Oriental', 'Souss-Massa', 'Drâa-Tafilalet', 'Béni Mellal-Khénifra', 'Laâyoune-Sakia El Hamra', 'Dakhla-Oued Ed-Dahab', 'Guelmim-Oued Noun'] },
  { country: 'Brazil', divisions: ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'] },
  { country: 'Mexico', divisions: ['Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Mexico City', 'Mexico State', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'] },
  { country: 'Argentina', divisions: ['Buenos Aires', 'Buenos Aires Province', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'] },
  { country: 'Colombia', divisions: ['Colombia (National)', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué'] },
  { country: 'Chile', divisions: ['Chile (National)', 'Arica and Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso', 'Santiago Metropolitan', 'O\'Higgins', 'Maule', 'Ñuble', 'Biobío', 'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'] },
  { country: 'Peru', divisions: ['Peru (National)', 'Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Cusco', 'Chimbote', 'Huancayo', 'Tacna'] },
  { country: 'International / Other', divisions: ['International (General)', 'UNCITRAL Rules', 'ICC Arbitration Rules', 'LCIA Rules', 'Other (specify in agreement)'] },
];

// Flat list of all jurisdictions for backward compatibility
const ALL_JURISDICTIONS = JURISDICTIONS.flatMap(g => g.divisions.map(d => `${g.country}: ${d}`));

export default function Templates() {
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [demoCount, setDemoCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Load demo count from localStorage
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem('signova_demo_count');
      if (savedCount) {
        setDemoCount(parseInt(savedCount, 10));
      }
    } catch (error) {
      console.warn('Failed to load demo count:', error);
    }
  }, []);

  // Handle document type selection
  const handleDocTypeSelect = (docTypeId: string) => {
    if (demoCount >= 2) {
      setShowUpgradeModal(true);
      return;
    }
    setSelectedDocType(docTypeId);
    setShowQuestionnaire(true);
    setCurrentStep(0);
    setFormData({});
    setGeneratedDocument(null);
    setShowResult(false);
  };

  // Get current document type config
  const currentDocType = DEMO_DOCUMENT_TYPES.find(d => d.id === selectedDocType);

  // Questionnaire steps based on document type
  const getQuestionnaireSteps = () => {
    if (!currentDocType) return [];

    const baseSteps = [
      {
        id: 'parties',
        title: 'Party Information',
        description: 'Enter the names of the parties involved',
        fields: [
          { name: 'party1Name', label: 'First Party (Your Name/Company)', type: 'text', required: true },
          { name: 'party1Address', label: 'First Party Address', type: 'text', required: true },
          { name: 'party2Name', label: 'Second Party Name/Company', type: 'text', required: true },
          { name: 'party2Address', label: 'Second Party Address', type: 'text', required: true },
        ]
      },
      {
        id: 'jurisdiction',
        title: 'Governing Law',
        description: 'Select the jurisdiction that will govern this agreement',
        fields: [
          { name: 'jurisdiction', label: 'Jurisdiction / Governing Law', type: 'select', options: ALL_JURISDICTIONS, grouped: true, required: true }
        ]
      }
    ];

    // Add document-specific steps
    switch (currentDocType.id) {
      case 'nda':
        return [
          baseSteps[0],
          {
            id: 'ndaType',
            title: 'NDA Type',
            description: 'What type of NDA do you need?',
            fields: [
              { 
                name: 'ndaType', 
                label: 'Agreement Type', 
                type: 'radio',
                options: [
                  { value: 'mutual', label: 'Mutual NDA - Both parties share confidential information' },
                  { value: 'unilateral', label: 'Unilateral NDA - Only one party shares confidential information' }
                ],
                required: true 
              }
            ]
          },
          {
            id: 'infoTypes',
            title: 'Confidential Information',
            description: 'What types of information will be protected?',
            fields: [
              {
                name: 'infoTypes',
                label: 'Select all that apply',
                type: 'checkbox',
                options: [
                  { value: 'business', label: 'Business strategies and plans' },
                  { value: 'financial', label: 'Financial information' },
                  { value: 'technical', label: 'Technical data and trade secrets' },
                  { value: 'customer', label: 'Customer/client information' },
                  { value: 'product', label: 'Product designs and specifications' }
                ],
                required: true
              }
            ]
          },
          {
            id: 'purpose',
            title: 'Purpose',
            description: 'What is the purpose of sharing this information?',
            fields: [
              {
                name: 'purpose',
                label: 'Purpose of Agreement',
                type: 'radio',
                options: [
                  { value: 'partnership', label: 'Exploring a potential business partnership' },
                  { value: 'employment', label: 'Employment or contractor relationship' },
                  { value: 'acquisition', label: 'Discussing a potential sale or acquisition' },
                  { value: 'investment', label: 'Evaluating an investment opportunity' },
                  { value: 'other', label: 'Other business purposes' }
                ],
                required: true
              }
            ]
          },
          {
            id: 'duration',
            title: 'Duration',
            description: 'How long should the confidentiality obligations last?',
            fields: [
              {
                name: 'duration',
                label: 'Confidentiality Period',
                type: 'radio',
                options: [
                  { value: '1', label: '1 year' },
                  { value: '2', label: '2 years' },
                  { value: '3', label: '3 years' },
                  { value: '5', label: '5 years' },
                  { value: 'indefinite', label: 'Indefinite' }
                ],
                required: true
              }
            ]
          },
          baseSteps[1]
        ];
      
      case 'employment':
        return [
          baseSteps[0],
          {
            id: 'position',
            title: 'Position Details',
            description: 'Enter the job position details',
            fields: [
              { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
              { name: 'department', label: 'Department', type: 'text', required: false },
              { name: 'employmentType', label: 'Employment Type', type: 'radio', options: [
                { value: 'fulltime', label: 'Full-time' },
                { value: 'parttime', label: 'Part-time' },
                { value: 'contract', label: 'Contract' }
              ], required: true }
            ]
          },
          {
            id: 'compensation',
            title: 'Compensation',
            description: 'Enter salary and payment details',
            fields: [
              { name: 'salary', label: 'Annual Salary ($)', type: 'text', required: true },
              { name: 'payFrequency', label: 'Pay Frequency', type: 'select', options: ['Weekly', 'Bi-weekly', 'Semi-monthly', 'Monthly'], required: true }
            ]
          },
          {
            id: 'dates',
            title: 'Employment Dates',
            description: 'When does employment begin?',
            fields: [
              { name: 'startDate', label: 'Start Date', type: 'date', required: true },
              { name: 'probationPeriod', label: 'Probation Period', type: 'select', options: ['None', '30 days', '60 days', '90 days'], required: true }
            ]
          },
          baseSteps[1]
        ];

      case 'service':
        return [
          baseSteps[0],
          {
            id: 'services',
            title: 'Services Description',
            description: 'Describe the services to be provided',
            fields: [
              { name: 'serviceDescription', label: 'Description of Services', type: 'textarea', required: true },
              { name: 'deliverables', label: 'Key Deliverables', type: 'textarea', required: true }
            ]
          },
          {
            id: 'payment',
            title: 'Payment Terms',
            description: 'Enter payment details',
            fields: [
              { name: 'totalAmount', label: 'Total Amount ($)', type: 'text', required: true },
              { name: 'paymentSchedule', label: 'Payment Schedule', type: 'radio', options: [
                { value: 'upfront', label: 'Full payment upfront' },
                { value: 'milestone', label: 'Milestone-based payments' },
                { value: 'completion', label: 'Payment upon completion' },
                { value: 'monthly', label: 'Monthly payments' }
              ], required: true }
            ]
          },
          {
            id: 'timeline',
            title: 'Project Timeline',
            description: 'Set the project dates',
            fields: [
              { name: 'startDate', label: 'Project Start Date', type: 'date', required: true },
              { name: 'endDate', label: 'Expected Completion Date', type: 'date', required: true }
            ]
          },
          baseSteps[1]
        ];

      case 'consulting':
        return [
          baseSteps[0],
          {
            id: 'scope',
            title: 'Consulting Scope',
            description: 'Define the scope of consulting services',
            fields: [
              { name: 'consultingScope', label: 'Scope of Services', type: 'textarea', required: true },
              { name: 'objectives', label: 'Key Objectives', type: 'textarea', required: true }
            ]
          },
          {
            id: 'fees',
            title: 'Fee Structure',
            description: 'Set the consulting fees',
            fields: [
              { name: 'feeType', label: 'Fee Type', type: 'radio', options: [
                { value: 'hourly', label: 'Hourly rate' },
                { value: 'daily', label: 'Daily rate' },
                { value: 'project', label: 'Fixed project fee' },
                { value: 'retainer', label: 'Monthly retainer' }
              ], required: true },
              { name: 'feeAmount', label: 'Fee Amount ($)', type: 'text', required: true }
            ]
          },
          {
            id: 'engagement',
            title: 'Engagement Period',
            description: 'Set the consulting engagement period',
            fields: [
              { name: 'startDate', label: 'Start Date', type: 'date', required: true },
              { name: 'endDate', label: 'End Date (or leave blank for ongoing)', type: 'date', required: false }
            ]
          },
          baseSteps[1]
        ];

      case 'partnership':
        return [
          baseSteps[0],
          {
            id: 'contributions',
            title: 'Partner Contributions',
            description: 'Define each partner\'s contributions',
            fields: [
              { name: 'party1Contribution', label: 'First Partner\'s Contribution', type: 'textarea', required: true },
              { name: 'party2Contribution', label: 'Second Partner\'s Contribution', type: 'textarea', required: true }
            ]
          },
          {
            id: 'profitSharing',
            title: 'Profit & Loss Sharing',
            description: 'How will profits and losses be shared?',
            fields: [
              { name: 'party1Share', label: 'First Partner\'s Share (%)', type: 'text', required: true },
              { name: 'party2Share', label: 'Second Partner\'s Share (%)', type: 'text', required: true }
            ]
          },
          {
            id: 'management',
            title: 'Management Structure',
            description: 'How will the partnership be managed?',
            fields: [
              { name: 'managementStructure', label: 'Management Structure', type: 'radio', options: [
                { value: 'equal', label: 'Equal management rights' },
                { value: 'designated', label: 'Designated managing partner' },
                { value: 'committee', label: 'Management committee' }
              ], required: true }
            ]
          },
          baseSteps[1]
        ];

      case 'sales':
        return [
          baseSteps[0],
          {
            id: 'goods',
            title: 'Goods/Services',
            description: 'Describe what is being sold',
            fields: [
              { name: 'itemDescription', label: 'Description of Goods/Services', type: 'textarea', required: true },
              { name: 'quantity', label: 'Quantity', type: 'text', required: true }
            ]
          },
          {
            id: 'pricing',
            title: 'Pricing',
            description: 'Set the price and payment terms',
            fields: [
              { name: 'totalPrice', label: 'Total Price ($)', type: 'text', required: true },
              { name: 'paymentTerms', label: 'Payment Terms', type: 'radio', options: [
                { value: 'immediate', label: 'Payment due immediately' },
                { value: 'net15', label: 'Net 15 days' },
                { value: 'net30', label: 'Net 30 days' },
                { value: 'net60', label: 'Net 60 days' }
              ], required: true }
            ]
          },
          {
            id: 'delivery',
            title: 'Delivery',
            description: 'Set delivery terms',
            fields: [
              { name: 'deliveryDate', label: 'Delivery Date', type: 'date', required: true },
              { name: 'deliveryMethod', label: 'Delivery Method', type: 'text', required: true },
              { name: 'shippingCost', label: 'Shipping Cost ($)', type: 'text', required: false }
            ]
          },
          baseSteps[1]
        ];

      default:
        return baseSteps;
    }
  };

  const steps = getQuestionnaireSteps();
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Handle form field changes
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (fieldName: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[fieldName] || [];
      if (checked) {
        return { ...prev, [fieldName]: [...currentValues, value] };
      } else {
        return { ...prev, [fieldName]: currentValues.filter((v: string) => v !== value) };
      }
    });
  };

  // Validate current step
  const isStepValid = () => {
    const currentStepData = steps[currentStep];
    if (!currentStepData) return false;

    return currentStepData.fields.every(field => {
      if (!field.required) return true;
      const value = formData[field.name];
      if (field.type === 'checkbox') {
        return value && value.length > 0;
      }
      return value && value.toString().trim() !== '';
    });
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generateDocument();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Generate document
  const generateDocument = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const document = generateDocumentContent();
      setGeneratedDocument(document);
      setIsGenerating(false);
      setShowResult(true);
      
      // Update demo count
      const newCount = demoCount + 1;
      setDemoCount(newCount);
      try {
        localStorage.setItem('signova_demo_count', newCount.toString());
      } catch (error) {
        console.warn('Failed to save demo count:', error);
      }
    }, 3000);
  };

  // Generate document content based on type
  const generateDocumentContent = () => {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    let content = '';
    
    // Add watermark header
    const watermark = `
╔════════════════════════════════════════════════════════════════╗
║                      SIGNOVA DEMO                              ║
║           This is a demo document for preview only             ║
║        Subscribe to remove watermark and enable signing        ║
╚════════════════════════════════════════════════════════════════╝

`;

    switch (selectedDocType) {
      case 'nda':
        content = generateNDAContent(date);
        break;
      case 'employment':
        content = generateEmploymentContent(date);
        break;
      case 'service':
        content = generateServiceContent(date);
        break;
      case 'consulting':
        content = generateConsultingContent(date);
        break;
      case 'partnership':
        content = generatePartnershipContent(date);
        break;
      case 'sales':
        content = generateSalesContent(date);
        break;
      default:
        content = 'Document type not supported';
    }

    return watermark + content + `

═══════════════════════════════════════════════════════════════════
                         SIGNOVA DEMO
    Generated by Signova AI - Professional Document Platform
         Subscribe to download, edit, and e-sign documents
═══════════════════════════════════════════════════════════════════`;
  };

  // Generate NDA content
  const generateNDAContent = (date: string) => {
    const infoTypesText = (formData.infoTypes || []).map((type: string) => {
      const labels: Record<string, string> = {
        business: 'business strategies and plans',
        financial: 'financial information',
        technical: 'technical data and trade secrets',
        customer: 'customer/client information',
        product: 'product designs and specifications'
      };
      return labels[type] || type;
    }).join(', ');

    const purposeText: Record<string, string> = {
      partnership: 'exploring a potential business partnership',
      employment: 'employment or contractor relationship',
      acquisition: 'discussing a potential sale or acquisition',
      investment: 'evaluating an investment opportunity',
      other: 'business purposes'
    };

    const durationText = formData.duration === 'indefinite' 
      ? 'indefinitely' 
      : `for a period of ${formData.duration} year${formData.duration === '1' ? '' : 's'}`;

    return `
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of ${date} by and between:

FIRST PARTY: ${formData.party1Name}
Address: ${formData.party1Address}

SECOND PARTY: ${formData.party2Name}
Address: ${formData.party2Address}

${formData.ndaType === 'mutual' ? 'This is a MUTUAL Non-Disclosure Agreement where both parties may disclose and receive confidential information.' : 'This is a UNILATERAL Non-Disclosure Agreement where the First Party discloses confidential information to the Second Party.'}

1. PURPOSE
The parties wish to explore ${purposeText[formData.purpose] || 'a business relationship'} and in connection with this purpose, confidential and proprietary information may be disclosed.

2. CONFIDENTIAL INFORMATION
For purposes of this Agreement, "Confidential Information" includes, but is not limited to: ${infoTypesText || 'all proprietary information'}.

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to:
a) Hold and maintain the Confidential Information in strict confidence
b) Not disclose the Confidential Information to any third parties without prior written consent
c) Use the Confidential Information solely for the purpose stated above
d) Protect the Confidential Information with the same degree of care used to protect its own confidential information

4. TERM
The obligations of confidentiality shall remain in effect ${durationText} from the date of disclosure.

5. RETURN OF MATERIALS
Upon termination of discussions or upon request, the Receiving Party shall return or destroy all Confidential Information and any copies thereof.

6. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of ${formData.jurisdiction?.includes(':') ? formData.jurisdiction.split(':')[1].trim() + ', ' + formData.jurisdiction.split(':')[0].trim() : formData.jurisdiction}, without regard to its conflict of law provisions.

7. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties concerning the subject matter hereof.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

_________________________________
${formData.party1Name}
Signature
Date: _________________

_________________________________
${formData.party2Name}
Signature
Date: _________________`;
  };

  // Generate Employment Contract content
  const generateEmploymentContent = (date: string) => {
    const employmentTypeText: Record<string, string> = {
      fulltime: 'full-time',
      parttime: 'part-time',
      contract: 'contract'
    };

    return `
EMPLOYMENT CONTRACT

This Employment Contract ("Agreement") is entered into as of ${date} by and between:

EMPLOYER: ${formData.party1Name}
Address: ${formData.party1Address}

EMPLOYEE: ${formData.party2Name}
Address: ${formData.party2Address}

1. POSITION
The Employer hereby employs the Employee as ${formData.jobTitle}${formData.department ? ` in the ${formData.department} department` : ''}.
Employment Type: ${employmentTypeText[formData.employmentType] || formData.employmentType}

2. COMPENSATION
Annual Salary: $${formData.salary}
Pay Frequency: ${formData.payFrequency}

3. START DATE
Employment shall commence on ${formData.startDate}.
${formData.probationPeriod !== 'None' ? `Probationary Period: ${formData.probationPeriod}` : ''}

4. DUTIES AND RESPONSIBILITIES
The Employee agrees to perform all duties and responsibilities associated with the position of ${formData.jobTitle} to the best of their abilities.

5. CONFIDENTIALITY
The Employee agrees to maintain the confidentiality of all proprietary information and trade secrets of the Employer.

6. TERMINATION
Either party may terminate this Agreement with appropriate notice as required by law.

7. GOVERNING LAW
This Agreement shall be governed by the laws of ${formData.jurisdiction?.includes(':') ? formData.jurisdiction.split(':')[1].trim() + ', ' + formData.jurisdiction.split(':')[0].trim() : formData.jurisdiction}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

_________________________________
${formData.party1Name} (Employer)
Signature
Date: _________________

_________________________________
${formData.party2Name} (Employee)
Signature
Date: _________________`;
  };

  // Generate Service Agreement content
  const generateServiceContent = (date: string) => {
    const paymentScheduleText: Record<string, string> = {
      upfront: 'Full payment is due upon execution of this Agreement',
      milestone: 'Payment shall be made upon completion of agreed milestones',
      completion: 'Payment is due upon satisfactory completion of all services',
      monthly: 'Payment shall be made on a monthly basis'
    };

    return `
SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of ${date} by and between:

CLIENT: ${formData.party1Name}
Address: ${formData.party1Address}

SERVICE PROVIDER: ${formData.party2Name}
Address: ${formData.party2Address}

1. SERVICES
The Service Provider agrees to provide the following services:
${formData.serviceDescription}

2. DELIVERABLES
Key deliverables include:
${formData.deliverables}

3. COMPENSATION
Total Amount: $${formData.totalAmount}
Payment Terms: ${paymentScheduleText[formData.paymentSchedule] || formData.paymentSchedule}

4. TIMELINE
Project Start Date: ${formData.startDate}
Expected Completion Date: ${formData.endDate}

5. INDEPENDENT CONTRACTOR
The Service Provider is an independent contractor and not an employee of the Client.

6. CONFIDENTIALITY
Both parties agree to maintain the confidentiality of any proprietary information shared during the engagement.

7. GOVERNING LAW
This Agreement shall be governed by the laws of ${formData.jurisdiction?.includes(':') ? formData.jurisdiction.split(':')[1].trim() + ', ' + formData.jurisdiction.split(':')[0].trim() : formData.jurisdiction}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

_________________________________
${formData.party1Name} (Client)
Signature
Date: _________________

_________________________________
${formData.party2Name} (Service Provider)
Signature
Date: _________________`;
  };

  // Generate Consulting Agreement content
  const generateConsultingContent = (date: string) => {
    const feeTypeText: Record<string, string> = {
      hourly: 'hourly rate',
      daily: 'daily rate',
      project: 'fixed project fee',
      retainer: 'monthly retainer'
    };

    return `
CONSULTING AGREEMENT

This Consulting Agreement ("Agreement") is entered into as of ${date} by and between:

CLIENT: ${formData.party1Name}
Address: ${formData.party1Address}

CONSULTANT: ${formData.party2Name}
Address: ${formData.party2Address}

1. SCOPE OF SERVICES
The Consultant agrees to provide consulting services as follows:
${formData.consultingScope}

2. OBJECTIVES
Key objectives of this engagement:
${formData.objectives}

3. COMPENSATION
Fee Structure: ${feeTypeText[formData.feeType] || formData.feeType}
Amount: $${formData.feeAmount}

4. TERM
Start Date: ${formData.startDate}
${formData.endDate ? `End Date: ${formData.endDate}` : 'This is an ongoing engagement until terminated by either party.'}

5. INDEPENDENT CONTRACTOR
The Consultant is an independent contractor and not an employee of the Client.

6. CONFIDENTIALITY
The Consultant agrees to maintain strict confidentiality regarding all Client information.

7. GOVERNING LAW
This Agreement shall be governed by the laws of ${formData.jurisdiction?.includes(':') ? formData.jurisdiction.split(':')[1].trim() + ', ' + formData.jurisdiction.split(':')[0].trim() : formData.jurisdiction}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

_________________________________
${formData.party1Name} (Client)
Signature
Date: _________________

_________________________________
${formData.party2Name} (Consultant)
Signature
Date: _________________`;
  };

  // Generate Partnership Agreement content
  const generatePartnershipContent = (date: string) => {
    const managementText: Record<string, string> = {
      equal: 'Both partners shall have equal management rights and responsibilities',
      designated: 'One partner shall be designated as the managing partner',
      committee: 'A management committee shall oversee partnership operations'
    };

    return `
PARTNERSHIP AGREEMENT

This Partnership Agreement ("Agreement") is entered into as of ${date} by and between:

FIRST PARTNER: ${formData.party1Name}
Address: ${formData.party1Address}

SECOND PARTNER: ${formData.party2Name}
Address: ${formData.party2Address}

1. PARTNERSHIP NAME AND PURPOSE
The partners hereby form a partnership for the purpose of conducting business together.

2. CONTRIBUTIONS
First Partner's Contribution:
${formData.party1Contribution}

Second Partner's Contribution:
${formData.party2Contribution}

3. PROFIT AND LOSS SHARING
First Partner's Share: ${formData.party1Share}%
Second Partner's Share: ${formData.party2Share}%

4. MANAGEMENT
${managementText[formData.managementStructure] || 'Partners shall jointly manage the partnership.'}

5. TERM
This partnership shall continue until dissolved by mutual agreement or as otherwise provided herein.

6. DISSOLUTION
Upon dissolution, partnership assets shall be distributed according to each partner's share after payment of all debts and obligations.

7. GOVERNING LAW
This Agreement shall be governed by the laws of ${formData.jurisdiction?.includes(':') ? formData.jurisdiction.split(':')[1].trim() + ', ' + formData.jurisdiction.split(':')[0].trim() : formData.jurisdiction}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

_________________________________
${formData.party1Name}
Signature
Date: _________________

_________________________________
${formData.party2Name}
Signature
Date: _________________`;
  };

  // Generate Sales Contract content
  const generateSalesContent = (date: string) => {
    const paymentTermsText: Record<string, string> = {
      immediate: 'Payment is due immediately upon execution of this Agreement',
      net15: 'Payment is due within 15 days of invoice date',
      net30: 'Payment is due within 30 days of invoice date',
      net60: 'Payment is due within 60 days of invoice date'
    };

    return `
SALES CONTRACT

This Sales Contract ("Agreement") is entered into as of ${date} by and between:

SELLER: ${formData.party1Name}
Address: ${formData.party1Address}

BUYER: ${formData.party2Name}
Address: ${formData.party2Address}

1. GOODS/SERVICES
Description: ${formData.itemDescription}
Quantity: ${formData.quantity}

2. PRICE
Total Price: $${formData.totalPrice}
${formData.shippingCost ? `Shipping Cost: $${formData.shippingCost}` : 'Shipping: Included in price'}

3. PAYMENT TERMS
${paymentTermsText[formData.paymentTerms] || formData.paymentTerms}

4. DELIVERY
Delivery Date: ${formData.deliveryDate}
Delivery Method: ${formData.deliveryMethod}

5. WARRANTY
The Seller warrants that the goods/services shall be free from defects and conform to the description provided.

6. RISK OF LOSS
Risk of loss shall pass to the Buyer upon delivery.

7. GOVERNING LAW
This Agreement shall be governed by the laws of ${formData.jurisdiction?.includes(':') ? formData.jurisdiction.split(':')[1].trim() + ', ' + formData.jurisdiction.split(':')[0].trim() : formData.jurisdiction}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

_________________________________
${formData.party1Name} (Seller)
Signature
Date: _________________

_________________________________
${formData.party2Name} (Buyer)
Signature
Date: _________________`;
  };

  // Handle download
  const handleDownload = () => {
    if (!generatedDocument) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedDocument], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedDocType}-agreement-demo.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Close questionnaire
  const handleCloseQuestionnaire = () => {
    setShowQuestionnaire(false);
    setSelectedDocType(null);
    setCurrentStep(0);
    setFormData({});
    setGeneratedDocument(null);
    setShowResult(false);
  };

  // Render field based on type
  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            className="mt-1"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            className="mt-1"
            rows={4}
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="mt-1"
          />
        );
      
      case 'select':
        return (
          <Select
            value={formData[field.name] || ''}
            onValueChange={(value) => handleFieldChange(field.name, value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-y-auto">
              {field.grouped
                ? JURISDICTIONS.map((group: any) => (
                    <React.Fragment key={group.country}>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 sticky top-0 z-10">
                        {group.country}
                      </div>
                      {group.divisions.map((division: string) => (
                        <SelectItem
                          key={`${group.country}-${division}`}
                          value={`${group.country}: ${division}`}
                          className="pl-4"
                        >
                          {division}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))
                : (field.options || []).map((option: string) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))
              }
            </SelectContent>
          </Select>
        );
      
      case 'radio':
        return (
          <RadioGroup
            value={formData[field.name] || ''}
            onValueChange={(value) => handleFieldChange(field.name, value)}
            className="mt-2 space-y-2"
          >
            {field.options.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                <Label htmlFor={`${field.name}-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'checkbox':
        return (
          <div className="mt-2 space-y-2">
            {field.options.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.name}-${option.value}`}
                  checked={(formData[field.name] || []).includes(option.value)}
                  onCheckedChange={(checked) => handleCheckboxChange(field.name, option.value, checked as boolean)}
                />
                <Label htmlFor={`${field.name}-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-white to-blue-50">
      <MarketingNav />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            Try 2 Free Document Demos
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-700 to-indigo-900 bg-clip-text text-transparent">
            AI-Powered Document Templates
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Generate legally compliant documents in seconds. Select a document type below to get started.
          </p>
          {demoCount > 0 && demoCount < 2 && (
            <p className="text-sm text-orange-600 font-medium">
              {2 - demoCount} free demo{2 - demoCount !== 1 ? 's' : ''} remaining
            </p>
          )}
          {demoCount >= 2 && (
            <p className="text-sm text-red-600 font-medium">
              You've used all free demos. Subscribe to continue generating documents.
            </p>
          )}
        </div>

        {/* Document Type Cards */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Select a Document Type to Generate
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_DOCUMENT_TYPES.map((docType) => {
              const Icon = docType.icon;
              return (
                <Card 
                  key={docType.id}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${demoCount >= 2 ? 'opacity-60' : ''}`}
                  onClick={() => handleDocTypeSelect(docType.id)}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${docType.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{docType.name}</CardTitle>
                    <CardDescription>{docType.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className={`w-full bg-gradient-to-r ${docType.color} hover:opacity-90`}
                      onClick={(e) => {
                        if (demoCount >= 2) {
                          e.stopPropagation();
                          window.location.href = buildTemplateSignupPath(docType.id);
                        }
                      }}
                    >
                      {demoCount >= 2 ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Subscribe to Access
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Document
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-indigo-600">6</CardTitle>
              <CardDescription>Document Types</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">NDA, Employment, Service, Consulting, Partnership, Sales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-blue-600">All</CardTitle>
              <CardDescription>Industries Covered</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">Legal, Healthcare, Real Estate, Finance, HR, Tech, and more</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-green-600">165+</CardTitle>
              <CardDescription>Jurisdictions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">US, Canada, UK, EU, Australia & 160+ countries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-orange-600">60s</CardTitle>
              <CardDescription>Avg. Generation Time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">Legally compliant, professionally formatted</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-indigo-700 to-indigo-900 text-white border-0">
            <CardContent className="pt-12 pb-12">
              <Crown className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-4xl font-bold mb-4">Ready to Go Pro?</h2>
              <p className="text-xl mb-8 opacity-90">
                Unlock unlimited document generation, e-signatures, and more
              </p>
              <Link href="/register?plan=professional">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                  <Star className="w-5 h-5 mr-2" />
                  Subscribe Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Questionnaire Dialog */}
      <Dialog open={showQuestionnaire} onOpenChange={handleCloseQuestionnaire}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {!showResult ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {currentDocType && (
                    <>
                      <currentDocType.icon className="w-5 h-5" />
                      {currentDocType.name}
                    </>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Step {currentStep + 1} of {totalSteps}
                </DialogDescription>
              </DialogHeader>

              <Progress value={progress} className="mb-6" />

              {isGenerating ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-lg font-medium text-gray-700">Generating your document...</p>
                  <p className="text-sm text-gray-500 mt-2">This usually takes a few seconds</p>
                </div>
              ) : (
                <>
                  {steps[currentStep] && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
                        <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
                      </div>

                      <div className="space-y-4">
                        {steps[currentStep].fields.map((field: any) => (
                          <div key={field.name}>
                            <Label className="font-medium">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            {renderField(field)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="bg-gradient-to-r from-indigo-700 to-indigo-900"
                    >
                      {currentStep === totalSteps - 1 ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Document
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  Document Generated!
                </DialogTitle>
                <DialogDescription>
                  Your {currentDocType?.name} has been generated. This is a demo version with watermark.
                </DialogDescription>
              </DialogHeader>

              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {generatedDocument}
                </pre>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <Button onClick={handleDownload} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Demo (TXT)
                </Button>
                <Link href="/register?plan=professional">
                  <Button className="w-full bg-gradient-to-r from-indigo-700 to-indigo-900">
                    <Star className="w-4 h-4 mr-2" />
                    Subscribe to Remove Watermark & Enable E-Signing
                  </Button>
                </Link>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-800">Demo Limitations</p>
                    <ul className="text-sm text-orange-700 mt-1 space-y-1">
                      <li>• Watermark on all pages</li>
                      <li>• Text format only (no PDF)</li>
                      <li>• No e-signature capability</li>
                      <li>• {2 - demoCount} demo{2 - demoCount !== 1 ? 's' : ''} remaining</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              Demo Limit Reached
            </DialogTitle>
            <DialogDescription>
              You've used all 2 free document demos. Subscribe to continue generating documents.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="bg-indigo-50 rounded-lg p-4">
              <h4 className="font-semibold text-indigo-900 mb-2">Pro Plan Includes:</h4>
              <ul className="space-y-2 text-sm text-indigo-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Unlimited document generation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  No watermarks
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  PDF export
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  E-signature capability
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  All 165+ international jurisdictions
                </li>
              </ul>
            </div>

            <Link href="/register?plan=professional">
              <Button className="w-full bg-gradient-to-r from-indigo-700 to-indigo-900">
                <Star className="w-4 h-4 mr-2" />
                Subscribe Now - Starting at $19/month
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
