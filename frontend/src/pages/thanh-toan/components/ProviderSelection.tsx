interface ProviderSelectionProps {
    providers: string[];
    selectedProvider: string;
    onProviderChange: (provider: string) => void;
}

export function ProviderSelection({ providers, selectedProvider, onProviderChange }: ProviderSelectionProps) {
    if (providers.length === 0) return null;

    return (
        <div className="mt-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
                Chọn nhà cung cấp
            </label>
            <select
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                value={selectedProvider}
                onChange={(e) => onProviderChange(e.target.value)}
            >
                {providers.map((provider) => (
                    <option key={provider} value={provider}>
                        {provider}
                    </option>
                ))}
            </select>
        </div>
    );
}
