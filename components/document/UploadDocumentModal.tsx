// components/modals/UploadDocumentModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { uploadPatientDocument } from "@/app/redux/features/documents/documentActions";
import {
  clearUploadError,
  resetUploadState,
} from "../../app/redux/features/documents/documentSlice";
import { fetchPatients } from "@/app/redux/features/patients/patientActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  X,
  Upload,
  FileText,
  User,
  Search,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { patients, loading: patientsLoading } = useAppSelector(
    (state) => state.patient
  );
  const { uploading, uploadError, uploadSuccess } = useAppSelector(
    (state) => state.documents
  );

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Fetch patients when modal opens
  useEffect(() => {
    if (isOpen && patients.length === 0) {
      dispatch(fetchPatients());
    }
  }, [isOpen, dispatch, patients.length]);

  // Handle successful upload
  useEffect(() => {
    if (uploadSuccess) {
      handleClose();
    }
  }, [uploadSuccess]);

  // Clear errors when modal closes
  useEffect(() => {
    if (!isOpen) {
      dispatch(clearUploadError());
      dispatch(resetUploadState());
    }
  }, [isOpen, dispatch]);

  const handleClose = () => {
    // Reset form
    setSelectedFile(null);
    setSelectedPatientId(null);
    setDescription("");
    setTags("");
    setSearchValue("");
    dispatch(resetUploadState());
    onClose();
  };

  const handleFileSelect = (file: File) => {
    // Validate file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "File type not supported. Please upload PDF, DOC, DOCX, TXT, or image files."
      );
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !selectedPatientId || !description.trim()) {
      return;
    }

    dispatch(
      uploadPatientDocument({
        file: selectedFile,
        patient_id: selectedPatientId,
        description: description.trim(),
        tags: tags.trim(),
      })
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const selectedPatient = patients.find((p) => p.user_id === selectedPatientId);

  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name} ${patient.username}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Patient Document
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient">Select Patient *</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={patientsLoading}
                >
                  {selectedPatient ? (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {selectedPatient.first_name} {selectedPatient.last_name} (
                      {selectedPatient.username})
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Search className="h-4 w-4" />
                      Search and select patient...
                    </div>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search patients..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>No patients found.</CommandEmpty>
                    <CommandGroup>
                      {filteredPatients.map((patient) => (
                        <CommandItem
                          key={patient.user_id}
                          value={`${patient.first_name} ${patient.last_name} ${patient.username}`}
                          onSelect={() => {
                            setSelectedPatientId(patient.user_id);
                            setOpen(false);
                            setSearchValue("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedPatientId === patient.user_id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>
                              {patient.first_name} {patient.last_name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              @{patient.username}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Document File *</Label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileInputChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />

              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(selectedFile.size)} •{" "}
                        {selectedFile.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Click to upload</strong> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX, TXT, JPG, PNG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the document content (e.g., lab results from 2024, prescription history, etc.)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              placeholder="Separate tags with commas (e.g., lab-results, blood-work, 2024)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Tags help organize and search for documents later
            </p>
          </div>

          {/* Error Display */}
          {uploadError && (
            <Alert variant="destructive">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !selectedFile ||
                !selectedPatientId ||
                !description.trim() ||
                uploading
              }
              className="bg-blue-800 hover:bg-blue-700"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentModal;
