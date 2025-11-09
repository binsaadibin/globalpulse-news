import NewsCard from '../NewsCard';
import techImage from '@assets/generated_images/Technology_conference_news_image_a9827700.png';

export default function NewsCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <NewsCard
        title="Global Tech Summit Announces Revolutionary AI Breakthroughs"
        description="Leading technology companies showcase groundbreaking artificial intelligence innovations at the annual international conference."
        category="Technology"
        imageUrl={techImage}
        timeAgo="2 hours ago"
        onClick={() => console.log('News card clicked')}
      />
    </div>
  );
}
