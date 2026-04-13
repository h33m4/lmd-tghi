import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IDashboardData } from "@/types/dashboard";
import { Eye } from "lucide-react";
import React from "react";

type PreviewDashboardModalProps = {
  previewDialogOpen: boolean;
  setPreviewDialogOpen: (open: boolean) => void;
  previewDashboard?: IDashboardData;
};

function PreviewDashboardModal({
  previewDialogOpen,
  setPreviewDialogOpen,
  previewDashboard,
}: PreviewDashboardModalProps) {
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
                  {previewDashboard?.title}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        {previewDashboard && (
          <div className="px-6 pb-6">
            <div
              className="border rounded-xl overflow-hidden"
              style={{ height: "600px" }}
            >
              <iframe
                src={previewDashboard.embed_url}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title={`Preview: ${previewDashboard.title}`}
                className="rounded-xl"
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDashboardModal;
