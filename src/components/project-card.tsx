import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Resume } from "@/lib/schema";

type Props = Resume["projects"][number];

/* TODO: Add highlights? Probably make a setting later to toggle this */
/* TODO: Same with dates */
export function ProjectCard({ name, description, tags, url }: Props) {
  return (
    <Card className="flex flex-col overflow-hidden border border-muted p-3">
      <CardHeader className="">
        <div className="space-y-1">
          <CardTitle className="text-base">
            {url ? (
              <a
                href={url}
                target="_blank"
                className="inline-flex items-center gap-1 hover:underline"
              >
                {name}{" "}
                <span className="h-1 w-1 rounded-full bg-green-500"></span>
              </a>
            ) : (
              name
            )}
          </CardTitle>
          <div className="hidden font-mono text-xs underline print:visible">
            {url?.replace("https://", "").replace("www.", "").replace("/", "")}
          </div>
          <CardDescription className="font-mono text-xs">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      {tags && tags.length > 0 && (
        <CardContent className="flex flex-wrap gap-1 mt-auto">
          <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge
              className="px-1 py-0 text-[10px]"
              variant="secondary"
              key={tag}
            >
              {tag}
            </Badge>
          ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
