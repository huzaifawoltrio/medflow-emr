// components/clinical-notes/DynamicFormRenderer.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define template structure
interface NoteTemplate {
  id: number;
  name: string;
  description: string;
  schema: {
    sections: {
      title: string;
      fields: {
        name: string;
        label: string;
        type: string;
        required?: boolean;
        placeholder?: string;
        rows?: number;
        options?: { value: string; label: string }[];
        fields?: {
          name: string;
          label: string;
          type: string;
          required?: boolean;
          placeholder?: string;
        }[];
      }[];
    }[];
  };
}

// Define note types (categories)
export const NOTE_TYPES = [
  {
    id: "initial-psychiatric-evaluation",
    name: "Initial Psychiatric Evaluation",
  },
  { id: "progress-note", name: "Progress Note" },
  { id: "biopsychosocial-assessment", name: "Biopsychosocial Assessment" },
  { id: "risk-assessment", name: "Risk Assessment" },
  { id: "treatment-plan", name: "Treatment Plan" },
  { id: "therapy-session", name: "Therapy Session" },
  { id: "case-management", name: "Case Management" },
  { id: "discharge-summary", name: "Discharge Summary" },
  { id: "medication-review", name: "Medication Review" },
  { id: "crisis-intervention", name: "Crisis Intervention" },
];

