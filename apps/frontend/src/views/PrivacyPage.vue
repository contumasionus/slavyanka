<template>
  <div class="privacy-page">
    <section class="section">
      <div class="container">
        <h2 class="section-title">Политика конфиденциальности</h2>
        <div class="privacy-card">
          <div class="privacy-block">
            <h3>1. Общие положения</h3>
            <p>Настоящая политика конфиденциальности регулирует порядок обработки и использования персональных данных пользователей сайта магазина «Славянка» (далее — «Магазин»). Используя наш сайт, вы соглашаетесь с условиями данной политики.</p>
          </div>

          <div class="privacy-block">
            <h3>2. Какие данные мы собираем</h3>
            <p>При регистрации и оформлении заказа мы можем собирать следующие данные:</p>
            <ul>
              <li>Имя и фамилия</li>
              <li>Адрес электронной почты</li>
              <li>Номер телефона</li>
              <li>Адрес доставки</li>
              <li>Информация о заказах и предпочтениях</li>
            </ul>
            <p>Мы не собираем данные платёжных карт — все платежи обрабатываются через защищённые платёжные системы.</p>
          </div>

          <div class="privacy-block">
            <h3>3. Как мы используем данные</h3>
            <p>Собранные данные используются исключительно для:</p>
            <ul>
              <li>Обработки и доставки ваших заказов</li>
              <li>Связи с вами по вопросам заказов</li>
              <li>Улучшения качества обслуживания</li>
              <li>Отправки уведомлений о состоянии заказа</li>
            </ul>
            <p>Мы не передаём ваши данные третьим лицам, за исключением случаев, предусмотренных законодательством РФ.</p>
          </div>

          <div class="privacy-block">
            <h3>4. Хранение и защита данных</h3>
            <p>Персональные данные хранятся на защищённых серверах. Мы принимаем все необходимые технические и организационные меры для защиты ваших данных от несанкционированного доступа, изменения или уничтожения.</p>
          </div>

          <div class="privacy-block">
            <h3>5. Файлы Cookie</h3>
            <p>Наш сайт использует файлы cookie для обеспечения корректной работы, сохранения настроек пользователя и сбора обезличенной статистики посещаемости. Вы можете отключить cookie в настройках браузера, однако это может повлиять на функциональность сайта.</p>
          </div>

          <div class="privacy-block">
            <h3>6. Ваши права</h3>
            <p>Вы имеете право в любой момент:</p>
            <ul>
              <li>Запросить информацию о хранящихся у нас данных</li>
              <li>Потребовать исправления неточных данных</li>
              <li>Потребовать удаления ваших данных</li>
              <li>Отозвать согласие на обработку данных</li>
            </ul>
            <p>Для реализации ваших прав свяжитесь с нами по телефону или через форму обратной связи.</p>
          </div>

          <div class="privacy-block">
            <h3>7. Контакты</h3>
            <p>По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться:</p>
            <p>📍 Молодёжная ул., 1В, д. Курилово</p>
            <p>📞 +7 (925) 483 12 91</p>
            <p>Звоните с 8:00 до 21:00</p>
          </div>

          <div class="privacy-block privacy-block--date">
            <p>Последнее обновление: 14 мая 2026 года</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.privacy-page { min-height: 80vh; }
.section { padding: 80px 20px; }

.privacy-card {
  max-width: 800px;
  margin: 0 auto;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 48px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.privacy-block { margin-bottom: 32px; }
.privacy-block:last-of-type { margin-bottom: 0; }
.privacy-block h3 {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 20px;
  color: var(--color-text);
  margin-bottom: 12px;
}
.privacy-block p {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}
.privacy-block ul {
  list-style: disc;
  padding-left: 24px;
  margin-bottom: 8px;
}
.privacy-block li {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}
.privacy-block--date {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-light);
}
.privacy-block--date p {
  font-size: 13px;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .privacy-card { padding: 28px 20px; }
  .privacy-block h3 { font-size: 18px; }
  .privacy-block p, .privacy-block li { font-size: 14px; }
}
</style>