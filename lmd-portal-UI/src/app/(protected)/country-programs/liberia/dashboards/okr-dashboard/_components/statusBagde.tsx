import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Clock, Eye, XCircle } from "lucide-react";
import { useOkrStatusColors } from "./useOkrColors";
import { OkrStatus } from "@/types/okrTracker";

interface StatusBadgeProps {
  status: OkrStatus;
  className?: string;
  showIcon?: boolean;
  variant?: "default" | "minimal" | "detailed";
}

/**
 * StatusBadge Component
 * Displays OKR status with appropriate icon and styling
 *
 * @param status - The OKR status type
 * @param className - Additional Tailwind classes
 * @param showIcon - Whether to show the icon (default: true)
 * @param variant - Badge variant style
 */
export const StatusBadge = ({
  status,
  className,
  showIcon = true,
  variant = "default",
}: StatusBadgeProps) => {
  const { getStatusBadgeClasses, getStatusLabel, getStatusDescription } =
    useOkrStatusColors();

  // Status configuration with icons and labels
  const statusConfig: Record<
    OkrStatus,
    {
      label: string;
      description: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    // ✅ Achieved - Green checkmark
    achieved: {
      label: "Achieved",
      description: "Goal has been successfully achieved",
      icon: CheckCircle2,
    },

    // ⚡ On Track - Green checkmark (positive)
    on_track: {
      label: "On Track",
      description: "Progress is on track to meet the goal",
      icon: CheckCircle2,
    },

    // ⚠️ Delayed - Clock icon (time-based)
    delayed: {
      label: "Delayed",
      description: "Progress is behind schedule but recoverable",
      icon: Clock,
    },

    // 🔍 Under Review - Eye icon (inspection)
    okr_under_review: {
      label: "Under Review",
      description: "Status is being reviewed and requires attention",
      icon: Eye,
    },

    // 🚨 At Risk - Alert icon (danger)
    at_risk: {
      label: "At Risk",
      description: "Goal is at significant risk of not being achieved",
      icon: AlertCircle,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;
  const badgeClasses = getStatusBadgeClasses(status);

  // Variant: minimal (just badge, no icon)
  if (variant === "minimal") {
    return (
      <span
        className={cn(
          "inline-block px-2.5 py-1 rounded-full text-xs font-semibold border",
          badgeClasses,
          className,
        )}
        title={config.description}
      >
        {config.label}
      </span>
    );
  }

  // Variant: detailed (badge with description as tooltip)
  if (variant === "detailed") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border cursor-help",
          badgeClasses,
          className,
        )}
        title={config.description}
      >
        {showIcon && <Icon className="w-4 h-4 flex-shrink-0" />}
        <span>{config.label}</span>
      </div>
    );
  }

  // Default variant: standard badge with icon
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
        badgeClasses,
        className,
      )}
      title={config.description}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      {config.label}
    </div>
  );
};

// ============================================================================
// ADDITIONAL BADGE VARIANTS
// ============================================================================

/**
 * Compact version of StatusBadge for space-constrained layouts
 */
export const StatusBadgeCompact = ({ status, className }: StatusBadgeProps) => {
  return (
    <StatusBadge status={status} variant="minimal" className={className} />
  );
};

/**
 * Badge with detailed tooltip information
 */
export const StatusBadgeDetailed = ({
  status,
  className,
}: StatusBadgeProps) => {
  return (
    <StatusBadge status={status} variant="detailed" className={className} />
  );
};

/**
 * Badge without icon for clean layouts
 */
export const StatusBadgeNoIcon = ({ status, className }: StatusBadgeProps) => {
  return <StatusBadge status={status} showIcon={false} className={className} />;
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Usage Examples:
 *
 * // Default badge with icon
 * <StatusBadge status="on_track" />
 *
 * // Minimal variant (compact)
 * <StatusBadge status="achieved" variant="minimal" />
 *
 * // Detailed variant with tooltip
 * <StatusBadge status="at_risk" variant="detailed" />
 *
 * // Without icon
 * <StatusBadge status="delayed" showIcon={false} />
 *
 * // With custom classes
 * <StatusBadge status="okr_under_review" className="text-sm" />
 *
 * // Compact version
 * <StatusBadgeCompact status="achieved" />
 *
 * // Detailed version
 * <StatusBadgeDetailed status="at_risk" />
 *
 * // No icon version
 * <StatusBadgeNoIcon status="delayed" />
 */
