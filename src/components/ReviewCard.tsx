import { Card, Badge } from "flowbite-react";
import type { Review } from "../types/Profile";

type ReviewCardProps = Omit<Review, "id">;

export default function ReviewCard({ title, desc, img, date }: ReviewCardProps) {
    return (
        <Card
            className="max-w-sm h-full hover:scale-[1.02] transition-transform duration-300 cursor-pointer border-gray-200 dark:border-gray-700"
            imgAlt={title}
            imgSrc={img}
        >
            <div className="flex justify-between items-start">
                <Badge color="purple" className="px-2.5 py-0.5 text-xs">
                    İnceleme
                </Badge>

                <span className="text-xs text-gray-500 font-medium">
                    {date.toLocaleDateString('tr-TR')}
                </span>
            </div>

            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                {title}
            </h5>

            <p className="font-normal text-gray-700 dark:text-gray-400 text-sm line-clamp-3">
                {desc}
            </p>
        </Card>
    );
}