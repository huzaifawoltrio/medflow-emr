// components/clinical-notes/ClinicalNotesModal.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  fetchNoteTypes,
  fetchNoteTemplates,
  createClinicalNote,
  NoteType,
  NoteTemplate,
} from "@/app/redux/features/clinicalNotes/clinicalNotesActions";
import { DynamicFormRenderer } from "./DynamicFormRenderer";

interface ClinicalNotesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
  patientName: string;
  appointmentId?: number;
}

export const ClinicalNotesModal: React.FC<ClinicalNotesModalProps> = ({
  isOpen,
  onOpenChange,
  patientId,
  patientName,
  appointmentId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const {
    noteTypes,
    templates,
    noteTypesLoading,
    templatesLoading,
    creating,
    createSuccess,
    notesError,
    templatesError,
    noteTypesError,
  } = useSelector((state: RootState) => state.clinicalNotes);

  // Form state
  const [selectedNoteTypeId, setSelectedNoteTypeId] = useState<number | null>(
    null
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
  const [selectedNoteType, setSelectedNoteType] = useState<NoteType | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] = useState<NoteTemplate | null>(
    null
  );
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitAction, setSubmitAction] = useState<"draft" | "sign" | null>(
    null
  );

  // Load note types and templates when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNoteTypes());
      dispatch(fetchNoteTemplates());
    }
  }, [isOpen, dispatch]);

  // Handle note type change
  const handleNoteTypeChange = (noteTypeId: string) => {
    const id = parseInt(noteTypeId);
    setSelectedNoteTypeId(id);

    const noteType = noteTypes.find((nt) => nt.id === id);
    setSelectedNoteType(noteType || null);

    // Reset template and form when note type changes
    setSelectedTemplateId(null);
    setSelectedTemplate(null);
    setFormData({});
    setFormErrors({});
    setNoteTitle("");
  };

  // Handle template change
  const handleTemplateChange = (templateId: string) => {
    const id = parseInt(templateId);
    setSelectedTemplateId(id);

    const template = templates.find((t) => t.id === id);
    setSelectedTemplate(template || null);

    // Reset form data when template changes
    setFormData({});
    setFormErrors({});

    // Auto-generate title
    if (selectedNoteType && template) {
      const autoTitle = `${
        selectedNoteType.name
      } - ${patientName} - ${new Date().toLocaleDateString()}`;
      setNoteTitle(autoTitle);
    }

    // Initialize form data with empty values based on schema
    if (template) {
      initializeFormData(template);
    }
  };

  // Initialize form data based on template schema
  const initializeFormData = (template: NoteTemplate) => {
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
    if (!selectedNoteTypeId) {
      errors.noteType = "Note type is required";
    }

    // Validate template selection
    if (!selectedTemplateId) {
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
    if (!validateForm() || !selectedNoteTypeId || !selectedTemplateId) return;

    setSubmitAction(action);

    const noteData = {
      patient_id: patientId,
      note_type_id: selectedNoteTypeId,
      template_id: selectedTemplateId,
      title: noteTitle,
      content: formData,
      appointment_id: appointmentId,
    };

    try {
      await dispatch(createClinicalNote(noteData)).unwrap();

      if (action === "sign") {
        // If we need to sign immediately after creation, we could dispatch signClinicalNote here
        // For now, we'll just create as draft and handle signing separately
      }
    } catch (error) {
      // Error is handled by Redux
      console.error("Failed to create note:", error);
    }
  };

  // Handle success
  useEffect(() => {
    if (createSuccess) {
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  }, [createSuccess]);

  const resetForm = () => {
    setSelectedNoteTypeId(null);
    setSelectedTemplateId(null);
    setSelectedNoteType(null);
    setSelectedTemplate(null);
    setNoteTitle("");
    setFormData({});
    setFormErrors({});
    setSubmitAction(null);
  };

  const handleClose = () => {
    if (!creating) {
      resetForm();
      onOpenChange(false);
    }
  };

  const anyError = notesError || templatesError || noteTypesError;
  const anyLoading = noteTypesLoading || templatesLoading;

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
                  value={selectedNoteTypeId?.toString() || ""}
                  onValueChange={handleNoteTypeChange}
                  disabled={anyLoading}
                >
                  <SelectTrigger id="note-type-select">
                    <SelectValue
                      placeholder={
                        noteTypesLoading
                          ? "Loading note types..."
                          : "Choose a note type"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {noteTypes.map((noteType) => (
                      <SelectItem
                        key={noteType.id}
                        value={noteType.id.toString()}
                      >
                        <div>
                          <div className="font-medium">{noteType.name}</div>
                          <div className="text-sm text-gray-500">
                            {noteType.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.noteType && (
                  <p className="text-sm text-red-500">{formErrors.noteType}</p>
                )}
              </div>

              {/* Template Selection */}
              {selectedNoteTypeId && (
                <div className="space-y-2">
                  <Label
                    htmlFor="template-select"
                    className="text-sm font-medium"
                  >
                    Select Note Template *
                  </Label>
                  <Select
                    value={selectedTemplateId?.toString() || ""}
                    onValueChange={handleTemplateChange}
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
                      <strong>Type:</strong> {selectedNoteType.name}
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
                    setFormData={setFormData}
                    errors={formErrors}
                  />
                </div>
              )}

              {/* Errors */}
              {anyError && (
                <Alert variant="destructive">
                  <AlertDescription>{anyError}</AlertDescription>
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
