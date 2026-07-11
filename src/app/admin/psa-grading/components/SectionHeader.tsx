import React from 'react';

type Props = {
  title: string;
  action?: React.ReactNode;
};

export default function SectionHeader({ title, action }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}
