import { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import clsx from 'clsx';

// Mock reviews data
const MOCK_REVIEWS = [
    {
        id: 1,
        user: { name: 'Ayesha Khan', avatar: null },
        rating: 5,
        comment: 'Absolutely beautiful craftsmanship! The attention to detail is remarkable. This shawl exceeded my expectations.',
        date: '2024-01-15',
        helpful: 12,
        verified: true,
    },
    {
        id: 2,
        user: { name: 'Ahmed Ali', avatar: null },
        rating: 4,
        comment: 'Great quality product. The colors are vibrant and the material is soft. Shipping was a bit slow though.',
        date: '2024-01-10',
        helpful: 8,
        verified: true,
    },
    {
        id: 3,
        user: { name: 'Sara Malik', avatar: null },
        rating: 5,
        comment: 'Love supporting local artisans! This piece is unique and tells a story. Highly recommend.',
        date: '2024-01-05',
        helpful: 15,
        verified: false,
    },
];

export function ReviewSection({ productId, productRating = 4.7, reviewCount = 24 }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState(MOCK_REVIEWS);
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [helpfulClicked, setHelpfulClicked] = useState({});

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to write a review');
            return;
        }

        const review = {
            id: Date.now(),
            user: { name: user.name, avatar: user.avatar },
            rating: newReview.rating,
            comment: newReview.comment,
            date: new Date().toISOString().split('T')[0],
            helpful: 0,
            verified: true,
        };

        setReviews([review, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
        setShowWriteReview(false);
    };

    const handleHelpful = (reviewId) => {
        if (helpfulClicked[reviewId]) return;

        setReviews(reviews.map(r =>
            r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
        ));
        setHelpfulClicked({ ...helpfulClicked, [reviewId]: true });
    };

    const renderStars = (rating, interactive = false, onSelect = null) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type={interactive ? "button" : undefined}
                        onClick={() => interactive && onSelect && onSelect(star)}
                        className={clsx(
                            interactive && "cursor-pointer hover:scale-110 transition-transform"
                        )}
                        disabled={!interactive}
                    >
                        <Star
                            className={clsx(
                                "w-5 h-5",
                                star <= rating ? "fill-ochre text-ochre" : "text-stone-300"
                            )}
                        />
                    </button>
                ))}
            </div>
        );
    };

    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length,
        percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100,
    }));

    return (
        <div className="mt-12 pt-12 border-t border-stone-200">
            <h2 className="text-2xl font-serif text-stone-900 mb-6">Customer Reviews</h2>

            {/* Rating Summary */}
            <div className="grid md:grid-cols-2 gap-8 mb-8 p-6 bg-stone-50 rounded-xl">
                <div className="text-center md:text-left">
                    <div className="text-5xl font-bold text-stone-900">{productRating}</div>
                    <div className="flex items-center justify-center md:justify-start gap-1 my-2">
                        {renderStars(Math.round(productRating))}
                    </div>
                    <p className="text-stone-500 text-sm">Based on {reviewCount} reviews</p>
                </div>

                <div className="space-y-2">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                        <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm text-stone-600 w-8">{rating}★</span>
                            <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-ochre rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-xs text-stone-500 w-8">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write Review Button */}
            {!showWriteReview && (
                <Button
                    variant="secondary"
                    onClick={() => setShowWriteReview(true)}
                    className="mb-6"
                >
                    Write a Review
                </Button>
            )}

            {/* Write Review Form */}
            {showWriteReview && (
                <form onSubmit={handleSubmitReview} className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
                    <h3 className="font-medium text-stone-900 mb-4">Write Your Review</h3>

                    <div className="mb-4">
                        <label className="block text-sm text-stone-600 mb-2">Your Rating</label>
                        {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-stone-600 mb-2">Your Review</label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            rows={4}
                            required
                            placeholder="Share your experience with this product..."
                            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre/20 outline-none resize-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" variant="primary">Submit Review</Button>
                        <Button type="button" variant="secondary" onClick={() => setShowWriteReview(false)}>Cancel</Button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.map(review => (
                    <div key={review.id} className="border-b border-stone-100 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500">
                                {review.user.avatar ? (
                                    <img src={review.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5" />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-stone-900">{review.user.name}</span>
                                    {review.verified && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified Purchase</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    {renderStars(review.rating)}
                                    <span className="text-xs text-stone-400">
                                        {new Date(review.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>

                                <p className="text-stone-600 text-sm leading-relaxed">{review.comment}</p>

                                <button
                                    onClick={() => handleHelpful(review.id)}
                                    disabled={helpfulClicked[review.id]}
                                    className={clsx(
                                        "flex items-center gap-1 mt-3 text-xs transition-colors",
                                        helpfulClicked[review.id] ? "text-ochre" : "text-stone-400 hover:text-stone-600"
                                    )}
                                >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    Helpful ({review.helpful})
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
