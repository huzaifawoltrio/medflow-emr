// components/patient-detail/tabs/LabsTabsComponents/RatingScalesSection.tsx
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clipboard, Loader2 } from "lucide-react";
import { RatingScalesChart } from "./RatingScalesChart";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  getPatientAssessmentSummary,
  getPatientAssessmentTrends,
} from "@/app/redux/features/assessments/assessmentActions";
import type { Assessment } from "@/app/redux/features/assessments/assessmentSlice";

const ASSESSMENT_DETAILS: {
  [key: string]: {
    name: string;
    maxScore: number;
    severity: (score: number) => string;
  };
} = {
  phq9: {
    name: "PHQ-9 Depression Assessment",
    maxScore: 27,
    severity: (score) => {
      if (score <= 4) return "normal";
      if (score <= 9) return "mild";
      if (score <= 14) return "moderate";
      if (score <= 19) return "moderate-severe";
      return "severe";
    },
  },
  gad7: {
    name: "GAD-7 Anxiety Assessment",
    maxScore: 21,
    severity: (score) => {
      if (score <= 4) return "normal";
      if (score <= 9) return "mild";
      if (score <= 14) return "moderate";
      return "severe";
    },
  },
  pcl5: {
    name: "PCL-5 PTSD Assessment",
    maxScore: 80,
    severity: (score) => {
      if (score < 31) return "normal";
      if (score <= 40) return "mild";
      if (score <= 60) return "moderate";
      return "severe";
    },
  },
};

export function RatingScalesSection({ patientId }: { patientId: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const { patientSummary, patientTrends, loading } = useSelector(
    (state: RootState) => state.assessments
  );

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientAssessmentSummary(patientId));
      dispatch(getPatientAssessmentTrends({ patientId }));
    }
  }, [dispatch, patientId]);

  const chartData = useMemo(() => {
    if (!patientTrends?.graph_data) return [];

    const dataByDate: { [date: string]: any } = {};
    patientTrends.graph_data.forEach((item) => {
      const date = item.date.split("T")[0];
      if (!dataByDate[date]) {
        dataByDate[date] = { date };
      }
      dataByDate[date][item.type.toUpperCase()] = item.score;
    });

    return Object.values(dataByDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [patientTrends]);

  if (loading && !patientSummary) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clipboard className="h-5 w-5 text-emerald-600" />
            Assessment Score Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <RatingScalesChart data={chartData} />
          ) : (
            <p className="text-center text-gray-500">
              No trend data available.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAssessmentScores summary={patientSummary} />
        <AssessmentHistory
          assessments={patientSummary?.attention_required ?? []}
        />
      </div>

      <ClinicalInterpretations />
    </div>
  );
}

function RecentAssessmentScores({ summary }: { summary: any }) {
  const recentAssessments = summary
    ? Object.values(summary.by_type).map((item: any) => item.latest)
    : [];

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Assessment Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No recent assessments found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Assessment Scores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentAssessments.length > 0 ? (
          recentAssessments.map((assessment: Assessment) => {
            const details = ASSESSMENT_DETAILS[assessment.assessment_type];
            if (!details) return null;
            const severity = details.severity(assessment.total_score);

            return (
              <div
                key={assessment.id}
                className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">
                      {details.name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      Completed:{" "}
                      {new Date(
                        assessment.assessment_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getBadgeColor(severity)}>
                    {assessment.interpretation}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Score: {assessment.total_score}/{details.maxScore}
                    </span>
                    <span className="text-xs text-slate-500">
                      {Math.round(
                        (assessment.total_score / details.maxScore) * 100
                      )}
                      %
                    </span>
                  </div>
                  <ProgressBar
                    score={assessment.total_score}
                    maxScore={details.maxScore}
                    severity={severity}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p>No recent assessments found.</p>
        )}
      </CardContent>
    </Card>
  );
}

const getBadgeColor = (severity: string) => {
  switch (severity) {
    case "normal":
      return "bg-green-100 text-green-800";
    case "mild":
      return "bg-yellow-100 text-yellow-800";
    case "moderate":
      return "bg-orange-100 text-orange-800";
    case "moderate-severe":
      return "bg-red-100 text-red-800";
    case "severe":
      return "bg-red-100 text-red-800 border-red-500";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function ProgressBar({
  score,
  maxScore,
  severity,
}: {
  score: number;
  maxScore: number;
  severity: string;
}) {
  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "normal":
        return "bg-green-500";
      case "mild":
        return "bg-yellow-500";
      case "moderate":
        return "bg-orange-500";
      case "moderate-severe":
        return "bg-red-500";
      default:
        return "bg-red-700";
    }
  };

  return (
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${getSeverityColor(
          severity
        )}`}
        style={{ width: `${(score / maxScore) * 100}%` }}
      />
    </div>
  );
}

function AssessmentHistory({ assessments }: { assessments: Assessment[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment History (Requiring Attention)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assessments.length > 0 ? (
            assessments.map((assessment) => (
              <div key={assessment.id} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {ASSESSMENT_DETAILS[assessment.assessment_type]?.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      {new Date(
                        assessment.assessment_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Score: {assessment.total_score}
                    </p>
                    <Badge
                      className={getBadgeColor(
                        ASSESSMENT_DETAILS[
                          assessment.assessment_type
                        ]?.severity(assessment.total_score)
                      )}
                    >
                      {assessment.severity_level}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No assessments requiring attention.</p>
          )}

          <Button variant="outline" className="w-full mt-3">
            View All History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ClinicalInterpretations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Interpretation Guidelines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2">PHQ-9 Depression</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>0-4:</span>
                <span className="text-green-600">Minimal</span>
              </div>
              <div className="flex justify-between">
                <span>5-9:</span>
                <span className="text-yellow-600">Mild</span>
              </div>
              <div className="flex justify-between">
                <span>10-14:</span>
                <span className="text-orange-600">Moderate</span>
              </div>
              <div className="flex justify-between">
                <span>15-19:</span>
                <span className="text-red-600">Mod. Severe</span>
              </div>
              <div className="flex justify-between">
                <span>20-27:</span>
                <span className="text-red-800">Severe</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">GAD-7 Anxiety</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>0-4:</span>
                <span className="text-green-600">Minimal</span>
              </div>
              <div className="flex justify-between">
                <span>5-9:</span>
                <span className="text-yellow-600">Mild</span>
              </div>
              <div className="flex justify-between">
                <span>10-14:</span>
                <span className="text-orange-600">Moderate</span>
              </div>
              <div className="flex justify-between">
                <span>15-21:</span>
                <span className="text-red-600">Severe</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">PCL-5 PTSD</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>0-32:</span>
                <span className="text-green-600">Below Threshold</span>
              </div>
              <div className="flex justify-between">
                <span>33-49:</span>
                <span className="text-yellow-600">Probable PTSD</span>
              </div>
              <div className="flex justify-between">
                <span>50-80:</span>
                <span className="text-red-600">Likely PTSD</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
