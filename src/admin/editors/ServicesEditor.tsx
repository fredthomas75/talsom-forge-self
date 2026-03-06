import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SectionEditor } from "../components/SectionEditor";
import { BilingualField } from "../components/BilingualField";
import { ArrayEditor } from "../components/ArrayEditor";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type {
  ServicesContent,
  ServiceItem,
  ServiceDetailItem,
  ServicePhase,
  SubServiceItem,
  Bi,
} from "@/types/content";

const emptyBi = (): Bi => ({ fr: "", en: "" });

function ServiceItemEditor({
  item,
  update,
}: {
  item: ServiceItem;
  update: (v: ServiceItem) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID</label>
          <Input
            value={item.id}
            onChange={(e) => update({ ...item, id: e.target.value })}
            className="text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Icone (Lucide)
          </label>
          <Input
            value={item.iconName}
            onChange={(e) => update({ ...item, iconName: e.target.value })}
            className="text-sm"
          />
        </div>
      </div>
      <BilingualField label="Titre" value={item.title} onChange={(title) => update({ ...item, title })} />
      <BilingualField label="Sous-titre" value={item.subtitle} onChange={(subtitle) => update({ ...item, subtitle })} />
      <BilingualField label="Description" value={item.desc} onChange={(desc) => update({ ...item, desc })} multiline />
      <BilingualField label="Tags" value={item.tags} onChange={(tags) => update({ ...item, tags })} />
      <BilingualField label="Prix" value={item.price} onChange={(price) => update({ ...item, price })} />
      <div className="flex items-center gap-2 pt-1">
        <Checkbox
          checked={item.popular}
          onCheckedChange={(checked) => update({ ...item, popular: !!checked })}
        />
        <label className="text-xs font-medium text-gray-600">Populaire</label>
      </div>
    </div>
  );
}

function DetailEditor({
  serviceId,
  detail,
  onChange,
}: {
  serviceId: string;
  detail: ServiceDetailItem;
  onChange: (d: ServiceDetailItem) => void;
}) {
  return (
    <AccordionItem value={serviceId}>
      <AccordionTrigger className="text-sm font-medium">
        {serviceId}
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2">
          <BilingualField
            label="Description etendue"
            value={detail.extendedDesc}
            onChange={(extendedDesc) => onChange({ ...detail, extendedDesc })}
            multiline
          />
          <BilingualField
            label="Differenciateur"
            value={detail.differentiator}
            onChange={(differentiator) => onChange({ ...detail, differentiator })}
            multiline
          />
          <BilingualField
            label="Timeline"
            value={detail.timeline}
            onChange={(timeline) => onChange({ ...detail, timeline })}
          />

          <ArrayEditor<ServicePhase>
            label="Phases"
            items={detail.phases ?? []}
            onChange={(phases) => onChange({ ...detail, phases })}
            createItem={() => ({ name: emptyBi(), duration: emptyBi(), desc: emptyBi() })}
            renderItem={(phase, _i, upd) => (
              <div className="space-y-3">
                <BilingualField label="Nom" value={phase.name} onChange={(name) => upd({ ...phase, name })} />
                <BilingualField label="Duree" value={phase.duration} onChange={(duration) => upd({ ...phase, duration })} />
                <BilingualField label="Description" value={phase.desc} onChange={(desc) => upd({ ...phase, desc })} multiline />
              </div>
            )}
          />

          <ArrayEditor<Bi>
            label="Livrables"
            items={detail.deliverables ?? []}
            onChange={(deliverables) => onChange({ ...detail, deliverables })}
            createItem={emptyBi}
            renderItem={(item, _i, upd) => (
              <BilingualField label="Livrable" value={item} onChange={upd} />
            )}
          />

          <ArrayEditor<Bi>
            label="Ideal pour"
            items={detail.idealFor ?? []}
            onChange={(idealFor) => onChange({ ...detail, idealFor })}
            createItem={emptyBi}
            renderItem={(item, _i, upd) => (
              <BilingualField label="Profil" value={item} onChange={upd} />
            )}
          />

          <ArrayEditor<SubServiceItem>
            label="Sous-services"
            items={detail.subServices ?? []}
            onChange={(subServices) => onChange({ ...detail, subServices })}
            createItem={() => ({
              name: emptyBi(),
              price: emptyBi(),
              desc: emptyBi(),
              deliverables: [],
              timeline: emptyBi(),
            })}
            renderItem={(sub, _i, upd) => (
              <div className="space-y-3">
                <BilingualField label="Nom" value={sub.name} onChange={(name) => upd({ ...sub, name })} />
                <BilingualField label="Prix" value={sub.price} onChange={(price) => upd({ ...sub, price })} />
                <BilingualField label="Description" value={sub.desc} onChange={(desc) => upd({ ...sub, desc })} multiline />
                <BilingualField label="Timeline" value={sub.timeline} onChange={(timeline) => upd({ ...sub, timeline })} />
                <ArrayEditor<Bi>
                  label="Livrables du sous-service"
                  items={sub.deliverables ?? []}
                  onChange={(deliverables) => upd({ ...sub, deliverables })}
                  createItem={emptyBi}
                  renderItem={(d, _j, updD) => (
                    <BilingualField label="Livrable" value={d} onChange={updD} />
                  )}
                />
              </div>
            )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function ServicesEditor() {
  const { content, updateSection } = useContent();
  const [data, setData] = useState<ServicesContent>(content.services);

  useEffect(() => { setData(content.services); }, [content.services]);

  const save = async () => { await updateSection("services", data); };

  const updateDetail = (id: string, detail: ServiceDetailItem) => {
    setData({ ...data, details: { ...data.details, [id]: detail } });
  };

  const emptyDetail = (): ServiceDetailItem => ({
    extendedDesc: emptyBi(),
    differentiator: emptyBi(),
    phases: [],
    deliverables: [],
    timeline: emptyBi(),
    idealFor: [],
    subServices: [],
  });

  return (
    <SectionEditor title="Services" onSave={save}>
      <BilingualField label="Badge" value={data.badge} onChange={(badge) => setData({ ...data, badge })} />
      <BilingualField label="Titre" value={data.title} onChange={(title) => setData({ ...data, title })} />
      <BilingualField label="Sous-titre" value={data.subtitle} onChange={(subtitle) => setData({ ...data, subtitle })} multiline />

      <Tabs defaultValue="items" className="mt-4">
        <TabsList>
          <TabsTrigger value="items">Services</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-4">
          <ArrayEditor<ServiceItem>
            label="Services"
            items={data.items}
            onChange={(items) => setData({ ...data, items })}
            createItem={() => ({
              id: `service-${Date.now()}`,
              iconName: "Zap",
              title: emptyBi(),
              subtitle: emptyBi(),
              desc: emptyBi(),
              tags: emptyBi(),
              price: emptyBi(),
              popular: false,
            })}
            renderItem={(item, _i, update) => (
              <ServiceItemEditor item={item} update={update} />
            )}
          />
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {data.items.map((item) => {
              const detail = data.details?.[item.id] ?? emptyDetail();
              return (
                <DetailEditor
                  key={item.id}
                  serviceId={item.id}
                  detail={detail}
                  onChange={(d) => updateDetail(item.id, d)}
                />
              );
            })}
          </Accordion>
          {data.items.length === 0 && (
            <p className="text-sm text-gray-400 py-4">
              Ajoutez d'abord des services dans l'onglet "Services".
            </p>
          )}
        </TabsContent>
      </Tabs>
    </SectionEditor>
  );
}
