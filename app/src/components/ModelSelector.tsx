import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProviderIcon, getProviderColor } from "@/lib/utils";
import type { AIModel } from "@/types";

interface ModelSelectorProps {
  models: AIModel[];
  selectedModel: AIModel | null;
  onModelChange: (model: AIModel) => void;
  disabled?: boolean;
}

export function ModelSelector({
  models,
  selectedModel,
  onModelChange,
  disabled,
}: ModelSelectorProps) {
  // Group models by provider
  const groupedModels = models.reduce(
    (acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = [];
      }
      acc[model.provider].push(model);
      return acc;
    },
    {} as Record<string, AIModel[]>
  );

  return (
    <Select
      value={selectedModel?.id || ""}
      onValueChange={(value) => {
        const model = models.find((m) => m.id === value);
        if (model) onModelChange(model);
      }}
      disabled={disabled}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select model...">
          {selectedModel && (
            <span className="flex items-center gap-2">
              <span>{getProviderIcon(selectedModel.provider)}</span>
              <span className={getProviderColor(selectedModel.provider)}>
                {selectedModel.name}
              </span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedModels).map(([provider, providerModels]) => (
          <div key={provider}>
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
              {getProviderIcon(provider)} {provider}
            </div>
            {providerModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <span className={getProviderColor(model.provider)}>
                  {model.name}
                </span>
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}

