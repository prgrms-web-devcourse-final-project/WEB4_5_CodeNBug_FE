import { CheckCircle, Circle } from "lucide-react";
import { Separator } from "./separator";

export const Stepper = ({
  steps,
  active,
}: {
  steps: string[];
  active: number;
}) => (
  <div className="flex items-center gap-4 mb-6">
    {steps.map((s, i) => (
      <div key={s} className="flex items-center gap-2 text-sm">
        {i < active ? (
          <CheckCircle className="w-5 h-5 text-primary" />
        ) : (
          <Circle
            className={`w-5 h-5 ${
              i === active ? "text-primary" : "text-muted-foreground"
            }`}
          />
        )}
        <span
          className={i === active ? "font-medium" : "text-muted-foreground"}
        >
          {s}
        </span>
        {i !== steps.length - 1 && (
          <Separator orientation="vertical" className="h-5" />
        )}
      </div>
    ))}
  </div>
);
