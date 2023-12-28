"use client";
import { useState, type FormEventHandler } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ZodError, z } from "zod";
import { schema, usernameSchema } from "@/lib/schema";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

export const CreateForm = () => {
  const [url, setUrl] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { push } = useRouter();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const slug = usernameSchema.parse(url);
      const data = schema.parse(JSON.parse(resume));

      fetch("/api/create", {
        method: "POST",
        body: JSON.stringify({ name: slug, resume: data }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.json();
            throw new Error(body?.message ?? "Error creating CV");
          }
          return res.json();
        })
        .then((res) => {
          toast({
            title: "Success",
            description: "CV created",
          });
          push("/" + (res.name ?? url));
        })
        .catch((err) => {
          if (err instanceof Error && err.message === "Username taken") {
            toast({
              title: "Username taken",
              description: "This username has already been taken",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Failed to create CV",
              description: err.message,
              variant: "destructive",
            });
            console.error(err);
          }
        });
    } catch (err) {
      if (err instanceof ZodError) {
        toast({
          title: "Invalid input",
          description:
            err.issues[0].message +
            (err.issues[0].path.length > 0
              ? " (" + err.issues[0].path.join(".") + ")"
              : ""),
          variant: "destructive",
        });
      } else if (err instanceof SyntaxError) {
        toast({
          title: "Invalid input",
          description: "Malformed JSON",
          variant: "destructive",
        });
        console.error(err);
      } else if (err instanceof Error) {
        if (err.message === "Username taken") {
          toast({
            title: "Invalid input",
            description: err.message,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Invalid input",
          description: err.message,
          variant: "destructive",
        });
        console.error(err);
      } else {
        toast({
          title: "Invalid input",
          description: "Unknown error",
          variant: "destructive",
        });
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Label htmlFor="url">
          Handle{" "}
          <Input
            id="url"
            type="text"
            placeholder="john-doe"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Label>
        <Label htmlFor="json" className="mt-2">
          JSON{" "}
          <Textarea
            id="json"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </Label>
        <Button className="mt-2" type="submit" disabled={loading}>
          Generate
        </Button>
      </form>
      <pre>{resume}</pre>
    </div>
  );
};
