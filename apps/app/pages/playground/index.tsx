import { CreateTagIcon, CreateTaggingRecordIcon } from "@app/components/icons";
import Layout from "@app/layouts/default";
import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";

const Playground: NextPage = () => {
  const { t } = useTranslation("common");

  const cardsData = [
    {
      slug: "create-tagging-record",
      titleKey: "create-tagging-record",
      descriptionKey: "description-create-tagging-record",
      Icon: CreateTaggingRecordIcon,
    },
    {
      slug: "create-tag",
      titleKey: "create-tag",
      descriptionKey: "description-create-tag",
      Icon: CreateTagIcon,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto col-span-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {cardsData.map((card, index) => {
            const IconComponent = card.Icon;
            return (
              <a
                key={index}
                className="card card-compact border border-slate-200 hover:bg-base-200 transition-all duration-200 text-slate-700 hover:text-gray-950 hover:-translate-y-1"
                href={`/playground/${card.slug}`}
              >
                <figure className="bg-slate-100 rounded-lg col-span-3 m-4 py-8">
                  <div className="border-base-content bg-white rounded-full border border-opacity-5 shadow-lg p-3">
                    <IconComponent size={24} />
                  </div>
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{t(card.titleKey)}</h2>
                  <p className="text-xs opacity-60">{t(card.descriptionKey)}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Playground;
