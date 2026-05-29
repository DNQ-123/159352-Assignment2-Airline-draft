import { routesByOrigin } from "@/lib/airline";
import SearchFlightsClient from "./SearchFlightsClient";

type SearchPageProps = {
  searchParams: Promise<{
    orig?: string;
    dest?: string;
  }>;
};

export default async function SearchFlightsPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const origin =
    params.orig && routesByOrigin[params.orig] ? params.orig : "NZNE";
  const destination =
    params.dest && routesByOrigin[origin].includes(params.dest)
      ? params.dest
      : routesByOrigin[origin][0];

  return (
    <SearchFlightsClient
      initialOrigin={origin}
      initialDestination={destination}
    />
  );
}
