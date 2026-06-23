import { useState } from 'react';
import type { WorkoutRecord } from '../types';
import WorkoutForm from './WorkoutForm';
import WorkoutTable from './WorkoutTable';
import './WorkoutTracker.css';

// начальные данные в формате ISO (YYYY-MM-DD)
const initialData: WorkoutRecord[] = [
  { date: '2019-07-20', km: 5.7 },
  { date: '2019-07-19', km: 14.2 },
  { date: '2019-07-18', km: 3.4 },
];

// сортировка записей
function sortByDate(records: WorkoutRecord[]): WorkoutRecord[] {
  return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function WorkoutTracker() {
  const [records, setRecords] = useState<WorkoutRecord[]>(initialData);
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const editingRecord = records.find((r) => r.date === editingDate) ?? null;

  function handleSubmit(date: string, km: number) {
    if (editingDate) {
      setRecords((prev) =>
        sortByDate(prev.map((r) => (r.date === editingDate ? { date, km } : r)))
      );
      setEditingDate(null);
    } else {
      setRecords((prev) => {
        const exists = prev.find((r) => r.date === date);
        const updated = exists
          ? prev.map((r) => (r.date === date ? { ...r, km: parseFloat((r.km + km).toFixed(1)) } : r))
          : [...prev, { date, km }];
        return sortByDate(updated);
      });
    }
  }

  function handleEdit(record: WorkoutRecord) {
    setEditingDate(record.date);
  }

  function handleCancelEdit() {
    setEditingDate(null);
  }

  function handleDelete(date: string) {
    setRecords((prev) => prev.filter((r) => r.date !== date));
    if (editingDate === date) setEditingDate(null);
  }

  return (
    <div className="tracker-container">
      <WorkoutForm
        editingRecord={editingRecord}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />
      <WorkoutTable
        records={records}
        editingDate={editingDate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
