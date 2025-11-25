'use client';

import React, { useState, useEffect } from 'react';
import { TAG_CATEGORIES, TagCategory } from '@/lib/tags';
import { X } from 'lucide-react';

interface TagManagerProps {
  selectedTags: Array<{ tag: string; category: TagCategory }>;
  onTagsChange: (tags: Array<{ tag: string; category: TagCategory }>) => void;
}

export default function TagManager({ selectedTags, onTagsChange }: TagManagerProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<TagCategory, boolean>>({
    style: true,
    material: false,
    season: false,
    size: false,
    type: true,
    color: false,
    condition: true,
    vibe: false,
  });

  const toggleCategory = (category: TagCategory) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const addTag = (tag: string, category: TagCategory) => {
    // Check if tag already selected
    if (selectedTags.some(t => t.tag === tag)) return;

    const newTags = [...selectedTags, { tag, category }];
    onTagsChange(newTags);
  };

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter(t => t.tag !== tag);
    onTagsChange(newTags);
  };

  return (
    <div className="space-y-6">
      {/* Selected Tags Display */}
      <div>
        <label className="block text-sm font-semibold mb-3 uppercase tracking-wide">
          Selected Tags ({selectedTags.length})
        </label>
        {selectedTags.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No tags selected yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(({ tag, category }) => (
              <div
                key={tag}
                className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-full text-sm font-semibold"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-gray-300 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tag Categories */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">Browse Tags</h3>

        <div className="space-y-4">
          {Object.entries(TAG_CATEGORIES).map(([categoryKey, tags]) => {
            const category = categoryKey as TagCategory;
            const isExpanded = expandedCategories[category];

            return (
              <div key={category} className="border-b border-gray-200 pb-4 last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="flex justify-between items-center w-full font-semibold text-left hover:text-gray-700 transition-colors"
                >
                  <span className="uppercase tracking-wide text-sm">{category}</span>
                  <span className={`text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {isExpanded && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {tags.map((tag) => {
                      const isSelected = selectedTags.some(t => t.tag === tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag, category)}
                          disabled={isSelected}
                          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-black text-white cursor-not-allowed'
                              : 'bg-white text-black border border-gray-300 hover:border-black hover:bg-gray-50'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Select tags that accurately describe your product. More specific tags help buyers find your items and improve your visibility in personalized recommendations!
        </p>
      </div>
    </div>
  );
}
