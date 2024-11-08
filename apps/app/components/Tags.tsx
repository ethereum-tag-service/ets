import Address from "@app/components/Address";
import { Tag } from "@app/components/Tag";
import { TanstackTable } from "@app/components/TanstackTable";
import { TimeAgo } from "@app/components/TimeAgo";
import { URI } from "@app/components/URI";
import { globalSettings } from "@app/config/globalSettings";
import { useCurrentChain } from "@app/hooks/useCurrentChain";
import { useExplorerUrl } from "@app/hooks/useExplorerUrl";
import type { TagType } from "@app/types/tag";
import { toEth } from "@app/utils";
import { etsTokenConfig } from "@ethereum-tag-service/contracts/contracts";
import { createColumnHelper } from "@tanstack/react-table";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import type React from "react";
import { useMemo } from "react";
import { useChainId } from "wagmi";

type ColumnKey = "tag" | "created" | "owner" | "creator" | "relayer" | "timestamp" | "taggingRecords" | "totalRevenue";

type Props = {
  loading: boolean;
  title?: string;
  pageSize?: number;
  tags: TagType[];
  columns: ColumnKey[];
  rowLink?: boolean | ((tag: TagType) => string);
  pageIndex?: number;
  setPageIndex?: (index: number) => void;
  hasNextPage?: boolean;
};

const Tags: React.FC<Props> = ({
  loading,
  title,
  tags,
  pageSize = globalSettings.DEFAULT_PAGESIZE,
  columns,
  rowLink,
  pageIndex,
  setPageIndex,
  hasNextPage,
}) => {
  const { t } = useTranslation("common");
  const chainId = useChainId();
  const chain = useCurrentChain();
  const getExplorerUrl = useExplorerUrl();
  const etsTokenAddress = etsTokenConfig.address[chainId as keyof typeof etsTokenConfig.address];
  const columnHelper = createColumnHelper<TagType>();

  const columnConfigs = useMemo(
    () => ({
      tag: columnHelper.accessor("display", {
        header: () => "Tag",
        cell: (info) => (
          <div className="flex items-center">
            <Tag tag={info.row.original} />
            <URI value={getExplorerUrl("token", `${etsTokenAddress}/${info.row.original.id}`)} />
          </div>
        ),
      }),
      created: columnHelper.accessor("timestamp", {
        header: () => "Created",
        cell: (info) => <TimeAgo date={info.getValue() * 1000} />,
      }),
      owner: columnHelper.accessor("owner", {
        header: () => t("owner"),
        cell: (info) => {
          const owner = info.getValue();
          return (
            <Link href={`/explore/owners/${owner.id}`} className="link link-primary">
              <Address address={owner.id} ens={owner.ens} />
            </Link>
          );
        },
      }),
      creator: columnHelper.accessor("creator", {
        header: () => t("creator"),
        cell: (info) => {
          const creator = info.getValue();
          return (
            <Link href={`/explore/creators/${creator.id}`} className="link link-primary">
              <Address address={creator.id} ens={creator.ens} />
            </Link>
          );
        },
      }),
      relayer: columnHelper.accessor("relayer.id", {
        header: () => t("relayer"),
        cell: (info) => (
          <Link href={`/explore/relayers/${info.getValue()}`} className="link link-primary">
            <Address address={info.getValue()} />
          </Link>
        ),
      }),
      timestamp: columnHelper.accessor("timestamp", {
        header: () => "Created",
        cell: (info) => <TimeAgo date={info.getValue() * 1000} />,
      }),
      taggingRecords: columnHelper.accessor("tagAppliedInTaggingRecord", {
        header: () => "Tagging Records",
        id: "taggingRecords",
      }),
      totalRevenue: columnHelper.accessor(
        (row) => {
          return (
            Number(row.relayerRevenue) +
            Number(row.ownerRevenue) +
            Number(row.protocolRevenue) +
            Number(row.creatorRevenue)
          );
        },
        {
          header: () => t("total-revenue"),
          id: "totalRevenue",
          cell: (info) => (
            <span>
              {toEth(info.getValue(), 8)} {chain?.nativeCurrency.symbol}
            </span>
          ),
        },
      ),
    }),
    [columnHelper, t, etsTokenAddress, getExplorerUrl, chain?.nativeCurrency.symbol],
  );

  const selectedColumns = useMemo(
    () => columns.map((key) => columnConfigs[key]).filter(Boolean),
    [columns, columnConfigs],
  );

  return (
    <div className="col-span-12">
      <TanstackTable
        loading={loading}
        columns={selectedColumns}
        data={tags}
        hasNextPage={hasNextPage}
        rowsPerPage={pageSize}
        title={title}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        rowLink={typeof rowLink === "function" ? rowLink : rowLink ? (tag: TagType) => `/tag/${tag.id}` : undefined}
      />
    </div>
  );
};

export { Tags };
