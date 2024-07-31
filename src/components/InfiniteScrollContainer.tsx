import { useInView } from "react-intersection-observer";
type Props = React.PropsWithChildren & {
  onBottomReached: () => void;
  className: string;
};

export function InfiniteScrollContainer({
  children,
  onBottomReached,
  className,
}: Props) {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });
  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}
