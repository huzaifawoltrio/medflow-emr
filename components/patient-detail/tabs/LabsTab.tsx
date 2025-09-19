import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  FlaskConical,
  Scan,
  Clipboard,
  TrendingUp,
  Activity,
} from "lucide-react";
import { VitalsSection } from "./LabsTabsComponents/VitalsSection";
import { LabTrendsSection } from "./LabsTabsComponents/LabsTrendsSection";
import { RecentResultsSection } from "./LabsTabsComponents/RecentResultsSection";
import { PendingOrdersSection } from "./LabsTabsComponents/PendingOrdersSection";
import { RatingScalesSection } from "./LabsTabsComponents/RatingScalesSection";
import { ImagingTab } from "./ImagingTab";

interface LabsTabProps {
  patientData: any;
  setIsOrderLabOpen: (open: boolean) => void;
}

export function LabsTab({ patientData, setIsOrderLabOpen }: LabsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Results & Diagnostics</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsOrderLabOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Order Lab Test
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Order Imaging
          </Button>
        </div>
      </div>

      <Tabs defaultValue="labs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="labs" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Results Review
          </TabsTrigger>
          <TabsTrigger value="imaging" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Medical Imaging
          </TabsTrigger>
          <TabsTrigger value="scales" className="flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            Rating Scales
          </TabsTrigger>
        </TabsList>

        <TabsContent value="labs" className="mt-6">
          <div className="space-y-6">
            <VitalsSection />
            <LabTrendsSection />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentResultsSection patientData={patientData} />
              <PendingOrdersSection />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="imaging" className="mt-6">
          <ImagingTab patientData={patientData} />
        </TabsContent>

        <TabsContent value="scales" className="mt-6">
          <RatingScalesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
