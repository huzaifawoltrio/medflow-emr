// components/patient-detail/dialogs/AddAssessmentScoreDialog.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AppDispatch } from "@/app/redux/store";
import { createAssessment } from "@/app/redux/features/assessments/assessmentActions";
import { CreateAssessmentData } from "@/app/redux/features/assessments/assessmentSlice";

interface AddAssessmentScoreDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
}

const assessmentSchema = z.object({
  assessment_type: z.enum(["phq9", "gad7", "pcl5"], {
    required_error: "Assessment type is required.",
  }),
  total_score: z.coerce
    .number({ required_error: "Score is required." })
    .int()
    .min(0, "Score must be positive.")
    .max(80, "Score seems too high."),
  assessment_date: z.date({ required_error: "Date is required." }),
});

const ASSESSMENT_INFO: { [key: string]: { name: string; max: number } } = {
  phq9: { name: "PHQ-9 (Depression)", max: 27 },
  gad7: { name: "GAD-7 (Anxiety)", max: 21 },
  pcl5: { name: "PCL-5 (PTSD)", max: 80 },
};

export function AddAssessmentScoreDialog({
  isOpen,
  onOpenChange,
  patientId,
}: AddAssessmentScoreDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof assessmentSchema>>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      assessment_date: new Date(),
    },
  });

  const selectedType = form.watch("assessment_type");

  const onSubmit = async (values: z.infer<typeof assessmentSchema>) => {
    const maxScore = ASSESSMENT_INFO[values.assessment_type]?.max;
    if (values.total_score > maxScore) {
      form.setError("total_score", {
        type: "manual",
        message: `Score cannot exceed ${maxScore} for ${values.assessment_type.toUpperCase()}.`,
      });
      return;
    }

    setIsLoading(true);
    const assessmentData: CreateAssessmentData = {
      patient_id: patientId,
      assessment_type: values.assessment_type,
      total_score: values.total_score,
      assessment_date: values.assessment_date.toISOString(),
    };

    try {
      await dispatch(createAssessment(assessmentData)).unwrap();
      toast.success("Assessment score added successfully.");
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Assessment Score</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="assessment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an assessment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="phq9">PHQ-9 (Depression)</SelectItem>
                      <SelectItem value="gad7">GAD-7 (Anxiety)</SelectItem>
                      <SelectItem value="pcl5">PCL-5 (PTSD)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Total Score{" "}
                    {selectedType &&
                      `(Max: ${ASSESSMENT_INFO[selectedType].max})`}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter score" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assessment_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assessment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Score
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
