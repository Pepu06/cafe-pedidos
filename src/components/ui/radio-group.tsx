import React, { createContext, useContext } from 'react';

interface RadioGroupContextType {
    value: string;
    onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

export function RadioGroup({ children, value, onValueChange }: { children: React.ReactNode, value: string, onValueChange: (value: string) => void }) {
    return (
        <RadioGroupContext.Provider value={{ value, onChange: onValueChange }}>
            <div className="space-y-2">{children}</div>
        </RadioGroupContext.Provider>
    );
}

export function RadioGroupItem({ value, id }: { value: string, id: string }) {
    const context = useContext(RadioGroupContext);
    if (!context) throw new Error('RadioGroupItem must be used within a RadioGroup');

    return (
        <input
            type="radio"
            id={id}
            value={value}
            checked={context.value === value}
            onChange={() => context.onChange(value)}
            className="mr-2"
        />
    );
}
