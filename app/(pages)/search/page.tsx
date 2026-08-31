import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { SearchClient } from "./components/SearchClient";
import { fetchUsertoDisplay } from "./services/searchServerService";

export default async function SearchPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "freelancer";
    const initialUsers = await fetchUsertoDisplay();

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10">
            <div className="max-w-7xl mx-auto pb-24">
                <SearchClient userRole={userRole} initialResults={initialUsers?.userPipeline || []} initialPagination={initialUsers?.pagination} />
            </div>
        </div>
    );
}
