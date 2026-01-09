import { useParams, useNavigate } from "react-router-dom";
import { Button, Avatar, Card, Textarea, Spinner } from "flowbite-react";
import { HiArrowLeft, HiClock, HiUser, HiLockClosed } from "react-icons/hi";
import { useState, useEffect } from "react";
import { api } from "../helper/api";
import type { Review } from "../types/profile";

interface ReviewContentProps {
    user: {
        isLoggedIn: boolean;
        id: number | null;
        name: string;
        pp: string;
    };
}

export default function ReviewContent({ user }: ReviewContentProps) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);

    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const reviewResponse = await api.get(`/review/${id}`);
                const reviewData = reviewResponse.data;

                const commentsResponse = await api.get(`/comment/review/${id}`);
                const commentsData = commentsResponse.data;

                setReview({
                    ...reviewData,
                    date: new Date(reviewData.date),
                    comments: commentsData.map((c: any) => ({
                        ...c,
                        date: new Date(c.date)
                    })) || []
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleSubmitComment = async () => {
        if (!commentText.trim() || !review || !user.isLoggedIn) return;

        try {
            setIsSubmitting(true);

            const payload = {
                userId: user.id,
                reviewId: review.id,
                content: commentText
            };

            const response = await api.post('/comment', payload);

            const newComment = {
                ...response.data,
                date: new Date(),
                user: { username: user.name, tags: [] }
            };

            setReview(prev => prev ? ({
                ...prev,
                comments: [newComment, ...(prev.comments || [])]
            }) : null);

            setCommentText("");
        } catch (error) {
            console.error(error);
            alert("Yorum gönderilemedi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="animate-pulse">
                    <p className="text-gray-500 text-lg">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <Card className="max-w-md">
                    <div className="text-center">
                        <p className="text-gray-500 text-lg mb-4">İçerik bulunamadı</p>
                        <Button color="gray" onClick={() => navigate('/')}>
                            Ana Sayfaya Dön
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">

                <Button
                    color="light"
                    onClick={() => navigate(-1)}
                    className="shadow-sm hover:shadow-md transition-shadow"
                >
                    <HiArrowLeft className="mr-2 h-5 w-5" />
                    Geri Dön
                </Button>

                <Card className="overflow-hidden shadow-lg border-0">
                    <img
                        src={review.img}
                        alt={review.title}
                        className="w-full h-96 object-cover rounded-lg mb-6"
                    />

                    <div className="flex items-center gap-4 text-gray-500 text-sm mb-6 pb-6 border-b">
                        <div className="flex items-center gap-2">
                            <HiClock className="h-4 w-4" />
                            <span>{review.date.toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        {review.title}
                    </h1>

                    <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                        <p className="whitespace-pre-line text-justify">
                            {review.desc}
                        </p>
                    </div>
                </Card>

                <Card className="shadow-md border-0">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <HiUser className="h-6 w-6" />
                            Yorumlar
                        </h2>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {review.comments?.length || 0} yorum
                        </span>
                    </div>

                    {review.comments && review.comments.length > 0 ? (
                        <div className="space-y-6">
                            {review.comments.map((comment) => (
                                <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <Avatar
                                            alt={comment.user?.username || 'User'}
                                            img={comment.user?.photo || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
                                            rounded
                                            size="md"
                                        />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="font-bold text-gray-900 dark:text-white text-lg">
                                                    {comment.user?.username || 'Misafir'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    • {comment.date.toLocaleDateString('tr-TR')} {comment.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            {comment.user?.tags && comment.user.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {comment.user.tags.map((tag: any) => (
                                                        <span
                                                            key={tag.id}
                                                            className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded border border-blue-200"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                <HiUser className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg">
                                Henüz yorum yapılmamış.
                            </p>
                        </div>
                    )}
                </Card>

                <Card className="shadow-md border-0 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Yorum Yap
                    </h3>

                    {user.isLoggedIn ? (
                        <div>
                            <Textarea
                                id="comment"
                                placeholder="Bu konu hakkında düşünceleriniz neler?"
                                required
                                rows={4}
                                className="mb-4 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button
                                    gradientDuoTone="purpleToBlue"
                                    onClick={handleSubmitComment}
                                    disabled={isSubmitting || !commentText.trim()}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner size="sm" light={true} className="mr-2" />
                                            Gönderiliyor...
                                        </>
                                    ) : (
                                        'Yorumu Paylaş'
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <HiLockClosed className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-gray-600 font-medium mb-3">
                                Yorum yapmak için giriş yapmalısınız.
                            </p>
                            <Button color="blue" onClick={() => navigate('/')}>
                                Giriş Yap / Kayıt Ol
                            </Button>
                        </div>
                    )}
                </Card>

            </div>
        </div>
    );
}