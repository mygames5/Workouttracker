import { useEffect, useState, type FormEvent } from 'react';
import type { WorkoutRecord } from '../types';

interface WorkoutFormProps {
  editingRecord: WorkoutRecord | null;
  onSubmit: (date: string, km: number) => void;
  onCancelEdit: () => void;
}

export default function WorkoutForm({ editingRecord, onSubmit, onCancelEdit }: WorkoutFormProps) {
  const [dateInput, setDateInput] = useState('');
  const [kmInput, setKmInput] = useState('');

  // подхватываем данные редактируемой записи в форму
  useEffect(() => {
    if (editingRecord) {
      setDateInput(editingRecord.date);
      setKmInput(String(editingRecord.km));
    } else {
      setDateInput('');
      setKmInput('');
    }
  }, [editingRecord]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const km = parseFloat(kmInput);
    if (!dateInput || isNaN(km) || km <= 0) return;

    onSubmit(dateInput, km);
    setDateInput('');
    setKmInput('');
  }

  return (
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
          {editingRecord && (
            <button type="button" className="btn-cancel" onClick={onCancelEdit}>
              Отмена
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
