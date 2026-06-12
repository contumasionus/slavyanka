# Fix Unicode print statements in generate_all.py
import re

with open('generate_all.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all checkmark-print lines with ASCII-safe versions
content = content.replace("print('\u2713 1 Титульник.docx')", "print('[OK] 1 Титульник.docx')")
content = content.replace("print('\u2713 2 Задание ДП.doc')", "print('[OK] 2 Задание ДП.doc')")
content = content.replace("print('\u2713 3 ТЗ.docx')", "print('[OK] 3 ТЗ.docx')")
content = content.replace("print('\u2713 4 Аннотация.docx')", "print('[OK] 4 Аннотация.docx')")
content = content.replace("print('\u2713 5 ПЗ.docx')", "print('[OK] 5 ПЗ.docx')")
content = content.replace("print('\u2713 6 Ведомость документов.doc')", "print('[OK] 6 Ведомость документов.doc')")
content = content.replace("print('\u2713 Справка о внедрении.docx')", "print('[OK] Справка о внедрении.docx')")
content = content.replace("print('\u2713 Приложение А (Листинг).docx')", "print('[OK] Приложение А (Листинг).docx')")
content = content.replace("print('\u2713 Приложение Б (Карта сайта).docx')", "print('[OK] Приложение Б (Карта сайта).docx')")
content = content.replace("print('\u2713 Приложение В (База Данных).docx')", "print('[OK] Приложение В (База Данных).docx')")
content = content.replace("print(f'Все файлы сохранены в папке: {OUTPUT_DIR}')", "print('All files saved in folder:', OUTPUT_DIR)")

with open('generate_all.py', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed all print statements')