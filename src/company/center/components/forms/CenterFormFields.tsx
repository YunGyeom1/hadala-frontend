import React from 'react';
import { CenterFormData } from '../../types';

interface FormFieldProps {
  label: string;
  name: keyof CenterFormData;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  onBlur?: () => void;
  error?: string;
  type?: 'text' | 'tel' | 'number' | 'time' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  className?: string;
  step?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  placeholder,
  required = false,
  className = "",
  step
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'checkbox') {
      onChange((e.target as HTMLInputElement).checked);
    } else {
      onChange(e.target.value);
    }
  };

  if (type === 'checkbox') {
    return (
      <div className={className}>
        <div className="flex items-center">
          <input
            type="checkbox"
            id={name}
            checked={value as boolean}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
            {label}
          </label>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        name={name}
        value={value as string}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        step={step}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

interface CenterFormFieldsProps {
  formData: CenterFormData;
  onChange: (field: keyof CenterFormData, value: string | boolean) => void;
  onBlur?: (field: keyof CenterFormData) => void;
  errors?: Record<string, string>;
}

export const CenterFormFields: React.FC<CenterFormFieldsProps> = ({
  formData,
  onChange,
  onBlur,
  errors = {}
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Center Name"
          name="name"
          value={formData.name}
          onChange={(value) => onChange('name', value as string)}
          onBlur={() => onBlur?.('name')}
          error={errors.name}
          required
        />
        <FormField
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={(value) => onChange('phone', value as string)}
          onBlur={() => onBlur?.('phone')}
          error={errors.phone}
          type="tel"
          placeholder="010-1234-5678"
        />
      </div>

      <FormField
        label="Address"
        name="address"
        value={formData.address}
        onChange={(value) => onChange('address', value as string)}
        onBlur={() => onBlur?.('address')}
        error={errors.address}
        placeholder="Seoul, Gangnam-gu..."
      />

      <FormField
        label="Region"
        name="region"
        value={formData.region}
        onChange={(value) => onChange('region', value as string)}
        onBlur={() => onBlur?.('region')}
        error={errors.region}
        placeholder="Gangnam-gu"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Latitude"
          name="latitude"
          value={formData.latitude}
          onChange={(value) => onChange('latitude', value as string)}
          onBlur={() => onBlur?.('latitude')}
          error={errors.latitude}
          type="number"
          step="any"
          placeholder="37.5665"
        />
        <FormField
          label="Longitude"
          name="longitude"
          value={formData.longitude}
          onChange={(value) => onChange('longitude', value as string)}
          onBlur={() => onBlur?.('longitude')}
          error={errors.longitude}
          type="number"
          step="any"
          placeholder="126.9780"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Operating Start Time"
          name="operating_start"
          value={formData.operating_start}
          onChange={(value) => onChange('operating_start', value as string)}
          onBlur={() => onBlur?.('operating_start')}
          error={errors.operating_start}
          type="time"
        />
        <FormField
          label="Operating End Time"
          name="operating_end"
          value={formData.operating_end}
          onChange={(value) => onChange('operating_end', value as string)}
          onBlur={() => onBlur?.('operating_end')}
          error={errors.operating_end}
          type="time"
        />
      </div>

      <FormField
        label="Operational"
        name="is_operational"
        value={formData.is_operational}
        onChange={(value) => onChange('is_operational', value as boolean)}
        type="checkbox"
      />
    </div>
  );
}; 