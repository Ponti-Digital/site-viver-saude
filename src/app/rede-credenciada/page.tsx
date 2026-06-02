"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { ScrollAnimationWrapper } from "@/components/shared/ScrollAnimationWrapper";
import { WHATSAPP_URL } from "@/lib/constants/site";

type TabType = "hospitais" | "medicos";

interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
  neighborhood: string | null;
  address: string | null;
  phone: string | null;
  has_emergency: boolean | null;
  lat: number | null;
  lng: number | null;
  distance?: number;
}

interface Doctor {
  id: string;
  name: string;
  crm: string | null;
  city: string;
  state: string;
  phone: string | null;
  whatsapp: string | null;
  specialties?: string[];
}

interface Specialty {
  id: string;
  name: string;
  slug: string;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function RedeCredenciadaPage() {
  const [tab, setTab] = useState<TabType>("hospitais");
  const [busca, setBusca] = useState("");
  const [especialidadeId, setEspecialidadeId] = useState("");
  const [somenteUrgencia, setSomenteUrgencia] = useState(false);
  const [especialidades, setEspecialidades] = useState<Specialty[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  // Load specialties once
  useEffect(() => {
    fetch("/api/rede-credenciada?tipo=especialidades")
      .then((r) => r.json())
      .then((json) => setEspecialidades(json.data ?? []))
      .catch(() => {});
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tipo: tab });
      if (busca.trim()) params.set("busca", busca.trim());
      if (tab === "medicos" && especialidadeId) params.set("especialidade", especialidadeId);
      if (tab === "hospitais" && somenteUrgencia) params.set("urgencia", "true");

      const res = await fetch(`/api/rede-credenciada?${params}`);
      const json = await res.json();

      if (tab === "medicos") {
        setDoctors(json.data ?? []);
      } else {
        setHospitals(json.data ?? []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [tab, busca, especialidadeId, somenteUrgencia]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Reset search when switching tabs
  const switchTab = (next: TabType) => {
    if (next === tab) return;
    setTab(next);
    setBusca("");
    setEspecialidadeId("");
    setSomenteUrgencia(false);
    setSortByDistance(false);
  };

  const handleNearestClick = () => {
    if (sortByDistance) {
      setSortByDistance(false);
      return;
    }
    if (userPos) {
      setSortByDistance(true);
      return;
    }
    if (!("geolocation" in navigator)) {
      alert("Seu navegador não suporta geolocalização.");
      return;
    }
    setGeoLoading(true);
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "denied") {
            alert("A localização está bloqueada. Acesse as configurações do navegador para permitir.");
            setGeoLoading(false);
            return;
          }
          requestPosition();
        })
        .catch(() => requestPosition());
    } else {
      requestPosition();
    }
  };

