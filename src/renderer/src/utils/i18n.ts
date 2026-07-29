export type Lang = 'ru'

const ru: Record<string, string> = {
  'app.title': 'JazzNote',
  'all.notes': 'Все заметки',
  'today': 'Сегодня',
  'tomorrow': 'Завтра',
  'week': 'Неделя',
  'later': 'Позже',
  'no.date': 'Без срока',
  'folders': 'Папки',
  'no.folders': 'Нет папок',
  'folder.name': 'Название папки',
  'search.placeholder': 'Поиск заметок...',
  'sort.by.date': 'По дате',
  'sort.by.due': 'По сроку',
  'sort.by.priority': 'По приоритету',
  'loading': 'Загрузка...',
  'no.notes': 'Нет заметок',
  'no.results': 'Ничего не найдено',
  'new.note': 'Новая заметка',
  'new.note.placeholder': 'Новая заметка...',
  'create': '+',
  'delete.confirm': 'Удалить заметку?',
  'note.unsaved': 'Не сохранено',
  'note.saved': 'Сохранено',
  'not.saved': 'Не сохранено',
  'saved': 'Сохранено',
  'find.in.note': 'Поиск в заметке...',
  'settings': 'Настройки',
  'settings.title': 'Настройки',
  'theme': 'Тема',
  'language': 'Язык',
  'close': 'Закрыть',
  'back': '←',
  'priority.none': 'Нет',
  'priority.low': 'Низкий',
  'priority.medium': 'Средний',
  'priority.high': 'Высокий',
  'priority.critical': 'Критич.',
  'no.color': 'Нет цвета',
  'date': 'Дата',
  'type.here': 'Начните печатать...',
}

const strings: Record<Lang, Record<string, string>> = { ru }

export function t(key: string, lang: Lang = 'ru'): string {
  return strings[lang]?.[key] ?? key
}
