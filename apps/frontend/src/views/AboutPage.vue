<template>
  <div class="about">
    <section class="about__section">
      <h2 class="section-title">О нас</h2>
      <div class="about__content">
        <div class="about__info">
          <h3>Магазин «Славянка»</h3>
          <p>Это не просто место, где можно купить продукты. Мы открылись с простой идеей: чтобы у жителей всегда были свежие, качественные и доступные продукты.</p>
          <p>Сегодня мы рады встречать вас каждый день: с утра до вечера, с улыбкой и полными прилавками.</p>
        </div>
        <div class="about__features">
          <h4>У нас вы найдете:</h4>
          <ul>
            <li>Свежий хлеб от местной пекарни</li>
            <li>Молоко и яйца от фермеров из соседних хозяйств</li>
            <li>Сезонные овощи и фрукты</li>
            <li>Всё необходимое для дома</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.about .section-title {
  text-shadow: 
    -1px -1px 0 #000000,
    1px -1px 0 #000000,
    -1px 1px 0 #000000,
    1px 1px 0 #000000;
}

.about__content {
  background: linear-gradient(90deg, rgba(178, 64, 64, 1) 0%, rgba(255, 255, 255, 1) 1%);
  border-radius: 30px;
  padding: 60px;
}

.about__info h3 {
  font-family: var(--font-inter);
  font-weight: 900;
  font-size: 40px;
  color: var(--color-primary);
  margin-bottom: 30px;
}

.about__info p {
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 24px;
  line-height: 1.21;
  color: #333333;
  margin-bottom: 20px;
}

.about__features h4 {
  font-family: var(--font-inter);
  font-weight: 800;
  font-size: 24px;
  color: #000000;
  margin: 40px 0 20px;
}

.about__features ul {
  list-style: none;
  padding: 0;
}

.about__features li {
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 24px;
  line-height: 2.08;
  color: #000000;
  padding-left: 20px;
  position: relative;
}

.about__features li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .about__content {
    padding: 30px;
  }
  
  .about__info h3 {
    font-size: 28px;
  }
  
  .about__info p,
  .about__features h4,
  .about__features li {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .about {
    padding: 20px 15px;
  }
  
  .about__content {
    padding: 20px;
  }
  
  .about__info h3 {
    font-size: 24px;
  }
  
  .about__info p,
  .about__features h4,
  .about__features li {
    font-size: 16px;
  }
}
</style>