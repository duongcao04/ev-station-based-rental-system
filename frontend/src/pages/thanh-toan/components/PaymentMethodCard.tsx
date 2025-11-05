import { CheckCircle } from 'lucide-react';

export type PaymentMethod = 'credit_card' | 'e_wallet' | 'bank_transfer' | 'cash';

export interface PaymentMethodOption {
    id: PaymentMethod;
    name: string;
    icon: React.ReactNode;
    description: string;
    providers?: string[];
}

interface PaymentMethodCardProps {
    method: PaymentMethodOption;
    isSelected: boolean;
    onSelect: (methodId: PaymentMethod) => void;
}

export function PaymentMethodCard({ method, isSelected, onSelect }: PaymentMethodCardProps) {
    return (
        <button
            onClick={() => onSelect(method.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${isSelected
                    ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`p-2 rounded-lg ${isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    {method.icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                {isSelected && <CheckCircle className="w-6 h-6 text-purple-600" />}
            </div>
        </button>
    );
}
