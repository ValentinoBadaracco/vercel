'use server';

import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';


const reviewsFile = path.join(process.cwd(), 'data', 'reviews.json');



export async function addReview(formDarta: FormData) {
    const bookId = formDarta.get('bookId') as string;
    const rating = Number(formDarta.get('rating'));
    const text = formDarta.get('text') as string;

    const data = await fs.readFile(reviewsFile, 'utf-8');
    const allReviews = JSON.parse(data);

    allReviews.push({ id: randomUUID(), bookId, rating, text, votes: 0 });
    await fs.writeFile(reviewsFile, JSON.stringify(allReviews, null, 2), 'utf-8');

}

export async function getReviews(bookId: string) {
    const data = await fs.readFile(reviewsFile, 'utf-8');
    const allReviews = JSON.parse(data);
    return allReviews.filter((r: any) => r.bookId === bookId);
}

export async function voteReview(reviewId: string, delta: number) {
    const data = await fs.readFile(reviewsFile, 'utf-8');
    const allReviews = JSON.parse(data);

    const review = allReviews.find((r: any) => r.id === reviewId);
    if (review) {
        review.votes += delta;
        await fs.writeFile(reviewsFile, JSON.stringify(allReviews, null, 2), 'utf-8');

    }

}





