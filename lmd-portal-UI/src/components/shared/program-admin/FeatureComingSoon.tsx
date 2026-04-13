import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

const FeatureComingSoonCard = ({
  title,
  description,
  icon: Icon,
  cardClassName,
}: {
  title: string;
  description: string;
  icon: any;
  cardClassName?: string;
}) => (
  <Card
    className={cn(
      "relative overflow-hidden border-dashed border-2 border-gray-200",
      cardClassName
    )}
  >
    <CardContent className="p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-gray-50 rounded-xl">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lmh-pink mb-2">{title}</h3>
          <p className="text-sm text- mb-3">{description}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            Coming Soon
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default FeatureComingSoonCard;
