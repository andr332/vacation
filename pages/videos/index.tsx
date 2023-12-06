import { useMemo, useRef, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import Image from 'next/image';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import { useVideosData } from '@/libs/swr';
import { cn, youTubeGetCoverImage, youTubeGetID } from '@/libs/utils';

import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Heading } from '@/components/ui/Heading';
import { InputDebounce } from '@/components/ui/InputDebounce';

import VideoCardItem from '@/components/dashboard/VideoCardItem';
import FrontLayout from '@/components/front/FrontLayout';
import Shimmer from '@/components/systems/Shimmer';

export default function Videos() {
  const { data, error } = useVideosData();
  // VIDEO SLIDER
  // using useMemo to prevent reshuffled data if doing searching
  const copyData = useMemo(() => (data ? [...data] : []), [data]);
  const shuffledData = useMemo(() => copyData?.sort(() => 0.5 - Math.random()).slice(0, 5), [copyData]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [videoPreview, setVideoPreview] = useState({ open: false, title: '', video_url: '' });
  const youtube_url = youTubeGetID(videoPreview?.video_url);
  // VIDEO GRID
  const [query, setQuery] = useState('');
  const limit = 9;
  const [page, setPage] = useState(1);
  const filtered =
    query === ''
      ? data
      : data.filter((item: any) =>
          item.title.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')),
        );
  let lastPage = page >= filtered?.length / limit;

  if (error) {
    return (
      <FrontLayout
        title='Video - MyVacation'
        description='Enjoy the untouched beaches, mountains, lakes, and many more pleasing destinations as well as the magnificent city skylines throughout the country. And when you decide to see them all, a visit won’t be enough to embrace the wonders of Indonesia.'
      >
        <div className='flex h-[36rem] items-center justify-center text-base'>Failed to load</div>
      </FrontLayout>
    );
  }

  return (
    <FrontLayout
      title='Video - MyVacation'
      description='Enjoy the untouched beaches, mountains, lakes, and many more pleasing destinations as well as the magnificent city skylines throughout the country. And when you decide to see them all, a visit won’t be enough to embrace the wonders of Indonesia.'
    >
      <div className='py-4'>
        {data ? (
          <div className='relative'>
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                // @ts-ignore
                swiper.params.navigation.prevEl = prevRef.current;
                // @ts-ignore
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              spaceBetween={24}
              slidesPerView={3}
              centeredSlides={true}
              loop={true}
              className='py-4 w-full'
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: 1.3,
                },
              }}
            >
              {shuffledData?.map((video: any, index: number) => (
                <SwiperSlide key={index}>
                  {({ isActive }) => (
                    <div
                      className={cn(
                        'relative h-64 sm:h-72 lg:h-80 xl:h-96 rounded-md group overflow-hidden',
                        isActive && 'sm:h-[350px] lg:h-[400px] xl:h-[450px]',
                        !isActive && 'sm:mt-8',
                      )}
                    >
                      <Image
                        className={cn(
                          'w-full object-cover rounded-md transition-all duration-500 scale-110',
                          isActive && 'group-hover:scale-125',
                        )}
                        src={youTubeGetCoverImage(youTubeGetID(video.video_url))}
                        alt={video.title}
                        fill
                        unoptimized
                      />
                      <button
                        onClick={() =>
                          setVideoPreview({ open: true, title: video?.title, video_url: video?.video_url })
                        }
                        disabled={!isActive}
                        className={cn(
                          'group absolute inset-0 rounded-md cursor-pointer focus-visible:outline-none',
                          'bg-gradient-to-b from-transparent via-transparent to-neutral-950',
                          !isActive && 'bg-black/50 cursor-default',
                        )}
                      >
                        <div className='flex justify-center items-center h-full'>
                          <svg
                            className='h-12 w-12 sm:h-14 sm:w-14 md:h-[68px] md:w-[68px]'
                            height='100%'
                            version='1.1'
                            viewBox='0 0 68 48'
                            width='100%'
                          >
                            <path
                              d='M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z'
                              fill='#f00'
                            ></path>
                            <path d='M 45,24 27,14 27,34' fill='#fff'></path>
                          </svg>
                        </div>
                        <div className='absolute bottom-0 inset-x-0'>
                          <p className='font-medium text-lg text-center line-clamp-2 text-white px-4 mb-4'>
                            {video.title}
                          </p>
                        </div>
                      </button>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              ref={prevRef}
              className={cn(
                'absolute left-4 lg:left-16 z-10 top-[42%] sm:top-[45%] rounded-full p-2 lg:p-3 shadow-lg transition-all cursor-pointer',
                'border dark:border-neutral-800 bg-neutral-100 hover:bg-neutral-200 dark:bg-black/60 dark:hover:bg-black/90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
              )}
            >
              <ArrowLeftIcon className='h-5 w-5 lg:h-6 lg:w-6 dark:text-white' />
            </button>
            <button
              ref={nextRef}
              className={cn(
                'absolute right-4 lg:right-16 z-10 top-[42%] sm:top-[45%] rounded-full p-2 lg:p-3 shadow-lg transition-all cursor-pointer',
                'border dark:border-neutral-800 bg-neutral-100 hover:bg-neutral-200 dark:bg-black/60 dark:hover:bg-black/90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
              )}
            >
              <ArrowRightIcon className='h-5 w-5 lg:h-6 lg:w-6 dark:text-white' />
            </button>
          </div>
        ) : (
          <div className='flex gap-6'>
            <Shimmer className='rounded-md h-64 sm:h-72 lg:h-80 xl:h-96 hidden sm:block sm:w-[12%] my-auto' />
            <Shimmer className='rounded-md h-64 sm:h-[350px] lg:h-[400px] xl:h-[450px] w-full' />
            <Shimmer className='rounded-md h-64 sm:h-72 lg:h-80 xl:h-96 hidden sm:block sm:w-[12%] my-auto' />
          </div>
        )}
      </div>

      <div className='flex gap-3 justify-between items-center mt-8'>
        <Heading as='h1' variant='h3' className='font-medium'>
          Video
        </Heading>
        <InputDebounce
          id='search'
          name='search'
          placeholder='Search Video'
          className='max-w-xs'
          debounce={500}
          value={query}
          onChange={(value) => setQuery(value)}
        />
      </div>

      <div className='mt-8 grid grid-cols-1 gap-6 pb-4 min-[550px]:grid-cols-2 xl:grid-cols-3'>
        {filtered
          ? filtered?.slice(0, page * limit).map((item: any, index: number) => (
              <div key={index} className='relative'>
                <VideoCardItem
                  className='scale-150'
                  title={item?.title}
                  url={item?.video_url}
                  onPlay={() => setVideoPreview({ open: true, title: item?.title, video_url: item?.video_url })}
                />
              </div>
            ))
          : [...Array(12).keys()].map((i) => (
              <Shimmer key={i}>
                <div className='space-y-3'>
                  <div className='h-48 w-full rounded bg-neutral-300/70 dark:bg-neutral-700/50'></div>
                  <div className='h-4 w-full rounded bg-neutral-300/70 dark:bg-neutral-700/50'></div>
                </div>
              </Shimmer>
            ))}
      </div>

      {data && !lastPage && (
        <div className='mt-8 flex justify-center'>
          <Button onClick={() => setPage(page + 1)}>Load More</Button>
        </div>
      )}

      {query !== '' && filtered?.length < 1 && (
        <p className='py-32 text-center'>There are no Video with Title &quot;{query}&quot;</p>
      )}

      {/* Preview Dialog */}
      <Dialog open={videoPreview.open} onOpenChange={() => setVideoPreview((prev) => ({ ...prev, open: false }))}>
        <DialogContent className='max-w-5xl p-3 md:p-6'>
          <DialogHeader className='text-left'>
            <DialogTitle className='pr-4'>{videoPreview.title}</DialogTitle>
          </DialogHeader>
          <iframe
            className='h-64 sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] w-full rounded'
            src={`https://www.youtube.com/embed/${youtube_url}?autoplay=1`}
            title={videoPreview.title}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          ></iframe>
        </DialogContent>
      </Dialog>
    </FrontLayout>
  );
}