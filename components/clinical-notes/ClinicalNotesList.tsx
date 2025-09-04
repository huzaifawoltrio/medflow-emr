// components/clinical-notes/ClinicalNotesList.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  FileSignature,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
} from "lucide-react";
import { AppDispatch, RootState } from "../../app/redux/store";
import {
  fetchPatientNotes,
  deleteClinicalNote,
  signClinicalNote,
  searchClinicalNotes,
} from "../../app/redux/features/clinicalNotes/clinicalNotesActions";
import { ClinicalNote } from "../../app/redux/features/clinicalNotes/clinicalNotesActions";

interface ClinicalNotesListProps {
  patientId: number;
  onNewNoteClick: () => void;
  onViewNote?: (note: ClinicalNote) => void;
  onEditNote?: (note: ClinicalNote) => void;
}

export const ClinicalNotesList: React.FC<ClinicalNotesListProps> = ({
  patientId,
  onNewNoteClick,
  onViewNote,
  onEditNote,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    notes,
    notesPagination,
    notesLoading,
    notesError,
    searchResults,
    searchLoading,
    signing,
    deleting,
  } = useSelector((state: RootState) => state.clinicalNotes);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Load patient notes on component mount
  useEffect(() => {
    if (patientId) {
      console.log("Loading notes for patient ID:", patientId);
      dispatch(
        fetchPatientNotes({
          patientId,
          page: currentPage,
          perPage: 10,
          type: filterType || undefined,
        })
      )
        .then((result) => {
          console.log("Fetch patient notes result:", result);
        })
        .catch((error) => {
          console.error("Error fetching patient notes:", error);
        });
    }
  }, [dispatch, patientId, currentPage, filterType]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching notes with query:", searchQuery);
      dispatch(
        searchClinicalNotes({
          query: searchQuery,
          patientId,
          type: filterType || undefined,
          status: filterStatus || undefined,
        })
      )
        .then((result) => {
          console.log("Search notes result:", result);
        })
        .catch((error) => {
          console.error("Error searching notes:", error);
        });
      setShowSearch(true);
    }
  };

  const clearSearch = () => {
    console.log("Clearing search filters");
    setSearchQuery("");
    setFilterType("");
    setFilterStatus("");
    setShowSearch(false);

    // Reload patient notes
    dispatch(
      fetchPatientNotes({
        patientId,
        page: 1,
        perPage: 10,
      })
    );
    setCurrentPage(1);
  };

  const handleSignNote = async (noteId: number) => {
    try {
      console.log("Signing note:", noteId);
      const result = await dispatch(signClinicalNote(noteId));
      console.log("Sign note result:", result);

      // Refresh the notes list
      dispatch(
        fetchPatientNotes({
          patientId,
          page: currentPage,
          perPage: 10,
          type: filterType || undefined,
        })
      );
    } catch (error) {
      console.error("Error signing note:", error);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ) {
      try {
        console.log("Deleting note:", noteId);
        const result = await dispatch(deleteClinicalNote(noteId));
        console.log("Delete note result:", result);
        // The note will be automatically removed from the list via Redux state update
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

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

  const displayNotes = showSearch ? searchResults : notes;

  console.log("Rendering ClinicalNotesList with:", {
    patientId,
    notesCount: displayNotes.length,
    loading: notesLoading,
    showSearch,
    currentPage,
  });

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Clinical Notes
          {notesPagination && (
            <span className="text-sm text-gray-500 ml-2">
              ({notesPagination.total} total)
            </span>
          )}
        </h3>
        <Button
          onClick={onNewNoteClick}
          className="bg-blue-800 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notes by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="progress">Progress Note</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="discharge">Discharge</SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="amended">Amended</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
              {showSearch && (
                <Button variant="outline" onClick={clearSearch}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      {notesLoading ? (
        <div className="text-center py-8">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading notes...</p>
        </div>
      ) : displayNotes.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium mb-2">No Clinical Notes</h4>
            <p className="text-gray-500 mb-4">
              {showSearch
                ? "No notes found matching your search criteria."
                : "No clinical notes have been created for this patient yet."}
            </p>
            {!showSearch && (
              <Button
                onClick={onNewNoteClick}
                className="bg-blue-800 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Note
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayNotes.map((note: ClinicalNote) => (
            <Card
              key={note.id}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {note.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>Type: {note.note_type}</span>
                      <span>•</span>
                      <span>
                        Created:{" "}
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                      {note.template_name && (
                        <>
                          <span>•</span>
                          <span>Template: {note.template_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(note.status)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("Viewing note:", note.id);
                      onViewNote?.(note);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>

                  {note.status === "draft" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log("Editing note:", note.id);
                          onEditNote?.(note);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSignNote(note.id)}
                        disabled={signing}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <FileSignature className="h-4 w-4 mr-1" />
                        Sign
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        disabled={deleting}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {notesPagination && notesPagination.pages > 1 && !showSearch && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {notesPagination.page} of {notesPagination.pages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(
                    Math.min(notesPagination.pages, currentPage + 1)
                  )
                }
                disabled={currentPage === notesPagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {notesError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center text-red-800">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{notesError}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
