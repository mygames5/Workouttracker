import type { WorkoutRecord } from '../types';

interface WorkoutTableProps {
  records: WorkoutRecord[];
  editingDate: string | null;
  onEdit: (record: WorkoutRecord) => void;
  onDelete: (date: string) => void;
}

// вспомогательная функция для форматирования даты для отображения
function formatDateForDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
}

export default function WorkoutTable({ records, editingDate, onEdit, onDelete }: WorkoutTableProps) {
  return (
    <>
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
                <button className="action-btn edit-btn" title="Редактировать" onClick={() => onEdit(record)}>✎</button>
                <button className="action-btn delete-btn" title="Удалить" onClick={() => onDelete(record.date)}>✕</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
