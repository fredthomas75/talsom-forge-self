import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type {
  MarketplaceContent,
  MarketplaceItem,
  MarketplaceDetailItem,
  MarketplaceBenefit,
  Bi,
} from "@/types/content";

const emptyBi = (): Bi => ({ fr: "", en: "" });

export function MarketplaceEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<MarketplaceContent>(content.marketplace);

  useEffect(() => { setData(content.marketplace); }, [content.marketplace]);

  const save = async () => { await updateSection("marketplace", data); };

  const updateDetail = (id: string, detail: MarketplaceDetailItem) => {
    setData({ ...data, details: { ...data.details, [id]: detail } });
  };

  const emptyDetail = (): MarketplaceDetailItem => ({
    extendedDesc: emptyBi(),
    keyBenefits: [],
    integrations: [],
    availability: emptyBi(),
  });

  return (
    <SectionEditor title="Marketplace" onSave={save}>
      <BilingualField
        label="Badge"
        value={data.badge}
        onChange={(badge) => setData({ ...data, badge })}
      />
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Titre
        </label>
        <Input
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          placeholder="Titre"
          className="text-sm"
        />
      </div>
      <BilingualField
        label="Sous-titre"
        value={data.subtitle}
        onChange={(subtitle) => setData({ ...data, subtitle })}
        multiline
      />

      <Tabs defaultValue="items" className="mt-4">
        <TabsList>
          <TabsTrigger value="items">Produits</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-4">
          <ArrayEditor<MarketplaceItem>
            label="Produits"
            items={data.items}
            onChange={(items) => setData({ ...data, items })}
            createItem={() => ({
              id: `mp-${Date.now()}`,
              name: "",
              tagline: emptyBi(),
              desc: emptyBi(),
              features: emptyBi(),
              tier: "",
              badgeCls: "",
            })}
            renderItem={(item, _i, update) => (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      ID
                    </label>
                    <Input
                      value={item.id}
                      onChange={(e) => update({ ...item, id: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Nom
                    </label>
                    <Input
                      value={item.name}
                      onChange={(e) => update({ ...item, name: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Tier
                    </label>
                    <Input
                      value={item.tier}
                      onChange={(e) => update({ ...item, tier: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Badge CSS Class
                    </label>
                    <Input
                      value={item.badgeCls}
                      onChange={(e) => update({ ...item, badgeCls: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                </div>
                <BilingualField label="Tagline" value={item.tagline} onChange={(tagline) => update({ ...item, tagline })} />
                <BilingualField label="Description" value={item.desc} onChange={(desc) => update({ ...item, desc })} multiline />
                <BilingualField label="Features" value={item.features} onChange={(features) => update({ ...item, features })} multiline />
              </div>
            )}
          />
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {data.items.map((item) => {
              const detail = data.details?.[item.id] ?? emptyDetail();
              return (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-sm font-medium">
                    {item.name || item.id}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <BilingualField
                        label="Description etendue"
                        value={detail.extendedDesc}
                        onChange={(extendedDesc) =>
                          updateDetail(item.id, { ...detail, extendedDesc })
                        }
                        multiline
                      />
                      <BilingualField
                        label="Disponibilite"
                        value={detail.availability}
                        onChange={(availability) =>
                          updateDetail(item.id, { ...detail, availability })
                        }
                      />
                      <ArrayEditor<MarketplaceBenefit>
                        label="Benefices cles"
                        items={detail.keyBenefits ?? []}
                        onChange={(keyBenefits) =>
                          updateDetail(item.id, { ...detail, keyBenefits })
                        }
                        createItem={() => ({ title: emptyBi(), desc: emptyBi() })}
                        renderItem={(b, _j, upd) => (
                          <div className="space-y-3">
                            <BilingualField label="Titre" value={b.title} onChange={(title) => upd({ ...b, title })} />
                            <BilingualField label="Description" value={b.desc} onChange={(desc) => upd({ ...b, desc })} multiline />
                          </div>
                        )}
                      />
                      <ArrayEditor<string>
                        label="Integrations"
                        items={detail.integrations ?? []}
                        onChange={(integrations) =>
                          updateDetail(item.id, { ...detail, integrations })
                        }
                        createItem={() => ""}
                        renderItem={(integ, _j, upd) => (
                          <Input
                            value={integ}
                            onChange={(e) => upd(e.target.value)}
                            placeholder="Nom de l'integration"
                            className="text-sm"
                          />
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          {data.items.length === 0 && (
            <p className="text-sm text-gray-400 py-4">
              Ajoutez d'abord des produits dans l'onglet "Produits".
            </p>
          )}
        </TabsContent>
      </Tabs>
    </SectionEditor>
  );
}
