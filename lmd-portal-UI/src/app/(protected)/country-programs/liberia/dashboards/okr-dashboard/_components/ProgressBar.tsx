import { cn } from "@/lib/utils";
import { useOkrStatusColors } from "./useOkrColors";
import { OkrStatus } from "@/types/okrTracker";

interface ProgressBarProps {
  value: number;
  status: OkrStatus;
  className?: string;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * ProgressBar Component
 * Displays progress with status-based color coding
 *
 * @param value - Progress value (0-100)
 * @param status - The OKR status type
 * @param className - Additional Tailwind classes
 * @param label - Custom label (default: "Progress")
 * @param showPercentage - Show percentage value (default: true)
 * @param animated - Enable animation (default: true)
 * @param size - Bar size: "sm" | "md" | "lg"
 */
export const ProgressBar = ({
  value,
  status,
  className,
  label = "Progress",
  showPercentage = true,
  animated = true,
  size = "md",
}: ProgressBarProps) => {
  const { getStatusColors } = useOkrStatusColors();

  // Get color for the status
  const statusColor = getStatusColors(status);

  // Clamp value between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  // Size configuration
  const sizeConfig = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3",
  };

  return (
    <div className={cn("space-y-1", className)}>
      {/* Label and Percentage */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-medium">{label}</span>
        {showPercentage && (
          <span className="text-foreground font-semibold">{clampedValue}%</span>
        )}
      </div>

      {/* Progress Bar Container */}
      <div
        className={cn(
          "bg-secondary rounded-full overflow-hidden",
          sizeConfig[size],
        )}
      >
        {/* Progress Fill */}
        <div
          className={cn(
            "h-full rounded-full transition-all origin-left",
            statusColor.mainBg,
            animated && "duration-1000 ease-out",
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>

      {/* Optional: Status indicator text below bar */}
      {clampedValue >= 100 && (
        <p className={cn("text-xs font-medium", statusColor.text)}>
          ✓ Complete
        </p>
      )}
    </div>
  );
};

// ============================================================================
// PROGRESS BAR VARIANTS
// ============================================================================

/**
 * Compact version of ProgressBar with smaller sizing
 */
export const ProgressBarCompact = ({
  value,
  status,
  className,
  label = "Progress",
}: ProgressBarProps) => {
  return (
    <ProgressBar
      value={value}
      status={status}
      className={className}
      label={label}
      size="sm"
      showPercentage={false}
    />
  );
};

/**
 * Large version with prominent display
 */
export const ProgressBarLarge = ({
  value,
  status,
  className,
  label = "Progress",
}: ProgressBarProps) => {
  return (
    <ProgressBar
      value={value}
      status={status}
      className={className}
      label={label}
      size="lg"
    />
  );
};

/**
 * Static version without animation
 */
export const ProgressBarStatic = ({
  value,
  status,
  className,
  label = "Progress",
}: ProgressBarProps) => {
  return (
    <ProgressBar
      value={value}
      status={status}
      className={className}
      label={label}
      animated={false}
    />
  );
};

/**
 * Minimal version - bar only, no labels
 */
export const ProgressBarMinimal = ({
  value,
  status,
  className,
  animated = true,
  size = "sm",
}: ProgressBarProps) => {
  const { getStatusColors } = useOkrStatusColors();
  const statusColor = getStatusColors(status);
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const sizeConfig = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3",
  };

  return (
    <div
      className={cn(
        "bg-secondary rounded-full overflow-hidden",
        sizeConfig[size],
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all origin-left",
          statusColor.mainBg,
          animated && "duration-1000 ease-out",
        )}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};

/**
 * Inline version - horizontal layout
 */
export const ProgressBarInline = ({
  value,
  status,
  className,
  label = "Progress",
}: ProgressBarProps) => {
  const { getStatusColors } = useOkrStatusColors();
  const statusColor = getStatusColors(status);
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out origin-left",
            statusColor.mainBg,
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-foreground w-12 text-right">
        {clampedValue}%
      </span>
    </div>
  );
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Usage Examples:
 *
 * // Default progress bar
 * <ProgressBar value={75} status="on_track" />
 *
 * // With custom label
 * <ProgressBar value={50} status="delayed" label="Key Result 1" />
 *
 * // Without percentage display
 * <ProgressBar value={100} status="achieved" showPercentage={false} />
 *
 * // Static (no animation)
 * <ProgressBar value={60} status="okr_under_review" animated={false} />
 *
 * // Large size
 * <ProgressBar value={85} status="on_track" size="lg" />
 *
 * // Compact version
 * <ProgressBarCompact value={70} status="on_track" />
 *
 * // Minimal version (bar only)
 * <ProgressBarMinimal value={80} status="achieved" />
 *
 * // Inline version (horizontal layout)
 * <ProgressBarInline value={65} status="delayed" />
 *
 * // Without animation
 * <ProgressBarStatic value={75} status="at_risk" />
 *
 * // Large version
 * <ProgressBarLarge value={90} status="on_track" />
 */