  const requestPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSortByDistance(true);
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === 1) {
          alert("Permissão de localização negada. Clique no cadeado na barra de endereço para permitir.");
        } else if (err.code === 2) {
          alert("Não foi possível determinar sua localização. Tente novamente.");
        } else {
          alert("Tempo esgotado ao buscar localização. Tente novamente.");
        }
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
    );
  };

  const displayHospitals =
    sortByDistance && userPos
      ? hospitals
          .map((h) => ({
            ...h,
            distance: h.lat && h.lng ? haversineKm(userPos.lat, userPos.lng, h.lat, h.lng) : 9999,
          }))
          .sort((a, b) => a.distance - b.distance)
      : hospitals;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimationWrapper>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Rede Credenciada
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Encontre hospitais, clínicas, laboratórios e profissionais perto de você.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Download PDF */}
            <div className="flex justify-end mb-4">
              <a
                href="/docs/rede-credenciada/rede-credenciada.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Baixar a rede credenciada completa em PDF"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-white text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar rede credenciada (PDF)
              </a>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-card rounded-lg p-1 border border-border">
                <button
                  onClick={() => switchTab("hospitais")}
                  className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                    tab === "hospitais"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Hospitais e Clínicas
                </button>
                <button
                  onClick={() => switchTab("medicos")}
                  className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                    tab === "medicos"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Médicos
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="max-w-3xl mx-auto mb-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={tab === "hospitais" ? "Buscar hospital ou clínica..." : "Buscar médico por nome ou CRM..."}
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>

                {/* Urgência filter - hospitals only */}
                {tab === "hospitais" && (
                  <button
                    onClick={() => setSomenteUrgencia(!somenteUrgencia)}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                      somenteUrgencia
                        ? "bg-red-600 text-white shadow-sm"
                        : "bg-white border border-border text-foreground hover:border-red-400 hover:text-red-600"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    {somenteUrgencia ? "Urgência (ativo)" : "Urgência"}
                  </button>
                )}

                {/* Specialty filter - doctors only */}
                {tab === "medicos" && (
                  <select
                    value={especialidadeId}
                    onChange={(e) => setEspecialidadeId(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors shrink-0"
                  >
                    <option value="">Todas as especialidades</option>
                    {especialidades.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* Nearest button - only for hospitals */}
                {tab === "hospitais" && (
                  <button
                    onClick={handleNearestClick}
                    disabled={geoLoading}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                      sortByDistance
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white border border-border text-foreground hover:border-primary hover:text-primary"
                    } disabled:opacity-50`}
                  >
                    {geoLoading ? (
                      <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {sortByDistance ? "Mais próxima (ativo)" : "Mais próxima de mim"}
                  </button>
                )}
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}

            {/* Hospitals List */}
            {!loading && tab === "hospitais" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayHospitals.map((h) => (
                  <div
                    key={h.id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        {h.distance !== undefined && h.distance < 9999 && (
                          <span className="bg-accent/10 text-accent-dark text-xs font-semibold px-2.5 py-1 rounded-full">
                            {h.distance.toFixed(1)} km
                          </span>
                        )}
                        {h.has_emergency && (
                          <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                            Urgência
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1.5">{h.name}</h3>
                    {(h.address || h.neighborhood) && (
                      <p className="text-sm text-muted flex items-start gap-1.5 mb-1">
                        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>
                          {h.address}
                          {h.neighborhood && `, ${h.neighborhood}`}
                          {`, ${h.city}/${h.state}`}
                        </span>
                      </p>
                    )}
                    {h.phone && (
                      <p className="text-sm text-muted flex items-center gap-1.5">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {h.phone}
                      </p>
                    )}
                    {h.lat && h.lng && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto pt-4 inline-flex items-center justify-center gap-2 w-full rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Como Chegar
                      </a>
                    )}
                  </div>
                ))}
                {hospitals.length === 0 && (
                  <p className="col-span-full text-center text-muted py-8">
                    Nenhum hospital ou clínica encontrado.
                  </p>
                )}
              </div>
            )}

            {/* Doctors List */}
            {!loading && tab === "medicos" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {doctors.map((d) => (
                  <div
                    key={d.id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-xs text-muted bg-card px-2.5 py-1 rounded-full">
                        {d.city}/{d.state}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{d.name}</h3>
                    {d.crm && (
                      <p className="text-xs text-muted mb-2">CRM {d.crm}</p>
                    )}
                    {d.specialties && d.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {d.specialties.map((s) => (
                          <span
                            key={s}
                            className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {(d.phone || d.whatsapp) && (
                      <div className="mt-auto pt-3 space-y-1">
                        {d.phone && (
                          <a
                            href={`tel:${d.phone.replace(/\D/g, "")}`}
                            className="text-sm text-muted flex items-center gap-1.5 hover:text-primary transition-colors"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {d.phone}
                          </a>
                        )}
                        {d.whatsapp && (
                          <a
                            href={`https://wa.me/55${d.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted flex items-center gap-1.5 hover:text-menta-600 transition-colors"
                          >
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {doctors.length === 0 && (
                  <p className="col-span-full text-center text-muted py-8">
                    Nenhum profissional encontrado.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Não encontrou o que procurava?
          </h2>
          <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
            Entre em contato e nossa equipe ajudará você a encontrar o profissional ideal.
          </p>
          <Button href={WHATSAPP_URL} variant="primary" size="lg">
            Falar no WhatsApp
          </Button>
        </div>
      </section>
    </>
  );
}
