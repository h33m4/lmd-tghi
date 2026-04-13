import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IDashboardData } from "@/types/dashboard";
import { Eye } from "lucide-react";
import React from "react";
import { Report } from "@/types/report";
import ReportRenderer from "./ReportRenderer2";

type PreviewReportModalProps = {
  previewDialogOpen: boolean;
  setPreviewDialogOpen: (open: boolean) => void;
  previewReport?: Report;
};

function PreviewReportModal({
  previewDialogOpen,
  setPreviewDialogOpen,
  previewReport,
}: PreviewReportModalProps) {
  return (
    <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-lg font-semibold">Preview Dashboard</span>
                <p className="text-sm text-gray-600 font-normal">
                  {previewReport?.title}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        {previewReport && <ReportRenderer report={previewReport} />}
      </DialogContent>
    </Dialog>
  );
}

export default PreviewReportModal;
