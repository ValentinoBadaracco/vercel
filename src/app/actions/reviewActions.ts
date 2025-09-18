
// Utilidades cliente para manejar reseñas en localStorage
export interface Review {
    id: string;
    bookId: string;
    rating: number;
    text: string;
    votes: number;
}

function getAllReviews(): Review[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('reviews');
    return data ? JSON.parse(data) : [];
}

function saveAllReviews(reviews: Review[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

export async function addReview(formData: FormData) {
    const bookId = formData.get('bookId') as string;
    const rating = Number(formData.get('rating'));
    const text = formData.get('text') as string;
    const allReviews = getAllReviews();
    allReviews.push({
        id: Math.random().toString(36).slice(2),
        bookId,
        rating,
        text,
        votes: 0,
    });
    saveAllReviews(allReviews);
}

export async function getReviews(bookId: string) {
    const allReviews = getAllReviews();
    return allReviews.filter((r) => r.bookId === bookId);
}

export async function voteReview(reviewId: string, delta: number) {
    const allReviews = getAllReviews();
    const review = allReviews.find((r) => r.id === reviewId);
    if (review) {
        review.votes += delta;
        saveAllReviews(allReviews);
    }
}





