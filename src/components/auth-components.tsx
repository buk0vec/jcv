import { auth, signIn, signOut } from "@/../auth";
import { Button } from "./ui/button";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <Button {...props}>Sign In</Button>
    </form>
  );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button variant="ghost" {...props}>
        Sign Out
      </Button>
    </form>
  );
}

export async function UserButton() {
  const session = await auth();
  if (session?.user) {
    return (
      <div className="flex flex-row justify-between items-baseline">
        <p className="h-fit">
          Signed in as <b>{session.user.name ?? session.user.email}</b> {session.user.name ? ` (${session.user.email})` : ""}
        </p>{" "}
        <SignOut />
      </div>
    );
  } else {
    return (
      <div className="flex flex-row justify-between items-baseline">
        <p className="h-fit">
          Currently not signed in. Sign in to get edit access to CVs that you
          create.
        </p>
        <SignIn />
      </div>
    );
  }
}

export async function getCommandBarProps(slug: string) {
  const session = await auth();
  if (session?.user) {
    const owner = await redis.get(`cv-owner:${slug}`);
    return { editable: owner === session.user.id, authenticated: true };
  }
  return { editable: false, authenticated: false };
}
