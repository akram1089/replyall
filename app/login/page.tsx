import { Suspense } from "react";
import { getCampaignTemplate } from "@/lib/templates/campaign-templates";
import LoginForm from "@/components/login-form";

export const metadata = {
  title: "Login - OpenReply",
  description: "Sign in to manage Instagram comment-to-DM campaigns.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    callbackUrl?: string;
    template?: string;
  }>;
}) {
  const params = await searchParams;
  const selectedTemplate = getCampaignTemplate(params.template);
  const templateCallbackUrl = selectedTemplate
    ? `/campaigns/new?template=${selectedTemplate.slug}`
    : null;
  const callbackUrl = params.callbackUrl ?? templateCallbackUrl ?? "/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground">OpenReply</h1>
          <p className="text-muted text-sm leading-relaxed mt-2">
            {selectedTemplate
              ? `Sign in to use the ${selectedTemplate.title} template.`
              : "Create an account or log in, then connect your Instagram professional account."}
          </p>
        </div>

        <Suspense fallback={<div className="panel rounded p-8 text-sm text-muted">Loading…</div>}>
          <LoginForm
            callbackUrl={callbackUrl}
            templateTitle={selectedTemplate?.title}
          />
        </Suspense>
      </div>
    </div>
  );
}
