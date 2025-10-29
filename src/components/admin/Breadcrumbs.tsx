"use client";

import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-m ${className}`}>
      {items.map((item, index) => {
        const isLastItem = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <BreadcrumbLink item={item} isLastItem={isLastItem} />

            {!isLastItem && (
              <span className="text-neutral-60">
                &gt;
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

const BreadcrumbLink: React.FC<{ item: BreadcrumbItem; isLastItem: boolean }> = ({ item, isLastItem }) => {
  if (isLastItem || !item.href) {
    return (
      <span className="font-medium text-neutral-90" aria-current="page">
        {item.label}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className="font-medium text-neutral-60 hover:text-neutral-90 transition-colors"
    >
      {item.label}
    </Link>
  );
};

