import { mockData } from '../data/mockData';
import SectionTitle from '../components/SectionTitle';
import GalleryCarousel from '../components/GalleryCarousel';

export default function Gallery() {
  const images = mockData.gallery;

  return (
    <div className="w-full animate-fadeIn pb-12">
      <SectionTitle title="MEU BEM" subtitle="que bom ter você comigo" />

      <div className="mt-8 mb-16 slide-up">
        <GalleryCarousel items={images} />
      </div>
    </div>
  );
}
