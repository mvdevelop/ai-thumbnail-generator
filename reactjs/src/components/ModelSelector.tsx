import { Cpu, Zap, Brain, Settings, Check } from "lucide-react";
import { aiService } from "../lib/ai-service";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const availableModels = aiService.getAvailableModels();

  const groupedModels = availableModels.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, typeof availableModels>);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return <Zap className="w-5 h-5" />;
      case 'anthropic': return <Brain className="w-5 h-5" />;
      case 'stability': return <Cpu className="w-5 h-5" />;
      case 'dall-e': return <Zap className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai': return 'from-gray-600 to-gray-700 border-gray-500';
      case 'anthropic': return 'from-purple-600 to-purple-700 border-purple-500';
      case 'stability': return 'from-blue-600 to-blue-700 border-blue-500';
      case 'dall-e': return 'from-green-600 to-green-700 border-green-500';
      default: return 'from-zinc-600 to-zinc-700 border-zinc-500';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-200">AI Model</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groupedModels).map(([provider, models]) => (
          <div key={provider} className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              {getProviderIcon(provider)}
              <span className="text-sm font-medium text-zinc-300 capitalize">{provider}</span>
            </div>

            {models.map((model) => {
              const isSelected = selectedModel === model.id;

              return (
                <button
                  key={model.id}
                  onClick={() => onModelChange(model.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 w-full text-left ${isSelected
                    ? `border-transparent bg-gradient-to-r ${getProviderColor(provider)} text-white shadow-lg`
                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${isSelected ? 'text-white' : 'text-zinc-200'}`}>{model.name}</h3>
                    {isSelected && <Check className="w-5 h-5 text-white" />}
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className={isSelected ? 'text-white/80' : 'text-zinc-400'}>Max Tokens:</span>
                      <span className={isSelected ? 'text-white' : 'text-zinc-300'}>{model.maxTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isSelected ? 'text-white/80' : 'text-zinc-400'}>Temperature:</span>
                      <span className={isSelected ? 'text-white' : 'text-zinc-300'}>{model.temperature}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isSelected ? 'text-white/80' : 'text-zinc-400'}>Premium:</span>
                      <span className={isSelected ? 'text-white' : 'text-zinc-300'}>{model.isPremium ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="text-xs text-white/70 mb-1">Capabilities:</div>
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities.styleGeneration && (
                          <span className="px-2 py-1 bg-white/20 rounded text-xs">Style</span>
                        )}
                        {model.capabilities.colorSchemeMatching && (
                          <span className="px-2 py-1 bg-white/20 rounded text-xs">Color</span>
                        )}
                        {model.capabilities.promptOptimization && (
                          <span className="px-2 py-1 bg-white/20 rounded text-xs">Prompt</span>
                        )}
                        {model.capabilities.aspectRatioOptimization && (
                          <span className="px-2 py-1 bg-white/20 rounded text-xs">Aspect</span>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;