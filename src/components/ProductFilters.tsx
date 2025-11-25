'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FilterOptions {
  priceRange: [number, number];
  category: string;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'popular';
}

interface ProductFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  categories?: string[];
}

export default function ProductFilters({ onFiltersChange, categories = [] }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    category: '',
    sortBy: 'newest',
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    category: true,
    sort: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (value: number, type: 'min' | 'max') => {
    const newRange: [number, number] = [...filters.priceRange];
    if (type === 'min') {
      newRange[0] = value;
    } else {
      newRange[1] = value;
    }
    const updated = { ...filters, priceRange: newRange };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const handleCategoryChange = (cat: string) => {
    const updated = { ...filters, category: filters.category === cat ? '' : cat };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const handleSortChange = (sort: FilterOptions['sortBy']) => {
    const updated = { ...filters, sortBy: sort };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const resetFilters = () => {
    const reset: FilterOptions = {
      priceRange: [0, 10000],
      category: '',
      sortBy: 'newest',
    };
    setFilters(reset);
    onFiltersChange(reset);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold uppercase tracking-wide">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Reset
        </button>
      </div>

      {/* Price Range */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex justify-between items-center w-full mb-3 font-semibold"
        >
          Price Range
          <ChevronDown size={18} className={`transform transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600">Min: ₹{filters.priceRange[0]}</label>
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(Number(e.target.value), 'min')}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Max: ₹{filters.priceRange[1]}</label>
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(Number(e.target.value), 'max')}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={() => toggleSection('category')}
            className="flex justify-between items-center w-full mb-3 font-semibold"
          >
            Category
            <ChevronDown size={18} className={`transform transition-transform ${expandedSections.category ? 'rotate-180' : ''}`} />
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.category === cat}
                    onChange={() => handleCategoryChange(cat)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sort By */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => toggleSection('sort')}
          className="flex justify-between items-center w-full mb-3 font-semibold"
        >
          Sort By
          <ChevronDown size={18} className={`transform transition-transform ${expandedSections.sort ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.sort && (
          <div className="space-y-2">
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'popular', label: 'Most Liked' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value={value}
                  checked={filters.sortBy === value as FilterOptions['sortBy']}
                  onChange={() => handleSortChange(value as FilterOptions['sortBy'])}
                  className="w-4 h-4"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
