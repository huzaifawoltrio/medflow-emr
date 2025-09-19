import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clipboard } from "lucide-react";
import { RatingScalesChart } from "./RatingScalesChart";

const ratingScaleData = [
  { date: "2023-01-01", PHQ9: 12, GAD7: 8, PTSD: 25 },
  { date: "2023-02-01", PHQ9: 8, GAD7: 7, PTSD: 30 },
  { date: "2023-03-01", PHQ9: 6, GAD7: 5, PTSD: 20 },
  { date: "2023-04-01", PHQ9: 4, GAD7: 3, PTSD: 15 },
];

const recentRatingScales = [
  {
    name: "PHQ-9 Depression Assessment",
    date: "2025-09-01",
    score: 4,
    maxScore: 27,
    interpretation: "Minimal",
    severity: "normal",
  },
  {
    name: "GAD-7 Anxiety Assessment",
    date: "2025-09-01",
    score: 3,
    maxScore: 21,
    interpretation: "Minimal",
    severity: "normal",
  },
  {
    name: "PCL-5 PTSD Assessment",
    date: "2025-08-15",
    score: 25,
    maxScore: 80,
    interpretation: "Below Threshold",
    severity: "normal",
  },
];

export function RatingScalesSection() {
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
          <RatingScalesChart data={ratingScaleData} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAssessmentScores />
        <AssessmentHistory />
      </div>

      <ClinicalInterpretations />
    </div>
  );
}

function RecentAssessmentScores() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Assessment Scores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentRatingScales.map((scale, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">{scale.name}</h4>
                <p className="text-sm text-slate-600">
                  Completed: {new Date(scale.date).toLocaleDateString()}
                </p>
              </div>
              <Badge
                className={
                  scale.severity === "normal"
                    ? "bg-green-100 text-green-800"
                    : scale.severity === "mild"
                    ? "bg-yellow-100 text-yellow-800"
                    : scale.severity === "moderate"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {scale.interpretation}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Score: {scale.score}/{scale.maxScore}
                </span>
                <span className="text-xs text-slate-500">
                  {Math.round((scale.score / scale.maxScore) * 100)}%
                </span>
              </div>

              <ProgressBar scale={scale} />
            </div>

            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <Button variant="outline" size="sm">
                Compare Previous
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ProgressBar({ scale }: { scale: (typeof recentRatingScales)[0] }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "normal":
        return "bg-green-500";
      case "mild":
        return "bg-yellow-500";
      case "moderate":
        return "bg-orange-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${getSeverityColor(
          scale.severity
        )}`}
        style={{
          width: `${(scale.score / scale.maxScore) * 100}%`,
        }}
      />
    </div>
  );
}

function AssessmentHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-medium">PHQ-9 Depression Screen</p>
                <p className="text-sm text-slate-600">July 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Score: 4</p>
                <Badge className="bg-green-100 text-green-800">Minimal</Badge>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-medium">GAD-7 Anxiety Screen</p>
                <p className="text-sm text-slate-600">July 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Score: 3</p>
                <Badge className="bg-green-100 text-green-800">Minimal</Badge>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-medium">AUDIT Alcohol Screen</p>
                <p className="text-sm text-slate-600">June 20, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Score: 1</p>
                <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
              </div>
            </div>
          </div>

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
