// types/svgr.d.ts

// For SVG imports as React components (default behavior)
declare module "*.svg" {
  import { FC, SVGProps } from "react";
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

// For SVG imports as URLs (when using ?url suffix)
declare module "*.svg?url" {
  const content: string;
  export default content;
}

// For SVG imports as raw strings (when using ?raw suffix) - optional
declare module "*.svg?raw" {
  const content: string;
  export default content;
}

// Support for other image formats if needed
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.ico" {
  const src: string;
  export default src;
}
