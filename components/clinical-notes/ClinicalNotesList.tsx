"use client";

import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Loader2,
} from "lucide-react";
import { ClinicalNote } from "@/app/redux/features/clinicalNotes/clinicalNotesActions";
import { AppDispatch, RootState } from "@/app/redux/store";

interface ClinicalNotesListProps {
  notes: ClinicalNote[];
  onView: (note: ClinicalNote) => void;
  onEdit: (note: ClinicalNote) => void;
  onDelete: (noteId: number) => void;
  onSign: (noteId: number) => void;
  onUnsign: (noteId: number) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  canCreate: boolean;
  canEdit: (note: ClinicalNote) => boolean;
  canDelete: (note: ClinicalNote) => boolean;
  canSign: (note: ClinicalNote) => boolean;
}

export function ClinicalNotesList({
  notes = [],
  onView,
  onEdit,
  onDelete,
  onSign,
  onUnsign,
  setIsModalOpen,
  canCreate,
  canEdit,
  canDelete,
  canSign,
}: ClinicalNotesListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { notesLoading, notesError, deleting, signing } = useSelector(
    (state: RootState) => state.clinicalNotes
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const uniqueNoteTypes = useMemo(() => {
    const types = notes.map((note) => note.note_type).filter(Boolean);
    return [...new Set(types)];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        note.title?.toLowerCase().includes(searchLower) ||
        note.note_type?.toLowerCase().includes(searchLower) ||
        (typeof note.content === "string" &&
          note.content.toLowerCase().includes(searchLower));

      const matchesType = filterType === "all" || note.note_type === filterType;
      const matchesStatus =
        filterStatus === "all" || note.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notes, searchTerm, filterType, filterStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Lock className="mr-1 h-3 w-3" />
            Signed
          </Badge>
        );
      case "draft":
        return (
          <Badge
            variant="outline"
            className="border-yellow-400 text-yellow-600"
          >
            Draft
          </Badge>
        );
      case "amended":
        return (
          <Badge
            variant="outline"
            className="border-orange-400 text-orange-600"
          >
            Amended
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Show loading state
  if (notesLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Clinical Notes</h2>
          {canCreate && (
            <Button onClick={() => setIsModalOpen(true)} disabled>
              <Plus className="mr-2 h-4 w-4" />
              New Clinical Note
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          <span className="text-lg">Loading clinical notes...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (notesError) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Clinical Notes</h2>
          {canCreate && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Clinical Note
            </Button>
          )}
        </div>

        <Alert variant="destructive">
          <AlertDescription>
            Error loading clinical notes: {notesError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          {canCreate && (
            <Button onClick={() => setIsModalOpen(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              New Clinical Note
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48 text-sm">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueNoteTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type || "Uncategorized"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 text-sm">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="signed">Signed</SelectItem>
            <SelectItem value="amended">Amended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>
                    <div className="font-medium">
                      {note.title || "Untitled Note"}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(note.created_at)}</TableCell>
                  <TableCell>{note.note_type}</TableCell>
                  <TableCell>{getStatusBadge(note.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(note)}
                        title="View Note"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {canEdit(note) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(note)}
                          title="Edit Note"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}

                      {canSign(note) ? (
                        note.status === "signed" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onUnsign(note.id)}
                            title="Unsign Note"
                            disabled={signing}
                          >
                            <Unlock className="h-4 w-4 text-orange-500" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onSign(note.id)}
                            title="Sign Note"
                            disabled={signing}
                          >
                            <Lock className="h-4 w-4 text-green-500" />
                          </Button>
                        )
                      ) : null}

                      {canDelete(note) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => onDelete(note.id)}
                          title="Delete Note"
                          disabled={deleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  {searchTerm ||
                  filterType !== "all" ||
                  filterStatus !== "all" ? (
                    <div>
                      <p className="text-gray-500 mb-2">
                        No notes match your search criteria.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterType("all");
                          setFilterStatus("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 mb-2">
                        No clinical notes found for this patient.
                      </p>
                      {canCreate && (
                        <Button onClick={() => setIsModalOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create First Note
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
