declare module "@iconscout/react-unicons/icons/*" {
  import type {ComponentType, SVGProps} from "react";

  const Icon: ComponentType<SVGProps<SVGSVGElement> & {
    color?: string;
    size?: string | number;
  }>;

  export default Icon;
}
