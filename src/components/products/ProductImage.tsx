import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
  width?: number;
  height?: number;
}

/** Image with fixed aspect handling and a friendly fallback when the source fails. */
export function ProductImage({ src, alt, className, eager, width = 800, height = 800 }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div role="img" aria-label={alt} className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
        <ImageOff className="size-8" aria-hidden />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
