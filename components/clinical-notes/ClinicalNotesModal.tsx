// components/clinical-notes/ClinicalNotesModal.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, FileSignature, X } from "lucide-react";
import { DynamicFormRenderer, NOTE_TEMPLATES } from "./DynamicFormRenderer";

interface ClinicalNotesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
  patientName: string;
  appointmentId?: number;
}

// Mock user data
const mockUser = {
  id: 1,
  name: "Dr. Sarah Johnson",
  role: "doctor",
};

export const ClinicalNotesModal: React.FC<ClinicalNotesModalProps> = ({
  isOpen,
  onOpenChange,
  patientId,
  patientName,
  appointmentId,
}) => {
  // Local state
  const [templates] = useState<any[]>(NOTE_TEMPLATES); // Use imported templates
  const [user] = useState<any>(mockUser);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitAction, setSubmitAction] = useState<"draft" | "sign" | null>(
    null
  );

  // Simulate loading templates
  useEffect(() => {
    if (isOpen) {
      setTemplatesLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setTemplatesLoading(false);
      }, 500);
    }
  }, [isOpen]);

  // Handle template selection
  useEffect(() => {
    if (selectedTemplateId) {
      const template = templates.find(
        (t) => t.id.toString() === selectedTemplateId
      );
      if (template) {
        // Auto-generate title based on template and patient
        const autoTitle = `${
          template.name
        } - ${patientName} - ${new Date().toLocaleDateString()}`;
        setNoteTitle(autoTitle);

        // Initialize form data with empty values based on schema
        initializeFormData(template);
      }
    }
  }, [selectedTemplateId, templates, patientName]);

  // Initialize form data based on template schema
  const initializeFormData = (template: any) => {
    const initialData: Record<string, any> = {};

    template.schema.sections?.forEach((section: any) => {
      section.fields?.forEach((field: any) => {
        if (field.type === "object" && field.fields) {
          initialData[field.name] = {};
          field.fields.forEach((subField: any) => {
            initialData[field.name][subField.name] = "";
          });
        } else {
          initialData[field.name] = "";
        }
      });
    });

    setFormData(initialData);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const template = templates.find(
      (t) => t.id.toString() === selectedTemplateId
    );

    if (!template) return false;

    // Validate title
    if (!noteTitle.trim()) {
      errors.title = "Note title is required";
    }

    // Validate required fields
    template.schema.sections?.forEach((section: any) => {
      section.fields?.forEach((field: any) => {
        if (field.required) {
          if (field.type === "object" && field.fields) {
            field.fields.forEach((subField: any) => {
              if (subField.required) {
                const value = formData[field.name]?.[subField.name];
                if (!value || value.toString().trim() === "") {
                  errors[
                    `${field.name}.${subField.name}`
                  ] = `${subField.label} is required`;
                }
              }
            });
          } else {
            const value = formData[field.name];
            if (!value || value.toString().trim() === "") {
              errors[field.name] = `${field.label} is required`;
            }
          }
        }
      });
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (action: "draft" | "sign") => {
    if (!validateForm()) return;

    setSubmitAction(action);
    setCreating(true);

    // Simulate API call
    setTimeout(() => {
      setCreating(false);
      setCreateSuccess(true);
      setSubmitAction(null);

      // Close modal after successful creation
      setTimeout(() => {
        handleClose();
      }, 500);
    }, 1000);
  };

  const resetForm = () => {
    setSelectedTemplateId("");
    setNoteTitle("");
    setFormData({});
    setFormErrors({});
    setSubmitAction(null);
    setNotesError(null);
    setTemplatesError(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const selectedTemplateObj = templates.find(
    (t) => t.id.toString() === selectedTemplateId
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create Clinical Note - {patientName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template-select" className="text-sm font-medium">
              Select Note Template *
            </Label>
            <Select
              value={selectedTemplateId}
              onValueChange={setSelectedTemplateId}
              disabled={templatesLoading}
            >
              <SelectTrigger id="template-select">
                <SelectValue
                  placeholder={
                    templatesLoading
                      ? "Loading templates..."
                      : "Choose a template"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template: any) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-gray-500">
                        {template.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note Title */}
          {selectedTemplateId && (
            <div className="space-y-2">
              <Label htmlFor="note-title" className="text-sm font-medium">
                Note Title *
              </Label>
              <Input
                id="note-title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Enter note title"
                className={formErrors.title ? "border-red-500" : ""}
              />
              {formErrors.title && (
                <p className="text-sm text-red-500">{formErrors.title}</p>
              )}
            </div>
          )}

          {/* Dynamic Form */}
          {selectedTemplateObj && (
            <div className="border-t pt-4">
              <DynamicFormRenderer
                template={selectedTemplateObj}
                formData={formData}
                setFormData={setFormData}
                errors={formErrors}
              />
            </div>
          )}

          {/* Errors */}
          {(templatesError || notesError) && (
            <Alert variant="destructive">
              <AlertDescription>
                {templatesError || notesError}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          {selectedTemplateObj && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={creating}
              >
                Cancel
              </Button>

              <Button
                variant="outline"
                onClick={() => handleSubmit("draft")}
                disabled={creating || !selectedTemplateId}
                className="flex items-center"
              >
                {creating && submitAction === "draft" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save as Draft
              </Button>

              <Button
                onClick={() => handleSubmit("sign")}
                disabled={creating || !selectedTemplateId}
                className="bg-blue-800 hover:bg-blue-700 flex items-center"
              >
                {creating && submitAction === "sign" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileSignature className="h-4 w-4 mr-2" />
                )}
                Create & Sign
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
