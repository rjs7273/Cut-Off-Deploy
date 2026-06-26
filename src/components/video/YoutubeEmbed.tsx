interface YoutubeEmbedProps {
  /** YouTube 영상 고유 ID (VideoCard.id) */
  videoId: string;
  title: string;
}

export default function YoutubeEmbed({ videoId, title }: YoutubeEmbedProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0`;

  return (
    <div className="w-full aspect-video rounded-app-md mb-4 overflow-hidden bg-black">
      <iframe
        title={title}
        src={embedUrl}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
