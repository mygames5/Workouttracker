import { useState } from 'react';
import './WorkoutTracker.css';

// начальные данные для демонстрации
const initialData = [
  { date: '20.07.2019', km: 5.7 },
  { date: '19.07.2019', km: 14.2 },
  { date: '18.07.2019', km: 3.4 },
];

// преобразует дату из формата дд.мм.гггг в объект Date для сортировки
function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('.');
  return new Date(`${year}-${month}-${day}`);
}

// сортирует записи по дате — от новой к старой
function sortByDate(records) {
  return [...records].sort((a, b) => parseDate(b.date) - parseDate(a.date));
}

// компонент учёта тренировок
export default function WorkoutTracker() {
  const [records, setRecords] = useState(initialData);
  const [dateInput, setDateInput] = useState('');
  const [kmInput, setKmInput] = useState('');

  // режим редактирования: храним дату редактируемой записи
  const [editingDate, setEditingDate] = useState(null);

  // добавляем или обновляем запись при сабмите формы
  function handleSubmit(e) {
    e.preventDefault();

    const km = parseFloat(kmInput);
    if (!dateInput || isNaN(km) || km <= 0) return;

    if (editingDate) {
      // при редактировании заменяем старую запись новой
      setRecords(prev =>
        sortByDate(
          prev.map(r =>
            r.date === editingDate ? { date: dateInput, km } : r
          )
        )
      );
      setEditingDate(null);
    } else {
      // при добавлении — суммируем если дата уже есть
      setRecords(prev => {
        const exists = prev.find(r => r.date === dateInput);
        const updated = exists
          ? prev.map(r =>
              r.date === dateInput
                ? { ...r, km: parseFloat((r.km + km).toFixed(1)) }
                : r
            )
          : [...prev, { date: dateInput, km }];
        return sortByDate(updated);
      });
    }

    // сбрасываем форму
    setDateInput('');
    setKmInput('');
  }

  // загружаем данные записи в форму для редактирования
  function handleEdit(record) {
    setDateInput(record.date);
    setKmInput(String(record.km));
    setEditingDate(record.date);
  }

  // отменяем редактирование
  function handleCancelEdit() {
    setEditingDate(null);
    setDateInput('');
    setKmInput('');
  }

  // удаляем строку по дате
  function handleDelete(date) {
    setRecords(prev => prev.filter(r => r.date !== date));
  }

  return (
    <div className="tracker-container">
      {/* форма добавления / редактирования */}
      <form className="tracker-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Дата (ДД.ММ.ГГ)</label>
            <input
              type="text"
              placeholder="20.07.2019"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Пройдено км</label>
            <input
              type="number"
              placeholder="5.7"
              step="0.1"
              min="0"
              value={kmInput}
              onChange={e => setKmInput(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-ok">OK</button>
            {/* кнопка отмены появляется только в режиме редактирования */}
            {editingDate && (
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancelEdit}
              >
                Отмена
              </button>
            )}
          </div>
        </div>
      </form>

      {/* заголовок таблицы */}
      <div className="table-header">
        <div className="col-date">Дата (ДД.ММ.ГГ)</div>
        <div className="col-km">Пройдено км</div>
        <div className="col-actions">Действия</div>
      </div>

      {/* тело таблицы */}
      <div className="table-body">
        {records.length === 0 ? (
          <div className="empty-state">Нет данных о тренировках</div>
        ) : (
          records.map(record => (
            <div
              key={record.date}
              className={`table-row${editingDate === record.date ? ' editing' : ''}`}
            >
              <div className="col-date">{record.date}</div>
              <div className="col-km">{record.km}</div>
              <div className="col-actions">
                <button
                  className="action-btn edit-btn"
                  title="Редактировать"
                  onClick={() => handleEdit(record)}
                >
                  ✎
                </button>
                <button
                  className="action-btn delete-btn"
                  title="Удалить"
                  onClick={() => handleDelete(record.date)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
