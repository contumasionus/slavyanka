<template>
  <div class="contacts">
    <section class="contacts__section">
      <h2 class="section-title">Найдете нас легко!</h2>
      
      <div class="contacts__grid">
        <div class="contacts__photo">
          <img src="/images/contacts/store-photo.png" alt="Магазин Славянка" class="contacts__image">
        </div>
        
        <div class="contacts__info">
          <div class="contacts__block">
            <h3>Где мы?</h3>
            <p>📍 Молодёжная ул., 1В, д. Курилово</p>
            <p>📞 +7 (123) 456-78-90</p>
            <p>Звоните с 8:00 до 21:00</p>
          </div>
          
          <div class="contacts__block">
            <h3>Режим работы</h3>
            <div class="contacts__schedule">
              <div class="contacts__schedule-row">
                <span>Пн-Чт:</span>
                <span>8:00-21:00</span>
              </div>
              <div class="contacts__schedule-row">
                <span>Пт-Сб:</span>
                <span>8:00-22:00</span>
              </div>
              <div class="contacts__schedule-row">
                <span>Вс:</span>
                <span>8:00-21:00</span>
              </div>
            </div>
          </div>
          
          <div class="contacts__map">
            <iframe 
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A1234567890abcdef&source=constructor&ll=39.972625%2C56.092848&z=20&pt=39.971952%2C56.093047%2Cpm2rdm"
              width="100%" 
              height="300" 
              frameborder="0"
              class="contacts__map-iframe"
              allowfullscreen>
            </iframe>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contacts {
  padding: 40px 20px;
  max-width: 1920px;
  margin: 0 auto;
}

.contacts .section-title {
  text-shadow: 
    -1px -1px 0 #000000,
    1px -1px 0 #000000,
    -1px 1px 0 #000000,
    1px 1px 0 #000000;
}

.contacts__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.contacts__photo {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 241px;
}

.contacts__image {
  width: 100%;
  max-width: 600px;
  height: 350px;
  object-fit: cover;
  border-radius: 20px;
  border: 1px solid #000000;
}

.contacts__info {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.contacts__block {
  background-color: var(--color-white);
  border-radius: 20px;
  border: 1px solid #000000;
  padding: 37px;
}

.contacts__block h3 {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 24px;
  color: var(--color-primary);
  margin-bottom: 25px;
}

.contacts__block p {
  font-family: var(--font-inter);
  font-weight: 400;
  font-size: 24px;
  line-height: 1.21;
  color: #000000;
  margin-bottom: 10px;
}

.contacts__schedule {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contacts__schedule-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-inter);
  font-size: 24px;
}

.contacts__schedule-row span:first-child {
  font-weight: 700;
  color: #000000;
}

.contacts__schedule-row span:last-child {
  font-weight: 400;
  color: #000000;
}

.contacts__map {
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #000000;
  margin-top: auto;
  align-self: center;
}

.contacts__map-iframe {
  display: block;
  border-radius: 20px;
}

@media (max-width: 768px) {
  .contacts__grid {
    grid-template-columns: 1fr;
  }
  
  .contacts__photo {
    grid-column: 1;
    grid-row: 1;
  }
  
  .contacts__info {
    grid-column: 1;
    grid-row: 2;
  }
  
  .contacts__map {
    grid-column: 1;
    grid-row: 3;
  }
  
  .contacts__image {
    height: 300px;
  }
  
  .contacts__block p,
  .contacts__schedule-row {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .contacts {
    padding: 20px 15px;
  }
  
  .contacts__image {
    height: 200px;
  }
  
  .contacts__block {
    padding: 20px;
  }
  
  .contacts__block h3 {
    font-size: 20px;
  }
  
  .contacts__block p,
  .contacts__schedule-row {
    font-size: 16px;
  }
  
  .contacts__map-image {
    height: 200px;
  }
}
</style>