"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { useSearch } from '../context/SearchContext';

const calorieRanges = [
  { label: 'Any Calories', value: 'any' },
  { label: 'Under 300', value: '300' }, // Added
  { label: 'Under 400', value: '400' }, // Added
  { label: 'Under 500', value: '500' },
  { label: 'Under 1000', value: '1000' },
  // Removed 'Under 1500'
];

const CalorieFilter = () => {
  const { calorieRange, setCalorieRange } = useSearch();

  const handleCalorieChange = (value: string) => {
    if (value === 'any') {
      setCalorieRange(null);
    } else {
      setCalorieRange(Number(value));
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="calorie-filter">Calories</Label>
      <Select onValueChange={handleCalorieChange} value={calorieRange?.toString() || 'any'}>
        <SelectTrigger id="calorie-filter" className="w-full">
          <SelectValue placeholder="Select calorie range" />
        </SelectTrigger>
        <SelectContent>
          {calorieRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CalorieFilter;