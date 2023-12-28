import { Metadata } from "next";
import { CreateForm } from "@/components/create-form";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: `jcv | CV Generator from JSONResume`,
  description:
    "A JSONResume CV generator using Next.js, Tailwind CSS, shadcn/ui",
};

/* TODO: Make sure to not include sections that don't have any data */
export default function Page() {
  return (
    <>
      <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
        <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-6">
          <h1 className="text-center text-4xl font-bold">jcv</h1>
          <p className="text-center">
            Create a&nbsp;
            <a href="/thomas-davis" className="underline hover:opacity-80">
              formatted CV
            </a>{" "}
            from a&nbsp;
            <a
              href="https://jsonresume.org/"
              target="_blank"
              className="underline hover:opacity-80"
            >
              JSONResume
            </a>
          </p>
          <CreateForm />
        </section>
      </main>
      <Toaster />
      <footer className="container mx-auto p-4 print:p-12 md:p-16">
        <p className="text-center">
          Made with ❤️ by&nbsp;
          <a
            href="http://github.com/buk0vec"
            className="underline hover:opacity-80"
            target="_blank"
          >
            buk0vec
          </a>
        </p>
      </footer>
    </>
  );
}
