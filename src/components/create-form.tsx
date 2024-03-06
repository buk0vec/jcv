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
import { template } from "@/lib/template";

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
      <form onSubmit={onSubmit} className="flex flex-col">
        <Label htmlFor="url">
          Handle{" "}
          <Input
            id="url"
            type="text"
            placeholder="john-doe"
            className="mt-1"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Label>
        <Label htmlFor="json" className="mt-2">
          JSON{" "}
          <Textarea
            id="json"
            className="mt-1"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="{...}"
          />
        </Label>
        <div className="flex flex-row items-baseline mt-4">
        <Button className="mt-2 mx-auto" type="submit" disabled={loading}>
          Generate
        </Button>
         or 
        <Button className="mt-2 mx-auto" disabled={loading} type="button" onClick={() => setResume(JSON.stringify(template, null, "\t"))}>
          Use the template
        </Button>
        </div>
      </form>
  );
};
