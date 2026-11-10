import { Clock3 } from '@/components/icons';

type ComingSoonProps = {
  title: string;
  description: string;
  icon?: string;
  cta?: { label: string; href: string };
};

export default function ComingSoon({ title, description, icon = 'mdi:clock-outline', cta }: ComingSoonProps) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-[#003DA5]/15 p-8 text-center shadow-sm">
      <Clock3 className="h-12 w-12 mx-auto text-[#003DA5] mb-4" aria-hidden="true" />
      <h2 className="text-2xl text-[#00205B] font-medium">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#00205B]/75 max-w-xl mx-auto">{description}</p>
      {cta && (
        <a href={cta.href} className="inline-block mt-5 text-sm px-4 py-2 rounded-md bg-[#FFC72C] text-[#00205B] hover:bg-[#E6B220]">
          {cta.label}
        </a>
      )}
    </div>
  );
}
