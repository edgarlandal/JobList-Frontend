import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardProps = {
  title: string;
  numsOfJobs: number;
  footer: string;
};

export default function CardDataJobs({ title, numsOfJobs, footer }: CardProps) {
  return (
      <Card className="min-w-0 bg-[#F0F6F5] ring-[#0F766E]/20">
        <CardHeader>
          <CardTitle className="text-sm text-[#475569]">{title}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-4xl font-semibold tabular-nums">{numsOfJobs}</p>
        </CardContent>

        <CardFooter className="mt-auto border-[#0F766E]/10">
          <p className="text-xs text-[#475569]">{footer}</p>
        </CardFooter>
      </Card>
  );
}
