import { useEffect, useState } from "react";
import { Bot } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { fetchModels } from "@/lib/utils";
import type { ModelConfig, ModelProvider } from "@/types";

interface ModelSelectorProps {
  selectedModel: { provider: ModelProvider; name: string } | null;
  onSelectModel: (provider: ModelProvider, name: string) => void;
}

export function ModelSelector({
  selectedModel,
  onSelectModel,
}: ModelSelectorProps) {
  const [models, setModels] = useState<ModelConfig[]>([]);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const data = await fetchModels();
      setModels(data);
      if (data.length > 0 && !selectedModel) {
        onSelectModel(data[0].provider, data[0].id);
      }
    } catch (error) {
      console.error("Failed to load models:", error);
    }
  };

  const currentModel = models.find(
    (m) =>
      m.provider === selectedModel?.provider && m.name === selectedModel?.name
  );

  const handleValueChange = (value: string) => {
    const [provider, id] = value.split(":") as [ModelProvider, string];
    onSelectModel(provider, id);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-accent" />
        <Select
          value={
            selectedModel
              ? `${selectedModel.provider}:${selectedModel.name}`
              : ""
          }
          onValueChange={handleValueChange}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {console.log(models)}
            {models.map((model) => (
              <SelectItem
                key={`${model.provider}:${model.id}`}
                value={`${model.provider}:${model.id}`}
              >
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {currentModel && (
        <span className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent border border-accent/30">
          {currentModel.name}
        </span>
      )}
    </div>
  );
}
