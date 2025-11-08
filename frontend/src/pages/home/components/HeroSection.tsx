import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const videos = [
  'https://www.pexels.com/download/video/19736901/',
  'https://www.pexels.com/download/video/19736901/',
];

export default function HeroSection() {
  return (
    <Carousel className='w-full max-w-screen max-h-[80vh] overflow-hidden'>
      <CarouselContent>
        {videos.map((_, index) => (
          <CarouselItem key={index}>
            <video src={_} autoPlay={true} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
