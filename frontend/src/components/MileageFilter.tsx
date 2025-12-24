"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { useSearch } from '../context/SearchContext';

const mileageOptions = [
  { label: 'Any Distance', value: 'any' },
  { label: 'Under 1 mile', value: '1' },
  { label: 'Under 3 miles', value: '3' }, // Added 'Under 3 miles'
  { label: 'Under 5 miles', value: '5' },
  // Removed 'Under 10 miles' and 'Under 25 miles'
];

const MileageFilter = () => {
  const { mileageRange, setMileageRange } = useSearch();

  const handleMileageChange = (value: string) => {
    if (value === 'any') {
      setMileageRange(null);
    } else {
      setMileageRange(Number(value));
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="mileage-filter">Distance</Label>
      <Select onValueChange={handleMileageChange} value={mileageRange?.toString() || 'any'}>
        <SelectTrigger id="mileage-filter" className="w-full">
          <SelectValue placeholder="Select distance" />
        </SelectTrigger>
        <SelectContent>
          {mileageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MileageFilter;