// Define note templates (structures)
export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: 1,
    name: "SOAP Note",
    description: "Subjective, Objective, Assessment, Plan format",
    schema: {
      sections: [
        {
          title: "Subjective",
          fields: [
            {
              name: "chief_complaint",
              label: "Chief Complaint",
              type: "textarea",
              required: true,
              placeholder: "Patient's primary concern in their own words",
              rows: 3,
            },
            {
              name: "history_present_illness",
              label: "History of Present Illness",
              type: "textarea",
              placeholder:
                "Details about current symptoms and their progression",
              rows: 4,
            },
            {
              name: "review_of_systems",
              label: "Review of Systems",
              type: "textarea",
              placeholder: "Systematic review of symptoms by body system",
              rows: 3,
            },
          ],
        },
        {
          title: "Objective",
          fields: [
            {
              name: "vital_signs",
              label: "Vital Signs",
              type: "textarea",
              placeholder: "Blood pressure, heart rate, temperature, etc.",
              rows: 2,
            },
            {
              name: "mental_status_exam",
              label: "Mental Status Examination",
              type: "textarea",
              placeholder:
                "Appearance, behavior, mood, affect, speech, thought process, etc.",
              rows: 4,
            },
            {
              name: "physical_exam",
              label: "Physical Examination",
              type: "textarea",
              placeholder: "Relevant physical examination findings",
              rows: 3,
            },
          ],
        },
        {
          title: "Assessment",
          fields: [
            {
              name: "diagnostic_impression",
              label: "Diagnostic Impression",
              type: "textarea",
              required: true,
              placeholder: "Primary and differential diagnoses",
              rows: 3,
            },
            {
              name: "clinical_reasoning",
              label: "Clinical Reasoning",
              type: "textarea",
              placeholder: "Rationale for diagnoses and treatment decisions",
              rows: 3,
            },
          ],
        },
        {
          title: "Plan",
          fields: [
            {
              name: "treatment_plan",
              label: "Treatment Plan",
              type: "textarea",
              required: true,
              placeholder: "Medications, therapy, referrals, follow-up",
              rows: 4,
            },
          ],
        },
      ],
    },
  },
  {
    id: 2,
    name: "Free Text",
    description: "Open-ended narrative format",
    schema: {
      sections: [
        {
          title: "Clinical Note",
          fields: [
            {
              name: "note_content",
              label: "Note Content",
              type: "textarea",
              required: true,
              placeholder: "Write your clinical note here...",
              rows: 15,
            },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    name: "Agbimson IPE Template",
    description: "Comprehensive initial psychiatric evaluation format",
    schema: {
      sections: [
        {
          title: "Chief Complaint",
          fields: [
            {
              name: "chief_complaint",
              label: "Chief Complaint",
              type: "textarea",
              required: true,
              placeholder: "In one sentence, tell me why you are here",
              rows: 3,
            },
          ],
        },
        {
          title: "History of Present Illness",
          fields: [
            {
              name: "onset",
              label: "Onset",
              type: "textarea",
              placeholder: "When did symptoms begin?",
              rows: 2,
            },
            {
              name: "duration",
              label: "Duration",
              type: "textarea",
              placeholder: "How long have symptoms persisted?",
              rows: 2,
            },
            {
              name: "severity",
              label: "Severity",
              type: "textarea",
              placeholder: "How severe are the symptoms?",
              rows: 2,
            },
            {
              name: "course",
              label: "Course",
              type: "textarea",
              placeholder: "Pattern of symptoms over time",
              rows: 2,
            },
            {
              name: "precipitating_factors",
              label: "Precipitating Factors",
              type: "textarea",
              placeholder: "What triggers or worsens symptoms?",
              rows: 2,
            },
            {
              name: "associated_symptoms",
              label: "Associated Symptoms",
              type: "textarea",
              placeholder: "Other symptoms that occur with primary complaint",
              rows: 2,
            },
            {
              name: "treatment_history",
              label: "Treatment History",
              type: "textarea",
              placeholder: "Previous treatments and their effectiveness",
              rows: 2,
            },
          ],
        },
        {
          title: "Review of Systems",
          fields: [
            {
              name: "psychiatric_ros",
              label: "Psychiatric",
              type: "textarea",
              placeholder:
                "Mood, anxiety, sleep, appetite, energy, concentration, etc.",
              rows: 3,
            },
            {
              name: "medical_ros",
              label: "Medical",
              type: "textarea",
              placeholder:
                "Constitutional, cardiovascular, respiratory, neurological, etc.",
              rows: 3,
            },
          ],
        },
        {
          title: "Family History",
          fields: [
            {
              name: "psychiatric_history",
              label: "Psychiatric History",
              type: "textarea",
              placeholder: "Family history of mental health conditions",
              rows: 3,
            },
            {
              name: "medical_history",
              label: "Medical History",
              type: "textarea",
              placeholder: "Family history of medical conditions",
              rows: 3,
            },
          ],
        },
        {
          title: "Medical History",
          fields: [
            {
              name: "past_psychiatric_history",
              label: "Past Psychiatric History",
              type: "textarea",
              placeholder: "Previous diagnoses, hospitalizations, treatments",
              rows: 3,
            },
            {
              name: "past_medical_history",
              label: "Past Medical History",
              type: "textarea",
              placeholder:
                "Chronic illnesses, surgeries, significant conditions",
              rows: 3,
            },
            {
              name: "medications",
              label: "Current Medications",
              type: "textarea",
              placeholder: "List all current medications and dosages",
              rows: 3,
            },
            {
              name: "allergies",
              label: "Allergies",
              type: "textarea",
              placeholder: "Known allergies and reactions",
              rows: 2,
            },
          ],
        },
        {
          title: "Social History",
          fields: [
            {
              name: "living_situation",
              label: "Living Situation",
              type: "textarea",
              placeholder: "Current living arrangement and support system",
              rows: 2,
            },
            {
              name: "occupation",
              label: "Occupation",
              type: "textarea",
              placeholder: "Current work and job satisfaction",
              rows: 2,
            },
            {
              name: "relationships",
              label: "Relationships",
              type: "textarea",
              placeholder: "Family and social relationships",
              rows: 2,
            },
            {
              name: "substance_use",
              label: "Substance Use",
              type: "textarea",
              placeholder: "Alcohol, tobacco, recreational drugs",
              rows: 2,
            },
          ],
        },
        {
          title: "Trauma History",
          fields: [
            {
              name: "trauma_history",
              label: "Trauma History",
              type: "textarea",
              placeholder: "History of physical, emotional, or sexual trauma",
              rows: 3,
            },
          ],
        },
        {
          title: "Mental Status Examination",
          fields: [
            {
              name: "appearance_behavior",
              label: "Appearance & Behavior",
              type: "textarea",
              placeholder: "General appearance, motor activity, eye contact",
              rows: 2,
            },
            {
              name: "mood_affect",
              label: "Mood & Affect",
              type: "textarea",
              placeholder: "Subjective mood and objective affect",
              rows: 2,
            },
            {
              name: "speech",
              label: "Speech",
              type: "textarea",
              placeholder: "Rate, volume, coherence",
              rows: 2,
            },
            {
              name: "thought_process",
              label: "Thought Process",
              type: "textarea",
              placeholder: "Logical flow, coherence, organization",
              rows: 2,
            },
            {
              name: "thought_content",
              label: "Thought Content",
              type: "textarea",
              placeholder: "Delusions, obsessions, preoccupations",
              rows: 2,
            },
            {
              name: "perception",
              label: "Perception",
              type: "textarea",
              placeholder: "Hallucinations, illusions",
              rows: 2,
            },
            {
              name: "cognition",
              label: "Cognition",
              type: "textarea",
              placeholder: "Orientation, memory, attention, insight, judgment",
              rows: 2,
            },
            {
              name: "suicidality",
              label: "Suicidality",
              type: "textarea",
              placeholder: "Ideation, intent, plan, means, protective factors",
              rows: 2,
            },
            {
              name: "homicidality",
              label: "Homicidality",
              type: "textarea",
              placeholder: "Ideation, intent, plan, means, protective factors",
              rows: 2,
            },
          ],
        },
        {
          title: "Assessment",
          fields: [
            {
              name: "diagnostic_impression",
              label: "Diagnostic Impression",
              type: "textarea",
              required: true,
              placeholder:
                "Primary and secondary diagnoses with supporting rationale",
              rows: 4,
            },
            {
              name: "risk_assessment",
              label: "Risk Assessment",
              type: "textarea",
              placeholder: "Suicide, homicide, harm to self or others",
              rows: 3,
            },
          ],
        },
        {
          title: "Plan",
          fields: [
            {
              name: "treatment_plan",
              label: "Treatment Plan",
              type: "textarea",
              required: true,
              placeholder:
                "Psychotherapy, pharmacotherapy, referrals, follow-up",
              rows: 4,
            },
          ],
        },
      ],
    },
  },
  {
    id: 4,
    name: "Risk Assessment Template",
    description: "Comprehensive risk evaluation format",
    schema: {
      sections: [
        {
          title: "Suicide Risk Assessment",
          fields: [
            {
              name: "suicidal_ideation",
              label: "Suicidal Ideation",
              type: "textarea",
              placeholder:
                "Presence, frequency, intensity, duration of suicidal thoughts",
              rows: 3,
            },
            {
              name: "suicide_plan",
              label: "Suicide Plan",
              type: "textarea",
              placeholder:
                "Specificity of plan, lethality of means, access to means",
              rows: 3,
            },
            {
              name: "suicide_intent",
              label: "Suicide Intent",
              type: "textarea",
              placeholder:
                "Strength of intent, reasons for living, ambivalence",
              rows: 3,
            },
            {
              name: "protective_factors",
              label: "Protective Factors",
              type: "textarea",
              placeholder:
                "Support system, reasons for living, coping skills, spirituality",
              rows: 3,
            },
          ],
        },
        {
          title: "Overall Risk Assessment",
          fields: [
            {
              name: "risk_level",
              label: "Risk Level",
              type: "select",
              required: true,
              options: [
                { value: "low", label: "Low Risk" },
                { value: "moderate", label: "Moderate Risk" },
                { value: "high", label: "High Risk" },
                { value: "extreme", label: "Extreme Risk" },
              ],
            },
            {
              name: "safety_plan",
              label: "Safety Plan",
              type: "textarea",
              required: true,
              placeholder:
                "Immediate safety measures, emergency contacts, crisis interventions",
              rows: 4,
            },
          ],
        },
      ],
    },
  },
];

interface DynamicFormRendererProps {
  noteType: string | null;
  template: NoteTemplate | null;
  formData: Record<string, any>;
  onNoteTypeChange: (noteType: string) => void;
  onTemplateChange: (template: NoteTemplate) => void;
  setFormData: (data: Record<string, any>) => void;
  errors?: Record<string, string>;
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  noteType,
  template,
  formData,
  onNoteTypeChange,
  onTemplateChange,
  setFormData,
  errors = {},
}) => {
  const handleFieldChange = (
    fieldName: string,
    value: any,
    parentField?: string
  ) => {
    const newFormData = { ...formData };

    if (parentField) {
      // Handle nested object fields
      if (!newFormData[parentField]) {
        newFormData[parentField] = {};
      }
      newFormData[parentField][fieldName] = value;
    } else {
      newFormData[fieldName] = value;
    }

    setFormData(newFormData);
  };

  const getFieldValue = (fieldName: string, parentField?: string) => {
    if (parentField) {
      return formData[parentField]?.[fieldName] || "";
    }
    return formData[fieldName] || "";
  };

  const renderField = (field: any, parentField?: string) => {
    const fieldKey = parentField ? `${parentField}.${field.name}` : field.name;
    const fieldError = errors[fieldKey];
    const fieldValue = getFieldValue(field.name, parentField);

    switch (field.type) {
      case "text":
        return (
          <div key={fieldKey} className="space-y-2">
            <Label
              htmlFor={fieldKey}
              className={`text-sm font-medium ${
                field.required ? 'after:content-["*"] after:text-red-500' : ""
              }`}
            >
              {field.label}
            </Label>
            <Input
              id={fieldKey}
              type="text"
              value={fieldValue}
              onChange={(e) =>
                handleFieldChange(field.name, e.target.value, parentField)
              }
              placeholder={field.placeholder || ""}
              className={fieldError ? "border-red-500" : ""}
            />
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        );

      case "textarea":
        return (
          <div key={fieldKey} className="space-y-2">
            <Label
              htmlFor={fieldKey}
              className={`text-sm font-medium ${
                field.required ? 'after:content-["*"] after:text-red-500' : ""
              }`}
            >
              {field.label}
            </Label>
            <Textarea
              id={fieldKey}
              value={fieldValue}
              onChange={(e) =>
                handleFieldChange(field.name, e.target.value, parentField)
              }
              placeholder={field.placeholder || ""}
              rows={field.rows || 3}
              className={fieldError ? "border-red-500" : ""}
            />
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        );

      case "number":
        return (
          <div key={fieldKey} className="space-y-2">
            <Label
              htmlFor={fieldKey}
              className={`text-sm font-medium ${
                field.required ? 'after:content-["*"] after:text-red-500' : ""
              }`}
            >
              {field.label}
            </Label>
            <Input
              id={fieldKey}
              type="number"
              value={fieldValue}
              onChange={(e) =>
                handleFieldChange(field.name, e.target.value, parentField)
              }
              placeholder={field.placeholder || ""}
              className={fieldError ? "border-red-500" : ""}
            />
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        );

      case "date":
        return (
          <div key={fieldKey} className="space-y-2">
            <Label
              htmlFor={fieldKey}
              className={`text-sm font-medium ${
                field.required ? 'after:content-["*"] after:text-red-500' : ""
              }`}
            >
              {field.label}
            </Label>
            <Input
              id={fieldKey}
              type="date"
              value={fieldValue}
              onChange={(e) =>
                handleFieldChange(field.name, e.target.value, parentField)
              }
              className={fieldError ? "border-red-500" : ""}
            />
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        );

      case "select":
        return (
          <div key={fieldKey} className="space-y-2">
            <Label
              htmlFor={fieldKey}
              className={`text-sm font-medium ${
                field.required ? 'after:content-["*"] after:text-red-500' : ""
              }`}
            >
              {field.label}
            </Label>
            <select
              id={fieldKey}
              value={fieldValue}
              onChange={(e) =>
                handleFieldChange(field.name, e.target.value, parentField)
              }
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldError ? "border-red-500" : ""
              }`}
            >
              <option value="">Select an option</option>
              {field.options?.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        );

      case "object":
        return (
          <div key={fieldKey} className="space-y-4">
            <Label
              className={`text-sm font-medium ${
                field.required ? 'after:content-["*"] after:text-red-500' : ""
              }`}
            >
              {field.label}
            </Label>
            <div className="pl-4 border-l-2 border-gray-200 space-y-4">
              {field.fields?.map((subField: any) =>
                renderField(subField, field.name)
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Note Type Selection */}
      <Card className="shadow-sm border-2 border-blue-100">
        <CardHeader className="pb-3 bg-blue-50">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Note Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="note-type" className="text-sm font-medium">
              Note Type <span className="text-red-500">*</span>
            </Label>
            <select
              id="note-type"
              value={noteType || ""}
              onChange={(e) => onNoteTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Note Type</option>
              {NOTE_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {noteType && (
            <div className="space-y-2">
              <Label htmlFor="note-template" className="text-sm font-medium">
                Note Template <span className="text-red-500">*</span>
              </Label>
              <select
                id="note-template"
                value={template?.id || ""}
                onChange={(e) => {
                  const selectedTemplate = NOTE_TEMPLATES.find(
                    (t) => t.id === parseInt(e.target.value)
                  );
                  if (selectedTemplate) {
                    onTemplateChange(selectedTemplate);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Note Template</option>
                {NOTE_TEMPLATES.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name} - {tmpl.description}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Fields (only show if both note type and template are selected) */}
      {noteType && template && template.schema && (
        <>
          {template.schema.sections?.map((section: any) => (
            <Card key={section.title} className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields?.map((field: any) => renderField(field))}
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};
