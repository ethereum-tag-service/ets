import Address from "@app/components/Address";
import type { SearchResult } from "@app/types/search";
import Link from "next/link";
import type { FC } from "react";

const RoleBadge: FC<{ role: string; address: string }> = ({ role, address }) => {
  // Remove trailing 's' and capitalize first letter
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1, -1);

  // Map roles to their respective paths
  const rolePaths: Record<string, string> = {
    creators: `/explore/creators/${address}`,
    owners: `/explore/owners/${address}`,
    taggers: `/explore/taggers/${address}`,
    relayers: `/explore/relayers/${address}`,
  };

  return (
    <Link href={rolePaths[role]} className="hover:opacity-80">
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors">
        {displayRole}
      </span>
    </Link>
  );
};

const AddressSection: FC<{ results: SearchResult[] }> = ({ results }) => {
  const addressGroups = results.reduce(
    (groups, result) => {
      if (!groups[result.id]) {
        groups[result.id] = {
          id: result.id,
          ens: result.ens || null,
          roles: [],
          type: result.type,
        };
      }
      groups[result.id].roles.push(result.type);
      return groups;
    },
    {} as Record<string, { id: string; ens: string | null; roles: string[]; type: string }>,
  );

  return (
    <div className="py-2">
      <h3 className="px-4 py-1 text-sm font-medium text-slate-700">Addresses</h3>
      <div className="divide-y divide-slate-100">
        {Object.values(addressGroups).map((group) => (
          <div key={group.id} className="px-4 py-3 hover:bg-slate-50">
            <Address address={group.id} ens={group.ens} explorerLink={false} />
            <div className="mt-2 flex flex-wrap gap-2">
              {group.roles.map((role) => (
                <RoleBadge key={role} role={role} address={group.id} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressSection;
