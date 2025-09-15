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
import {
  DynamicFormRenderer,
  NOTE_TYPES,
  NOTE_TEMPLATES,
} from "./DynamicFormRenderer";

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
  const [noteTypes] = useState(NOTE_TYPES);
  const [templates] = useState(NOTE_TEMPLATES);
  const [user] = useState(mockUser);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Form state
  const [selectedNoteType, setSelectedNoteType] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
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
      setTimeout(() => {
        setTemplatesLoading(false);
      }, 500);
    }
  }, [isOpen]);

  // Handle note type change
  const handleNoteTypeChange = (noteType: string) => {
    setSelectedNoteType(noteType);
    // Reset template and form when note type changes
    setSelectedTemplate(null);
    setFormData({});
    setFormErrors({});
    setNoteTitle("");
  };

  // Handle template change
  const handleTemplateChange = (template: any) => {
    setSelectedTemplate(template);
    // Reset form data when template changes
    setFormData({});
    setFormErrors({});

    // Auto-generate title
    if (selectedNoteType && template) {
      const noteTypeName =
        noteTypes.find((nt) => nt.id === selectedNoteType)?.name ||
        selectedNoteType;
      const autoTitle = `${noteTypeName} - ${patientName} - ${new Date().toLocaleDateString()}`;
      setNoteTitle(autoTitle);
    }

    // Initialize form data with empty values based on schema
    initializeFormData(template);
  };

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

    // Validate note type selection
    if (!selectedNoteType) {
      errors.noteType = "Note type is required";
    }

    // Validate template selection
    if (!selectedTemplate) {
      errors.template = "Note template is required";
    }

    // Validate title
    if (!noteTitle.trim()) {
      errors.title = "Note title is required";
    }

    // Validate required fields in template
    if (selectedTemplate) {
      selectedTemplate.schema.sections?.forEach((section: any) => {
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
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (action: "draft" | "sign") => {
    if (!validateForm()) return;

    setSubmitAction(action);
    setCreating(true);

    // Create the note data structure
    const noteData = {
      id: `note_${Date.now()}`,
      noteType: selectedNoteType,
      noteTemplate: {
        id: selectedTemplate.id,
        name: selectedTemplate.name,
      },
      title: noteTitle,
      formData: formData,
      patientId: patientId,
      appointmentId: appointmentId,
      status: action === "sign" ? "signed" : "draft",
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simulate API call
    try {
      // Here you would call your actual API
      console.log("Saving note:", noteData);

      setTimeout(() => {
        setCreating(false);
        setCreateSuccess(true);
        setSubmitAction(null);

        // Show success message briefly then close
        setTimeout(() => {
          handleClose();
        }, 1500);
      }, 1000);
    } catch (error) {
      setCreating(false);
      setSubmitAction(null);
      setNotesError("Failed to save note. Please try again.");
    }
  };

  const resetForm = () => {
    setSelectedNoteType("");
    setSelectedTemplate(null);
    setNoteTitle("");
    setFormData({});
    setFormErrors({});
    setSubmitAction(null);
    setNotesError(null);
    setTemplatesError(null);
    setCreateSuccess(false);
  };

  const handleClose = () => {
    if (!creating) {
      resetForm();
      onOpenChange(false);
    }
  };

  const getNoteTypeName = (typeId: string) => {
    return noteTypes.find((type) => type.id === typeId)?.name || typeId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create Clinical Note - {patientName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {createSuccess ? (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Clinical note has been successfully{" "}
                {submitAction === "sign"
                  ? "created and signed"
                  : "saved as draft"}
                !
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Note Type Selection */}
              <div className="space-y-2">
                <Label
                  htmlFor="note-type-select"
                  className="text-sm font-medium"
                >
                  Select Note Type *
                </Label>
                <Select
                  value={selectedNoteType}
                  onValueChange={handleNoteTypeChange}
                  disabled={templatesLoading}
                >
                  <SelectTrigger id="note-type-select">
                    <SelectValue placeholder="Choose a note type" />
                  </SelectTrigger>
                  <SelectContent>
                    {noteTypes.map((noteType) => (
                      <SelectItem key={noteType.id} value={noteType.id}>
                        {noteType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.noteType && (
                  <p className="text-sm text-red-500">{formErrors.noteType}</p>
                )}
              </div>

              {/* Template Selection */}
              {selectedNoteType && (
                <div className="space-y-2">
                  <Label
                    htmlFor="template-select"
                    className="text-sm font-medium"
                  >
                    Select Note Template *
                  </Label>
                  <Select
                    value={selectedTemplate?.id?.toString() || ""}
                    onValueChange={(value) => {
                      const template = templates.find(
                        (t) => t.id.toString() === value
                      );
                      if (template) {
                        handleTemplateChange(template);
                      }
                    }}
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
                      {templates.map((template) => (
                        <SelectItem
                          key={template.id}
                          value={template.id.toString()}
                        >
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
                  {formErrors.template && (
                    <p className="text-sm text-red-500">
                      {formErrors.template}
                    </p>
                  )}
                </div>
              )}

              {/* Note Title */}
              {selectedTemplate && (
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

              {/* Current Selection Summary */}
              {selectedNoteType && selectedTemplate && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Note Configuration:
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Type:</strong> {getNoteTypeName(selectedNoteType)}
                    </p>
                    <p>
                      <strong>Template:</strong> {selectedTemplate.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Dynamic Form */}
              {selectedNoteType && selectedTemplate && (
                <div className="border-t pt-4">
                  <DynamicFormRenderer
                    noteType={selectedNoteType}
                    template={selectedTemplate}
                    formData={formData}
                    onNoteTypeChange={handleNoteTypeChange}
                    onTemplateChange={handleTemplateChange}
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
              {selectedNoteType && selectedTemplate && (
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
                    disabled={creating}
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
                    disabled={creating}
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
