// components/clinical-notes/DynamicFormRenderer.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  NoteType,
  NoteTemplate,
} from "@/app/redux/features/clinicalNotes/clinicalNotesActions";

interface DynamicFormRendererProps {
  noteType: NoteType;
  template: NoteTemplate;
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  errors?: Record<string, string>;
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  noteType,
  template,
  formData,
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
      {/* Note Configuration Summary */}
      <Card className="shadow-sm border-2 border-blue-100">
        <CardHeader className="pb-3 bg-blue-50">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Note Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Note Type:</span>
              <p className="text-gray-900">{noteType.name}</p>
              <p className="text-gray-500 text-xs">{noteType.description}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Template:</span>
              <p className="text-gray-900">{template.name}</p>
              <p className="text-gray-500 text-xs">{template.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
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
