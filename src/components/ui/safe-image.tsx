import Image from "next/image";
import { cn } from "@/lib/utils";

type SafeImageProps = {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
} & (
  | { fill: true; width?: never; height?: never }
  | { fill?: false; width: number; height: number }
);

/**
 * Renders remote photos via next/image and data-URL uploads via img.
 * Monochrome styling is applied globally in CSS.
 */
export function SafeImage({
  src,
  alt = "",
  className,
  sizes,
  priority,
  fill,
  width,
  height,
}: SafeImageProps) {
  if (src.startsWith("data:")) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn("absolute inset-0 h-full w-full object-cover", className)}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width!}
      height={height!}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
