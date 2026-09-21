"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import packageJson from "../../package.json";

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
  const appVersion = packageJson.version;
  const currentYear = new Date().getFullYear();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Support</DialogTitle>
          <DialogDescription>
            CareerTrack — Job Search Assistant
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Version</h3>
            <p className="text-sm text-muted-foreground">v{appVersion}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Copyright</h3>
            <p className="text-sm text-muted-foreground">
              © {currentYear} CareerTrack. All rights reserved.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
