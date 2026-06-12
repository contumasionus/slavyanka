<template>
  <div class="reviews-section">
    <div class="rating-summary" v-if="reviews.length > 0">
      <div class="rating-stars">
        <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= avgRating }">★</span>
        <span class="rating-value">{{ avgRating.toFixed(1) }}</span>
      </div>
      <span class="rating-count">{{ reviews.length }} отзывов</span>
    </div>

    <div v-if="userCanReview" class="review-form">
      <h4>Оставить отзыв</h4>
      <div class="star-input">
        <span v-for="i in 5" :key="i" class="star-input__star" :class="{ selected: i <= newRating }" @click="newRating = i">★</span>
      </div>
      <textarea v-model="newReviewText" placeholder="Поделитесь впечатлениями..." rows="3" maxlength="1000"></textarea>
      <button @click="submitReview" :disabled="!newRating" class="btn-review">Отправить</button>
    </div>

    <div class="reviews-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-header">
          <span class="review-author">{{ review.user?.name || 'Аноним' }}</span>
          <span class="review-stars">
            <span v-for="i in 5" :key="i" :class="{ filled: i <= review.rating }">★</span>
          </span>
        </div>
        <p class="review-text">{{ review.text }}</p>
        <span class="review-date">{{ formatDate(review.createdAt) }}</span>
      </div>
      <div v-if="reviews.length === 0" class="no-reviews">Пока нет отзывов. Будьте первым!</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { reviewsApi } from '../../api/reviews.api';
import { sanitizeInput, truncate } from '../../utils/validation';

const props = defineProps<{
  productId: string;
  isAuthenticated: boolean;
}>();

const reviews = ref<any[]>([]);
const newRating = ref(0);
const newReviewText = ref('');

const avgRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  return reviews.value.reduce((s, r) => s + r.rating, 0) / reviews.value.length;
});

const userCanReview = computed(() => props.isAuthenticated);

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function fetchReviews() {
  try {
    reviews.value = await reviewsApi.getByProduct(props.productId);
  } catch { /* ignore */ }
}

async function submitReview() {
  if (!newRating.value) return;
  try {
    await reviewsApi.create({
      productId: props.productId,
      rating: newRating.value,
      text: sanitizeInput(truncate(newReviewText.value, 1000)) || undefined,
    });
    newRating.value = 0;
    newReviewText.value = '';
    await fetchReviews();
  } catch (e) { /* ignore */ }
}

onMounted(fetchReviews);
</script>

<style scoped>
.reviews-section { margin-top: 20px; }
.rating-summary { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.rating-stars { display: flex; align-items: center; gap: 2px; }
.star { font-size: 20px; color: #ddd; }
.star.filled { color: #ffb400; }
.rating-value { font-size: 18px; font-weight: 700; margin-left: 4px; color: var(--color-text); }
.rating-count { font-size: 14px; color: var(--color-text-muted); }
.review-form { background: var(--color-border-light); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 16px; }
.review-form h4 { font-family: var(--font-heading); margin-bottom: 8px; }
.star-input { display: flex; gap: 4px; margin-bottom: 8px; }
.star-input__star { font-size: 28px; cursor: pointer; color: #ddd; transition: color var(--transition-fast); }
.star-input__star:hover, .star-input__star.selected { color: #ffb400; }
.star-input__star:hover ~ .star-input__star { color: #ddd; }
.review-form textarea { width: 100%; padding: 12px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: var(--font-body); font-size: 14px; color: var(--color-text); background: #ffffff; resize: vertical; margin-bottom: 8px; transition: all var(--transition-fast); }
.review-form textarea::placeholder { color: var(--color-text-muted); }
.review-form textarea:focus { outline: none; border-color: var(--color-primary-light); box-shadow: 0 0 0 3px rgba(211,84,0,0.08); }
.btn-review { padding: 8px 20px; background: var(--color-primary); color: #fff; border: none; border-radius: var(--radius-full); cursor: pointer; font-family: var(--font-heading); font-weight: 600; }
.btn-review:disabled { opacity: 0.5; cursor: not-allowed; }
.reviews-list { display: flex; flex-direction: column; gap: 12px; }
.review-item { padding: 12px; background: var(--color-background); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.review-author { font-family: var(--font-heading); font-weight: 600; font-size: 14px; }
.review-stars { font-size: 16px; color: #ddd; }
.review-stars .filled { color: #ffb400; }
.review-text { font-size: 14px; color: var(--color-text-secondary); margin-bottom: 4px; }
.review-date { font-size: 12px; color: var(--color-text-muted); }
.no-reviews { text-align: center; color: var(--color-text-muted); padding: 20px; }
</style>
