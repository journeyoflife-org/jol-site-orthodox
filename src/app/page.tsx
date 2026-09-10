import type { Metadata } from "next";
import tenant from "@/fixtures/tenant.json";
import { resolveLocale, buildHreflang, buildCanonical } from "@/lib/resolve-locale";
import { buildChurchEntity, buildBreadcrumb } from "@/lib/json-ld";

const locales = ["lt", "en", "ru"] as const;

export function generateMetadata(): Metadata {
  const name = resolveLocale(tenant.name, "lt");
  return {
    title: `${name} — Orthodox Church Landing | ${tenant.slug}`,
    alternates: {
      canonical: buildCanonical(tenant.identity.domain),
      languages: buildHreflang(tenant.identity.domain, locales),
    },
  };
}

export default function OrthodoxPage() {
  const locale = "lt";
  const t = (obj: Record<string, string>) => resolveLocale(obj, locale);
  const churchEntity = buildChurchEntity({
    name: t(tenant.name),
    address: tenant.identity.address,
    phone: tenant.identity.phone,
    geo: { lat: 54.6872, lng: 25.2797 },
    parentOrganization: tenant.identity.jurisdiction || "",
    additionalProperty: [{ name: "denomination", value: "Russian Orthodox" }]
  });
  const breadcrumb = buildBreadcrumb([
    { name: t(tenant.name), url: `https://${tenant.identity.domain}/` },
  ]);
  const page = tenant.pages[0];

  const hero = page.contentBlocks[0] as any;
  const schedule = page.contentBlocks[1] as any;
  const stats = page.contentBlocks[3] as any;
  const cta = page.contentBlocks[4] as any;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify(churchEntity) } }
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify(breadcrumb) } }
      />

      {/* Hero */}
      <section aria-label="Hero" className="bg-purple-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t(hero.heading)}</h1>
          <p className="text-lg text-gray-600">{t(hero.body)}</p>
        </div>
      </section>

      {/* Service schedule */}
      <section aria-label="Service schedule" className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">{t(schedule.heading)}</h2>
          <div className="space-y-3">
            {schedule.items.map((item: any, i: number) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">{t(item.title)}</h3>
                {item.description && <p className="text-gray-600 text-sm mt-1">{t(item.description)}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Community" className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t(stats.heading)}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.items.map((item: any, i: number) => (
              <div key={i} className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-purple-700">{item.value}</div>
                <div className="text-sm text-gray-600 mt-1">{t(item.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-label="Quick links" className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="flex flex-wrap gap-4 justify-center">
            {cta.links.map((link: any, i: number) => (
              <a key={i} href={link.href} className="px-6 py-3 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors font-medium">{t(link.label)}</a>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
