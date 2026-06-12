<template>
  <footer class="footer">
    <div class="footer__top">
      <div class="footer__container">
        <!-- Бренд -->
        <div class="footer__brand">
          <h3 class="footer__title">Славянка</h3>
          <p class="footer__description">Продуктовый магазин в деревне Курилово. Свежие продукты каждый день.</p>
          <div class="footer__contacts">
            <a href="https://yandex.ru/maps/?text=Молодёжная%20ул.%2C%201В%2C%20д.%20Курилово" target="_blank" rel="noopener" class="footer__contact">
              Молодёжная ул., 1В, д. Курилово
            </a>
            <a href="tel:+79254831291" class="footer__contact footer__contact--phone">
              +7 (925) 483 12 91
            </a>
          </div>
        </div>

        <!-- Режим работы -->
        <div class="footer__column">
          <h4 class="footer__column-title">Режим работы</h4>
          <ul class="footer__schedule">
            <li><span>Пн-Чт</span><span>8:00 – 21:00</span></li>
            <li><span>Пт-Сб</span><span>8:00 – 22:00</span></li>
            <li><span>Вс</span><span>8:00 – 21:00</span></li>
          </ul>
        </div>

        <!-- Навигация -->
        <div class="footer__column">
          <h4 class="footer__column-title">Навигация</h4>
          <nav class="footer__nav">
            <router-link to="/" class="footer__link">Главная</router-link>
            <router-link to="/catalog" class="footer__link">Каталог</router-link>
            <router-link to="/cart" class="footer__link">Корзина</router-link>
            <router-link to="/about" class="footer__link">О нас</router-link>
            <router-link to="/contacts" class="footer__link">Контакты</router-link>
            <router-link to="/profile" class="footer__link">Личный кабинет</router-link>
          </nav>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <div class="footer__container">
        <p class="footer__copyright">© 2026 Славянка. Все права защищены.</p>
        <router-link to="/privacy" class="footer__copyright-link">Политика конфиденциальности</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.footer__top {
  padding: 64px 0 48px;
}

.footer__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 48px;
}

/* Brand */
.footer__title {
  font-family: var(--font-display);
  font-size: 32px;
  color: var(--color-primary);
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.footer__description {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
  max-width: 340px;
}

.footer__contacts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer__contact {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer__contact:hover {
  color: var(--color-text);
}

.footer__contact--phone:hover {
  color: var(--color-primary);
}

/* Columns */
.footer__column-title {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 20px;
}

.footer__schedule {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  padding: 0;
}

.footer__schedule li {
  display: flex;
  justify-content: space-between;
  max-width: 220px;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text-secondary);
}

.footer__schedule li span:first-child {
  font-weight: 500;
  color: var(--color-text);
}

.footer__nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer__link {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  position: relative;
  padding-left: 0;
}

.footer__link:hover {
  color: var(--color-primary);
  padding-left: 6px;
}

/* Bottom */
.footer__bottom {
  border-top: 1px solid var(--color-border-light);
  padding: 20px 0;
}

.footer__bottom .footer__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer__copyright {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text-muted);
}

.footer__copyright-link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer__copyright-link:hover {
  color: var(--color-text);
}

/* Media Queries */
@media (max-width: 768px) {
  .footer__top {
    padding: 48px 0 32px;
  }

  .footer__container {
    grid-template-columns: 1fr;
    gap: 36px;
    text-align: center;
  }

  .footer__description {
    margin: 0 auto 20px;
  }

  .footer__contacts {
    align-items: center;
  }

  .footer__schedule {
    align-items: center;
  }

  .footer__schedule li {
    justify-content: center;
    gap: 12px;
  }

  .footer__nav {
    align-items: center;
  }

  .footer__link:hover {
    padding-left: 0;
  }

  .footer__title {
    font-size: 28px;
  }

  .footer__bottom .footer__container {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .footer__top {
    padding: 36px 0 24px;
  }

  .footer__container {
    padding: 0 16px;
  }

  .footer__title {
    font-size: 24px;
  }
}
</style>