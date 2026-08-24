import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import ContractPageClient from "./ContractPageClient";

interface ContractPageProps {
  params: {
    projectId: string;
  };
  searchParams: {
    freelancerEmail?: string;
  };
}

export default async function ContractPage({ params, searchParams }: ContractPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { projectId } = params;
  const freelancerEmail = searchParams.freelancerEmail;

  if (!freelancerEmail) {
    // If the freelancerEmail is not provided in search params,
    // they can't access this route since the contract API requires it.
    // In a real app we might lookup the project to find the accepted freelancer email.
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-muted-foreground text-lg">Invalid Contract Link. Freelancer email missing.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ContractPageClient projectId={projectId} freelancerEmail={freelancerEmail} />
    </div>
  );
}
