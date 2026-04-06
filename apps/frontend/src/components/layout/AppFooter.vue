<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__info">
        <h3 class="footer__title">Славянка</h3>
        <p class="footer__description">Продуктовый магазин в деревне Курилово</p>
        <p class="footer__address">📍 Молодёжная ул., 1В, д. Курилово</p>
        <p class="footer__phone">📞 +7 (123) 456-78-90</p>
      </div>
      <div class="footer__schedule">
        <h4 class="footer__schedule-title">Режим работы</h4>
        <p>Пн-Чт: 8:00-21:00</p>
        <p>Пт-Сб: 8:00-22:00</p>
        <p>Вс: 8:00-21:00</p>
      </div>
      <div class="footer__nav">
        <h4 class="footer__nav-title">Навигация</h4>
        <router-link to="/" class="footer__link">Главная</router-link>
        <router-link to="/catalog" class="footer__link">Каталог</router-link>
        <router-link to="/about" class="footer__link">О нас</router-link>
        <router-link to="/contacts" class="footer__link">Контакты</router-link>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© 2026 Славянка. Все права защищены.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer__title {
  font-family: var(--font-kurale);
  font-size: 36px;
  margin-bottom: 15px;
}

.footer__description {
  font-size: 16px;
  margin-bottom: 10px;
  opacity: 0.9;
}

.footer__address,
.footer__phone {
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.8;
}

.footer__schedule-title,
.footer__nav-title {
  font-family: var(--font-oswald);
  font-size: 20px;
  margin-bottom: 15px;
}

.footer__schedule p {
  font-size: 14px;
  margin-bottom: 5px;
  opacity: 0.9;
}

.footer__link {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.9;
  transition: opacity 0.3s;
}

.footer__link:hover {
  opacity: 1;
  text-decoration: underline;
}

.footer__bottom {
  max-width: 1200px;
  margin: 30px auto 0;
  padding: 20px 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  font-size: 14px;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .footer__container {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }
  
  .footer__title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 30px 0 15px;
  }
  
  .footer__container {
    padding: 0 15px;
  }
  
  .footer__title {
    font-size: 24px;
  }
}
</style>