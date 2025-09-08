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

interface DynamicFormRendererProps {
  template: NoteTemplate | null;
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  errors?: Record<string, string>;
}

// Predefined templates
export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: 1,
    name: "Initial Psychiatric Evaluation",
    description:
      "Comprehensive initial assessment for new psychiatric patients",
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
              placeholder: "What is the primary reason for today's visit?",
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
    id: 2,
    name: "Follow-up Note",
    description: "Standard follow-up visit documentation",
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
              placeholder: "Patient's main concern today",
              rows: 3,
            },
            {
              name: "symptom_review",
              label: "Symptom Review",
              type: "textarea",
              placeholder: "Changes in symptoms since last visit",
              rows: 3,
            },
            {
              name: "medication_effects",
              label: "Medication Effects",
              type: "textarea",
              placeholder: "Side effects, effectiveness, compliance",
              rows: 3,
            },
          ],
        },
        {
          title: "Objective",
          fields: [
            {
              name: "observations",
              label: "Clinical Observations",
              type: "textarea",
              placeholder: "Mental status observations, behavior, appearance",
              rows: 3,
            },
            {
              name: "measurements",
              label: "Measurements",
              type: "textarea",
              placeholder: "Vital signs, weight, PHQ-9, GAD-7, etc.",
              rows: 2,
            },
          ],
        },
        {
          title: "Assessment",
          fields: [
            {
              name: "clinical_status",
              label: "Clinical Status",
              type: "textarea",
              required: true,
              placeholder: "Current clinical condition and progress",
              rows: 3,
            },
            {
              name: "diagnostic_updates",
              label: "Diagnostic Updates",
              type: "textarea",
              placeholder: "Changes to diagnosis if any",
              rows: 2,
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
                "Medication changes, therapy recommendations, referrals, follow-up",
              rows: 4,
            },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    name: "Biopsychosocial Assessment",
    description:
      "Comprehensive biopsychosocial evaluation for holistic patient assessment",
    schema: {
      sections: [
        {
          title: "Biological Factors",
          fields: [
            {
              name: "medical_history",
              label: "Medical History",
              type: "textarea",
              placeholder:
                "Chronic conditions, surgeries, medications, allergies",
              rows: 3,
            },
            {
              name: "family_medical_history",
              label: "Family Medical History",
              type: "textarea",
              placeholder:
                "Hereditary conditions, relevant family health history",
              rows: 3,
            },
            {
              name: "developmental_history",
              label: "Developmental History",
              type: "textarea",
              placeholder: "Prenatal, birth, developmental milestones",
              rows: 3,
            },
          ],
        },
        {
          title: "Psychological Factors",
          fields: [
            {
              name: "cognitive_functioning",
              label: "Cognitive Functioning",
              type: "textarea",
              placeholder: "Memory, attention, executive functioning, learning",
              rows: 3,
            },
            {
              name: "emotional_functioning",
              label: "Emotional Functioning",
              type: "textarea",
              placeholder: "Mood, affect, emotional regulation",
              rows: 3,
            },
            {
              name: "behavioral_patterns",
              label: "Behavioral Patterns",
              type: "textarea",
              placeholder: "Coping mechanisms, behavioral issues, habits",
              rows: 3,
            },
            {
              name: "personality_factors",
              label: "Personality Factors",
              type: "textarea",
              placeholder:
                "Temperament, personality traits, interpersonal style",
              rows: 3,
            },
          ],
        },
        {
          title: "Social Factors",
          fields: [
            {
              name: "family_system",
              label: "Family System",
              type: "textarea",
              placeholder: "Family dynamics, relationships, support system",
              rows: 3,
            },
            {
              name: "social_support",
              label: "Social Support",
              type: "textarea",
              placeholder: "Friends, community connections, social networks",
              rows: 3,
            },
            {
              name: "cultural_factors",
              label: "Cultural Factors",
              type: "textarea",
              placeholder: "Cultural background, beliefs, values, practices",
              rows: 3,
            },
            {
              name: "environmental_stressors",
              label: "Environmental Stressors",
              type: "textarea",
              placeholder:
                "Living situation, work environment, financial stress",
              rows: 3,
            },
          ],
        },
        {
          title: "Integration & Formulation",
          fields: [
            {
              name: "biopsychosocial_formulation",
              label: "Biopsychosocial Formulation",
              type: "textarea",
              required: true,
              placeholder:
                "Integration of biological, psychological, and social factors in understanding the patient's condition",
              rows: 4,
            },
          ],
        },
        {
          title: "Treatment Plan",
          fields: [
            {
              name: "integrated_treatment_plan",
              label: "Integrated Treatment Plan",
              type: "textarea",
              required: true,
              placeholder:
                "Addressing biological, psychological, and social components of treatment",
              rows: 4,
            },
          ],
        },
      ],
    },
  },
  {
    id: 4,
    name: "Risk Assessment",
    description: "Comprehensive risk evaluation for safety planning",
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
              name: "suicide_attempts",
              label: "Previous Suicide Attempts",
              type: "textarea",
              placeholder: "History of attempts, circumstances, outcomes",
              rows: 3,
            },
            {
              name: "risk_factors",
              label: "Risk Factors",
              type: "textarea",
              placeholder:
                "Hopelessness, impulsivity, substance use, recent losses",
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
          title: "Homicide Risk Assessment",
          fields: [
            {
              name: "homicidal_ideation",
              label: "Homicidal Ideation",
              type: "textarea",
              placeholder:
                "Presence, frequency, intensity, targets of homicidal thoughts",
              rows: 3,
            },
            {
              name: "homicide_plan",
              label: "Homicide Plan",
              type: "textarea",
              placeholder:
                "Specificity of plan, lethality of means, access to means",
              rows: 3,
            },
            {
              name: "homicide_intent",
              label: "Homicide Intent",
              type: "textarea",
              placeholder:
                "Strength of intent, history of violence, current threats",
              rows: 3,
            },
            {
              name: "violence_history",
              label: "History of Violence",
              type: "textarea",
              placeholder: "Previous violent acts, patterns, circumstances",
              rows: 3,
            },
          ],
        },
        {
          title: "Self-Harm Assessment",
          fields: [
            {
              name: "self_harm_behavior",
              label: "Self-Harm Behavior",
              type: "textarea",
              placeholder: "Types, frequency, methods, triggers of self-harm",
              rows: 3,
            },
            {
              name: "self_harm_intent",
              label: "Self-Harm Intent",
              type: "textarea",
              placeholder:
                "Purpose of self-harm, communication vs. escape, lethality",
              rows: 3,
            },
          ],
        },
        {
          title: "Risk Level & Safety Planning",
          fields: [
            {
              name: "overall_risk_level",
              label: "Overall Risk Level",
              type: "select",
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
            {
              name: "follow_up_plan",
              label: "Follow-up Plan",
              type: "textarea",
              required: true,
              placeholder:
                "Frequency of contact, monitoring arrangements, emergency procedures",
              rows: 3,
            },
          ],
        },
      ],
    },
  },
  {
    id: 5,
    name: "Treatment Plan",
    description: "Comprehensive treatment planning document",
    schema: {
      sections: [
        {
          title: "Diagnosis & Problem List",
          fields: [
            {
              name: "primary_diagnosis",
              label: "Primary Diagnosis",
              type: "textarea",
              required: true,
              placeholder:
                "Primary mental health diagnosis with diagnostic code",
              rows: 2,
            },
            {
              name: "secondary_diagnoses",
              label: "Secondary Diagnoses",
              type: "textarea",
              placeholder: "Additional diagnoses with diagnostic codes",
              rows: 3,
            },
            {
              name: "problem_list",
              label: "Problem List",
              type: "textarea",
              placeholder: "Key clinical problems and treatment targets",
              rows: 3,
            },
          ],
        },
        {
          title: "Treatment Goals",
          fields: [
            {
              name: "short_term_goals",
              label: "Short-term Goals (0-3 months)",
              type: "textarea",
              required: true,
              placeholder:
                "Specific, measurable, achievable short-term objectives",
              rows: 3,
            },
            {
              name: "long_term_goals",
              label: "Long-term Goals (3-12 months)",
              type: "textarea",
              required: true,
              placeholder: "Broader therapeutic objectives and outcomes",
              rows: 3,
            },
          ],
        },
        {
          title: "Interventions",
          fields: [
            {
              name: "psychotherapy",
              label: "Psychotherapy Interventions",
              type: "textarea",
              required: true,
              placeholder: "Types of therapy, frequency, specific techniques",
              rows: 3,
            },
            {
              name: "pharmacotherapy",
              label: "Pharmacotherapy",
              type: "textarea",
              placeholder: "Medications, dosages, monitoring parameters",
              rows: 3,
            },
            {
              name: "other_interventions",
              label: "Other Interventions",
              type: "textarea",
              placeholder:
                "Group therapy, family therapy, case management, community resources",
              rows: 3,
            },
          ],
        },
        {
          title: "Monitoring & Evaluation",
          fields: [
            {
              name: "progress_measures",
              label: "Progress Measures",
              type: "textarea",
              required: true,
              placeholder:
                "Tools and methods for tracking progress (e.g., PHQ-9, GAD-7)",
              rows: 3,
            },
            {
              name: "review_frequency",
              label: "Review Frequency",
              type: "textarea",
              required: true,
              placeholder:
                "How often treatment plan will be reviewed and updated",
              rows: 2,
            },
          ],
        },
        {
          title: "Collaborative Care",
          fields: [
            {
              name: "care_team",
              label: "Care Team Members",
              type: "textarea",
              placeholder:
                "Other healthcare providers involved in patient's care",
              rows: 3,
            },
            {
              name: "patient_preferences",
              label: "Patient Preferences & Values",
              type: "textarea",
              placeholder:
                "Patient's preferences regarding treatment approaches",
              rows: 3,
            },
          ],
        },
      ],
    },
  },
  {
    id: 6,
    name: "Group Therapy Session",
    description: "Documentation for group therapy sessions",
    schema: {
      sections: [
        {
          title: "Session Information",
          fields: [
            {
              name: "group_name",
              label: "Group Name",
              type: "text",
              required: true,
              placeholder: "Name of the therapy group",
            },
            {
              name: "session_date",
              label: "Session Date",
              type: "date",
              required: true,
            },
            {
              name: "session_duration",
              label: "Session Duration",
              type: "text",
              placeholder: "e.g., 90 minutes",
            },
            {
              name: "group_size",
              label: "Group Size",
              type: "number",
              placeholder: "Number of participants",
            },
          ],
        },
        {
          title: "Session Focus",
          fields: [
            {
              name: "session_topic",
              label: "Session Topic",
              type: "textarea",
              required: true,
              placeholder: "Main topic or theme of the session",
              rows: 2,
            },
            {
              name: "session_objectives",
              label: "Session Objectives",
              type: "textarea",
              required: true,
              placeholder: "Learning objectives and goals for the session",
              rows: 3,
            },
            {
              name: "materials_used",
              label: "Materials Used",
              type: "textarea",
              placeholder: "Handouts, worksheets, videos, or other materials",
              rows: 2,
            },
          ],
        },
        {
          title: "Session Process",
          fields: [
            {
              name: "opening",
              label: "Opening/CHECK-IN",
              type: "textarea",
              placeholder: "How the session began, group member check-in",
              rows: 3,
            },
            {
              name: "main_activity",
              label: "Main Activity/Intervention",
              type: "textarea",
              required: true,
              placeholder: "Primary therapeutic activity or intervention",
              rows: 4,
            },
            {
              name: "group_interaction",
              label: "Group Interaction",
              type: "textarea",
              placeholder:
                "Group dynamics, participation levels, notable interactions",
              rows: 3,
            },
            {
              name: "closing",
              label: "Closing/Summary",
              type: "textarea",
              placeholder:
                "How the session ended, key takeaways, homework assignments",
              rows: 3,
            },
          ],
        },
        {
          title: "Individual Participant Notes",
          fields: [
            {
              name: "participant_engagement",
              label: "Participant Engagement",
              type: "textarea",
              placeholder:
                "Notable participation, engagement levels, individual progress",
              rows: 3,
            },
            {
              name: "clinical_observations",
              label: "Clinical Observations",
              type: "textarea",
              placeholder:
                "Important clinical observations about group members",
              rows: 3,
            },
          ],
        },
        {
          title: "Plan & Follow-up",
          fields: [
            {
              name: "next_session",
              label: "Next Session Plan",
              type: "textarea",
              placeholder: "Topics or activities planned for next session",
              rows: 2,
            },
            {
              name: "individual_follow_up",
              label: "Individual Follow-up Needed",
              type: "textarea",
              placeholder: "Any individual follow-up actions required",
              rows: 3,
            },
          ],
        },
      ],
    },
  },
];

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  template,
  formData,
  setFormData,
  errors = {},
}) => {
  if (!template || !template.schema) {
    return null;
  }

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
    </div>
  );
};
