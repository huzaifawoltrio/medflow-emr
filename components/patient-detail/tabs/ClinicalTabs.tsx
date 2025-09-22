// components/patient-detail/ClinicalTabs.tsx
import { cn } from "@/lib/utils";

interface ClinicalTab {
  id: string;
  label: string;
}

interface ClinicalTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  clinicalTabs: ClinicalTab[];
}

export function ClinicalTabs({
  activeTab,
  setActiveTab,
  clinicalTabs,
}: ClinicalTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-1 overflow-x-auto">
        {clinicalTabs.map((tab) => {
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center py-3 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "border-blue-800 text-blue-800 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
