// components/clinical-notes/ClinicalNoteViewModal.tsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  User,
  Calendar,
  FileSignature,
  Edit3,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  ClinicalNote,
  fetchClinicalNote,
  fetchNoteAmendments,
  amendClinicalNote,
  signClinicalNote,
} from "@/app/redux/features/clinicalNotes/clinicalNotesActions";

interface ClinicalNoteViewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  note: ClinicalNote | null;
  patientName?: string;
}

export const ClinicalNoteViewModal: React.FC<ClinicalNoteViewModalProps> = ({
  isOpen,
  onOpenChange,
  note,
  patientName,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedNote,
    amendments,
    notesLoading,
    amendmentsLoading,
    amending,
    amendSuccess,
    signing,
    signSuccess,
    notesError,
    amendmentsError,
  } = useSelector((state: RootState) => state.clinicalNotes);

  const [showAmendForm, setShowAmendForm] = useState(false);
  const [amendmentText, setAmendmentText] = useState("");
  const [amendmentReason, setAmendmentReason] = useState("");
  const [amendmentErrors, setAmendmentErrors] = useState<
    Record<string, string>
  >({});

  // Track the current note ID to prevent unnecessary API calls
  const currentNoteId = useRef<number | null>(null);

  // Load note details and amendments when modal opens or note changes
  useEffect(() => {
    if (isOpen && note?.id && currentNoteId.current !== note.id) {
      console.log("Loading note details and amendments for note:", note.id);
      currentNoteId.current = note.id;
      dispatch(fetchClinicalNote(note.id));
      dispatch(fetchNoteAmendments(note.id));
    }
  }, [isOpen, note?.id, dispatch]);

  // Reset current note when modal closes
  useEffect(() => {
    if (!isOpen) {
      currentNoteId.current = null;
    }
  }, [isOpen]);

  // Handle amendment success
  useEffect(() => {
    if (amendSuccess && isOpen) {
      setShowAmendForm(false);
      setAmendmentText("");
      setAmendmentReason("");
      setAmendmentErrors({});

      // Reload amendments only if we have a note ID
      if (note?.id) {
        dispatch(fetchNoteAmendments(note.id));
      }
    }
  }, [amendSuccess, note?.id, dispatch, isOpen]);

  // Handle sign success
  useEffect(() => {
    if (signSuccess && isOpen) {
      // Reload note details only if we have a note ID
      if (note?.id) {
        dispatch(fetchClinicalNote(note.id));
      }
    }
  }, [signSuccess, note?.id, dispatch, isOpen]);

  // Handle errors with toast notifications

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case "signed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Signed
          </Badge>
        );
      case "amended":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Amended
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSignNote = async () => {
    if (!note?.id) return;

    try {
      await dispatch(signClinicalNote(note.id)).unwrap();
    } catch (error: any) {
      console.error("Failed to sign note:", error);
    }
  };

  const validateAmendmentForm = () => {
    const errors: Record<string, string> = {};

    if (!amendmentText.trim()) {
      errors.amendmentText = "Amendment text is required";
    }

    if (!amendmentReason.trim()) {
      errors.amendmentReason = "Amendment reason is required";
    }

    setAmendmentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAmendment = async () => {
    if (!validateAmendmentForm() || !note?.id) return;

    try {
      await dispatch(
        amendClinicalNote({
          noteId: note.id,
          amendmentText,
          reason: amendmentReason,
        })
      ).unwrap();
    } catch (error: any) {
      
      console.error("Failed to add amendment:", error);
    }
  };

  const renderContent = (content: Record<string, any>) => {
    if (!content || typeof content !== "object") {
      return <p className="text-gray-500">No content available</p>;
    }

    return (
      <div className="space-y-4">
        {Object.entries(content).map(([key, value]) => (
          <div
            key={key}
            className="border-b border-gray-100 pb-3 last:border-b-0"
          >
            <h4 className="font-medium text-gray-900 mb-2 capitalize">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </h4>
            {typeof value === "object" && value !== null ? (
              <div className="pl-4 space-y-2">
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey} className="flex">
                    <span className="font-medium text-gray-600 w-32 capitalize">
                      {subKey.replace(/([A-Z])/g, " $1")}:
                    </span>
                    <span className="text-gray-800">
                      {String(subValue) || "Not specified"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-800 whitespace-pre-wrap">
                {String(value) || "Not specified"}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const displayNote = selectedNote || note;

  if (!displayNote) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              <span>Clinical Note Details</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {notesLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading note details...</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Note Header */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {displayNote.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Patient ID: {displayNote.patient_id}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created:{" "}
                    {new Date(displayNote.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    Type: {displayNote.note_type_name}
                  </div>
                  <div className="flex items-center">
                    Template: {displayNote.template_name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(displayNote.status)}
              </div>
            </div>

            {/* Success Messages - Removed since we're using toasts now */}

            {/* Note Content */}
            <Card>
              <CardHeader>
                <CardTitle>Note Content</CardTitle>
              </CardHeader>
              <CardContent>{renderContent(displayNote.content)}</CardContent>
            </Card>

            {/* Amendments Section */}
            {(displayNote.status === "signed" ||
              displayNote.status === "amended") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Amendments</span>
                    {displayNote.status === "signed" && !showAmendForm && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAmendForm(true)}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Add Amendment
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {amendmentsLoading ? (
                    <div className="text-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p>Loading amendments...</p>
                    </div>
                  ) : amendments.length === 0 ? (
                    <p className="text-gray-500">
                      No amendments have been made to this note.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {amendments.map((amendment, index) => (
                        <div
                          key={amendment.id}
                          className="border-l-4 border-blue-200 pl-4 pb-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">
                              Amendment {index + 1}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {new Date(
                                amendment.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium text-gray-600">
                                Reason:
                              </span>
                              <p className="text-gray-800">
                                {amendment.reason}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">
                                Amendment:
                              </span>
                              <p className="text-gray-800 whitespace-pre-wrap">
                                {amendment.amendment_text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Amendment Form */}
                  {showAmendForm && (
                    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="font-medium mb-4">Add New Amendment</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="amendment-reason">
                            Reason for Amendment *
                          </Label>
                          <Textarea
                            id="amendment-reason"
                            placeholder="Enter the reason for this amendment..."
                            value={amendmentReason}
                            onChange={(e) => setAmendmentReason(e.target.value)}
                            className={
                              amendmentErrors.amendmentReason
                                ? "border-red-500"
                                : ""
                            }
                            rows={2}
                          />
                          {amendmentErrors.amendmentReason && (
                            <p className="text-sm text-red-500 mt-1">
                              {amendmentErrors.amendmentReason}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="amendment-text">
                            Amendment Text *
                          </Label>
                          <Textarea
                            id="amendment-text"
                            placeholder="Enter the amendment details..."
                            value={amendmentText}
                            onChange={(e) => setAmendmentText(e.target.value)}
                            className={
                              amendmentErrors.amendmentText
                                ? "border-red-500"
                                : ""
                            }
                            rows={4}
                          />
                          {amendmentErrors.amendmentText && (
                            <p className="text-sm text-red-500 mt-1">
                              {amendmentErrors.amendmentText}
                            </p>
                          )}
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAmendForm(false);
                              setAmendmentText("");
                              setAmendmentReason("");
                              setAmendmentErrors({});
                            }}
                            disabled={amending}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSubmitAmendment}
                            disabled={amending}
                            className="bg-blue-800 hover:bg-blue-700"
                          >
                            {amending ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Edit3 className="h-4 w-4 mr-2" />
                            )}
                            Submit Amendment
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Errors - Removed since we're using toasts now */}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>

              {displayNote.status === "draft" && (
                <Button
                  onClick={handleSignNote}
                  disabled={signing}
                  className="bg-blue-800 hover:bg-blue-700"
                >
                  {signing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileSignature className="h-4 w-4 mr-2" />
                  )}
                  Sign Note
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
