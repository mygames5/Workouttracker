import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { WorkoutRecord } from '../types';
import './WorkoutTracker.css';

// начальные данные в формате ISO (YYYY-MM-DD)
const initialData: WorkoutRecord[] = [
  { date: '2019-07-20', km: 5.7 },
  { date: '2019-07-19', km: 14.2 },
  { date: '2019-07-18', km: 3.4 },
];

// вспомогательная функция для форматирования даты для отображения
function formatDateForDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
}

// сортировка записей
function sortByDate(records: WorkoutRecord[]): WorkoutRecord[] {
  return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function WorkoutTracker() {
  const [records, setRecords] = useState<WorkoutRecord[]>(initialData);
  const [dateInput, setDateInput] = useState('');
  const [kmInput, setKmInput] = useState('');
  const [editingDate, setEditingDate] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const km = parseFloat(kmInput);
    if (!dateInput || isNaN(km) || km <= 0) return;

    if (editingDate) {
      setRecords((prev) =>
        sortByDate(prev.map((r) => (r.date === editingDate ? { date: dateInput, km } : r)))
      );
      setEditingDate(null);
    } else {
      setRecords((prev) => {
        const exists = prev.find((r) => r.date === dateInput);
        const updated = exists
          ? prev.map((r) => (r.date === dateInput ? { ...r, km: parseFloat((r.km + km).toFixed(1)) } : r))
          : [...prev, { date: dateInput, km }];
        return sortByDate(updated);
      });
    }

    setDateInput('');
    setKmInput('');
  }

  function handleEdit(record: WorkoutRecord) {
    setDateInput(record.date);
    setKmInput(String(record.km));
    setEditingDate(record.date);
  }

  function handleCancelEdit() {
    setEditingDate(null);
    setDateInput('');
    setKmInput('');
  }

  function handleDelete(date: string) {
    setRecords((prev) => prev.filter((r) => r.date !== date));
  }

  return (
    <div className="tracker-container">
      <form className="tracker-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Дата</label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Пройдено км</label>
            <input
              type="number"
              placeholder="5.7"
              step="0.1"
              min="0.1"
              value={kmInput}
              onChange={(e) => setKmInput(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-ok">OK</button>
            {editingDate && (
              <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                Отмена
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="table-header">
        <div className="col-date">Дата</div>
        <div className="col-km">Пройдено км</div>
        <div className="col-actions">Действия</div>
      </div>

      <div className="table-body">
        {records.length === 0 ? (
          <div className="empty-state">Нет данных о тренировках</div>
        ) : (
          records.map((record) => (
            <div
              key={record.date}
              className={`table-row${editingDate === record.date ? ' editing' : ''}`}
            >
              <div className="col-date">{formatDateForDisplay(record.date)}</div>
              <div className="col-km">{record.km}</div>
              <div className="col-actions">
                <button className="action-btn edit-btn" title="Редактировать" onClick={() => handleEdit(record)}>✎</button>
                <button className="action-btn delete-btn" title="Удалить" onClick={() => handleDelete(record.date)}>✕</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}