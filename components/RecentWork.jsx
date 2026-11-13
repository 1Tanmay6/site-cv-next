import { useState } from "react";
import { motion } from "framer-motion";
import { BsArrowRight } from "react-icons/bs";
import { HiChevronDown } from "react-icons/hi2";

const featuredWork = [
  {
    id: "ace",
    groupId: "genpact-data-scientist",
    meta: "Genpact · Research → Production · ICLR 2026",
    title: "Agentic Context Engineering (ACE)",
    outcome: "~80% lower adaptation cost · live in 2 production environments",
    description:
      "Self-improving agent context engine that learns from feedback without retraining, now live in two production environments.",
    tags: ["Agentic AI", "ICLR 2026", "Production"],
  },
  {
    id: "reconciliation",
    groupId: "genpact-data-scientist",
    meta: "Genpact · Global equipment manufacturer",
    title: "3-Way Invoice, PO & Ledger Reconciliation",
    outcome: "~90% of reconciliations automated · top ~10% anomalies surfaced",
    description:
      "Finance reconciliation across statements, invoices, and POs; surfaces only true anomalies for human review.",
    tags: ["Finance", "HITL", "Document AI"],
  },
  {
    id: "forecasting",
    groupId: "genpact-data-scientist",
    meta: "Genpact · Global CPG client",
    title: "Demand Forecasting Agent",
    outcome: "~40% lower planner workload",
    description:
      "Supply-chain demand planning with multimodal RAG and per-SKU model selection.",
    tags: ["Supply Chain", "RAG", "Multi-agent"],
  },
];

const projectDetails = {
  "Agentic Context Engineering (ACE)":
    "Built a self-improving context engine that lets agents learn from human feedback without retraining. Validated across 4 use cases and deployed in 2 production environments.",
  "LLM Invoice–PO Matching":
    "Fine-tuned an LLM on Azure ML to match invoices with purchase orders, improving accuracy on real-world vendor data.",
  "Demand Forecasting Agent":
    "Multimodal RAG and multi-agent workflows enrich baseline forecasts with market intelligence and auto-select the best statistical model per SKU.",
  "Inventory Configuration":
    "Hybrid rule-based and agentic replenishment using lead time, demand variability, safety stock, and EOQ/RLQ, with HITL exceptions for auditability.",
  "3-Way Invoice, PO & Ledger Reconciliation":
    "Reconciliation platform that matches bank statements, invoices, and POs, isolating true anomalies into a targeted human-review queue.",
  "Supply Chain E2E Control Room":
    "Agentic command center centralizing logistics, inventory, revenue, and product performance, with conversational analytics and cross-team dispatch.",
  "Autonomous Shipment Tracking":
    "Real-time disruption model processing weather, news, and vessel-damage alerts to recommend re-routing, holding, or modality switches before SLAs slip.",
  "Field Dispatch Agent":
    "Multi-agent technician allocation balancing roster updates, workload, SLA, cost, and task priority in production.",
  "SCCR 2.0 — Risk Mitigation Agent":
    "Second-generation control room that classifies market events into strategic, external, and tactical risks, then forecasts their KPI impact.",
  "Data Marketplace":
    "Enterprise synthetic data product combining CTGAN, CopulaGAN, and LLM pipelines to remove data-availability bottlenecks for client POCs.",
  "Auto Insurance Form Parser":
    "Hybrid OCR + VLM extraction pipeline with LLM-driven root-cause diagnostics and a human correction loop.",
  "Synthetic Data Generation Research":
    "Benchmarked autoencoders against transformers for tabular and time-series synthesis, with fidelity and differential-privacy checks.",
  "Education Content Creator":
    "Multi-agent curriculum platform that researches topics and generates PPTX, Excel, Word, and PDF teaching kits plus aligned assessments.",
  "Tax Auditing Software":
    "Shipped a production prompt-engineering patch for a live tax-document pipeline, handling dense financial layouts and variable OCR formats.",
  "Document Extractor":
    "Parallelized microservices pipeline for extraction, key-value mapping, and JSON conversion, cutting processing from 8 minutes to 1 minute.",
  "Data Retrieval Pipeline":
    "Hierarchical parent-child RAG pipeline over PDFs, Word, images, tables, and text, preserving full context for generation.",
  "Tabular Data Conversation (SQL Agent)":
    "Graph-driven multi-pass SQL agent on Llama 2 that self-corrects and handles complex multi-table queries with natural-language input.",
  "Hybrid Recommendation System":
    "CNN-enhanced Neural Collaborative Filtering combined with TF-IDF content filtering, tuned through an 11-point ablation study to solve cold-start and sparsity.",
  "Multi-Generator SRGAN (MG-SRGAN)":
    "Two-phase multi-generator GAN that stabilizes training on constrained hardware while preserving perceptual quality.",
  "Automated HR Support Platform":
    "Hybrid ATS + LLM screening engine with structured scoring, transparent reasoning, and a configurable top-K threshold.",
  "VLM-Based Security Monitoring":
    "ESP32-CAM paired with a Vision-Language Model, triggering inference only on presence detection to cut unnecessary compute and passive alerts.",
};

const experienceGroups = [
  {
    id: "genpact-data-scientist",
    eyebrow: "Full-time · Jun 2025 – Present · Bangalore",
    title: "Genpact — Data Scientist",
    summary: "9 projects · ACE, LLM matching, forecasting, and control rooms",
    metric: "ACE · ~80% lower adaptation cost",
    projects: [
      {
        title: "Agentic Context Engineering (ACE)",
        meta: "Genpact · Research → Production",
        impact: "~80% lower adaptation cost · live in 2 environments",
        description:
          "Self-improving agent context engine that learns from feedback without retraining.",
        tags: ["Agentic AI", "Context Engineering", "ICLR 2026"],
      },
      {
        title: "LLM Invoice–PO Matching",
        meta: "Genpact · Finance",
        impact: "~40% higher accuracy on noisy vendor data",
        description:
          "Fine-tuned LLM for invoice-to-PO matching on noisy vendor data.",
        tags: ["LLM Fine-tuning", "Azure ML"],
      },
      {
        title: "Demand Forecasting Agent",
        meta: "Genpact · Supply Chain",
        impact: "~40% lower planner workload",
        description: "Multimodal RAG and multi-agent model selection per SKU.",
        tags: ["RAG", "Multi-agent", "Forecasting"],
      },
      {
        title: "Inventory Configuration",
        meta: "Genpact · Supply Chain",
        impact: "~80% of planning decisions automated",
        description:
          "Rule-based + agentic replenishment with HITL exceptions.",
        tags: ["Supply Chain", "Optimization", "HITL"],
      },
      {
        title: "3-Way Invoice, PO & Ledger Reconciliation",
        meta: "Genpact · Finance",
        impact: "~90% automated · ~90% less manual review",
        description:
          "Matches statements, invoices, and POs; surfaces true anomalies.",
        tags: ["Reconciliation", "Document AI", "HITL"],
      },
      {
        title: "Supply Chain E2E Control Room",
        meta: "Genpact · Supply Chain",
        impact: "Unified cross-domain KPIs and task routing",
        description:
          "Agentic command center for logistics, inventory, and revenue KPIs.",
        tags: ["Multi-agent", "Analytics", "Command Center"],
      },
      {
        title: "Autonomous Shipment Tracking",
        meta: "Genpact · Logistics",
        impact: "~85% accuracy · ~12s decision latency",
        description:
          "Real-time disruption alerts with re-routing recommendations.",
        tags: ["Logistics", "Decision Support", "Real-time"],
      },
      {
        title: "Field Dispatch Agent",
        meta: "Genpact · Supply Chain",
        impact: "Under 10s per work order · ~90% decision accuracy",
        description:
          "Multi-agent technician allocation under 10s per work order.",
        tags: ["Multi-agent", "Scheduling", "In Progress"],
        status: "In progress",
      },
      {
        title: "SCCR 2.0 — Risk Mitigation Agent",
        meta: "Genpact · Supply Chain",
        impact: "Event-driven risk visibility and risk-adjusted forecasts",
        description:
          "Classifies market events and produces risk-adjusted forecasts.",
        tags: ["Risk", "Forecasting", "In Progress"],
        status: "In progress",
      },
    ],
  },
  {
    id: "genpact-internship",
    eyebrow: "Internship · Jan 2025 – Jun 2025 · Bangalore",
    title: "Genpact — Data Science Intern",
    summary: "3 projects · synthetic data, document AI, and Data Marketplace",
    metric: "Data Marketplace · ~40% faster POCs",
    projects: [
      {
        title: "Data Marketplace",
        meta: "Genpact · Synthetic Data Product",
        impact: "~40% faster POCs · still in production",
        description:
          "CTGAN, CopulaGAN, and LLM synthetic data for faster client POCs.",
        tags: ["CTGAN", "Synthetic Data", "LLM"],
      },
      {
        title: "Auto Insurance Form Parser",
        meta: "Genpact · Insurance",
        impact: "~30% higher field accuracy · ~60% less manual effort",
        description: "OCR + VLM extraction with a human correction loop.",
        tags: ["OCR", "VLM", "Document AI"],
      },
      {
        title: "Synthetic Data Generation Research",
        meta: "Genpact · Research",
        impact: "Privacy-safe synthetic data with zero PII leakage",
        description:
          "Autoencoders vs. transformers for privacy-safe synthesis.",
        tags: ["Synthetic Data", "Differential Privacy", "Benchmarking"],
      },
    ],
  },
  {
    id: "vanquisher-internship",
    eyebrow: "Internship · Jun 2024 – Nov 2024 · Remote",
    title: "Vanquisher Software Services — Data Science Intern",
    summary: "4 projects · curriculum generation, tax auditing, and document AI",
    metric: "Education Content · ~80% less prep time",
    projects: [
      {
        title: "Education Content Creator",
        meta: "Vanquisher · National education client",
        impact: "~80% less educator prep time",
        description: "Multi-agent curriculum and assessment generation.",
        tags: ["Multi-agent", "EdTech", "Document Generation"],
      },
      {
        title: "Tax Auditing Software",
        meta: "Vanquisher · Big-4 client",
        impact: "~30% higher extraction accuracy",
        description:
          "Prompt-engineering patch for live tax-document extraction.",
        tags: ["Prompt Engineering", "Document AI", "Guardrails"],
      },
      {
        title: "Document Extractor",
        meta: "Vanquisher · Internal Platform",
        impact: "~87.5% faster document processing",
        description:
          "Parallelized extraction, key-value mapping, and JSON output.",
        tags: ["Microservices", "Async", "Document AI"],
      },
      {
        title: "Data Retrieval Pipeline",
        meta: "Vanquisher · Internal Platform",
        impact: "~50% faster vector search · fewer hallucinations",
        description:
          "Parent-child RAG over PDFs, images, tables, and text.",
        tags: ["RAG", "Vector Search", "Multimodal"],
      },
    ],
  },
  {
    id: "personal-projects",
    eyebrow: "Personal · Open Source & Research",
    title: "Personal Projects & Research",
    summary: "5 projects · SQL agent, recommenders, GANs, HR, and edge VLM",
    metric: "SQL Agent · ~60% higher accuracy",
    href: "https://github.com/1Tanmay6",
    hrefLabel: "Explore more on GitHub",
    projects: [
      {
        title: "Tabular Data Conversation (SQL Agent)",
        meta: "Open Source · GenAI",
        impact: "~60% higher SQL accuracy",
        description: "Graph-driven multi-pass SQL generation on Llama 2.",
        tags: ["Llama 2", "SQL Agent", "Graph Orchestration"],
      },
      {
        title: "Hybrid Recommendation System",
        meta: "Research · Recommenders",
        impact: "22% lower RMSE on MovieLens 1M",
        description: "CNN-NCF + TF-IDF content filtering for cold-start.",
        tags: ["NCF", "TF-IDF", "PyTorch"],
      },
      {
        title: "Multi-Generator SRGAN (MG-SRGAN)",
        meta: "Research · Generative Models",
        impact: "+26.3% PSNR · ~30% faster training",
        description:
          "Two-phase, multi-generator GAN for stable super-resolution.",
        tags: ["GAN", "Super-Resolution", "PyTorch"],
      },
      {
        title: "Automated HR Support Platform",
        meta: "Open Source · GenAI",
        impact: "Top-K shortlists from high-volume applicant pools",
        description: "ATS rules + LLM scoring with top-K shortlisting.",
        tags: ["ATS", "LLM Evaluation", "Hiring"],
      },
      {
        title: "VLM-Based Security Monitoring",
        meta: "Open Source · Edge AI",
        impact: "Context-aware alerts every 10s",
        description:
          "ESP32-CAM + VLM alerts triggered by presence detection.",
        tags: ["VLM", "ESP32", "Edge AI"],
      },
    ],
  },
];

const ProjectCard = ({ project }) => {
  return (
    <article
      tabIndex={0}
      onClick={(event) => event.currentTarget.focus()}
      className="group relative flex flex-col h-full min-h-[240px] p-5 transition-all duration-300 border rounded-lg border-white/10 bg-[rgba(65,47,123,0.15)] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-[rgba(89,6,169,0.15)] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/40"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-[0.18em] text-accent/80">
            {project.meta}
          </span>
          {project.status ? (
            <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-accent">
              {project.status}
            </span>
          ) : null}
        </div>
        <h5 className="mb-1 text-base font-medium text-white">
          {project.title}
        </h5>
        <p className="mb-3 text-sm font-medium text-accent/90">
          {project.impact}
        </p>
        <p className="mb-4 text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <ul className="flex flex-wrap gap-2 mt-auto">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="px-2 py-1 text-[10px] uppercase tracking-[0.12em] border rounded-full border-white/10 text-white/50"
            >
              {tag}
            </li>
          ))}
        </ul>
        <span className="inline-flex items-center mt-4 text-[9px] uppercase tracking-[0.18em] text-white/50 transition-colors duration-300 group-hover:text-accent">
          <span className="md:hidden">Tap for details</span>
          <span className="hidden md:inline">Hover for details</span>
        </span>
      </div>

      <span className="sr-only">{projectDetails[project.title]}</span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col justify-between overflow-hidden rounded-lg border border-accent/30 bg-primary/95 p-5 opacity-0 translate-y-3 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        <div>
          <div className="flex items-start justify-between gap-3">
            <span className="text-[9px] uppercase tracking-[0.18em] text-accent">
              {project.meta}
            </span>
            {project.status ? (
              <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-accent">
                {project.status}
              </span>
            ) : null}
          </div>
          <h5 className="mt-2 text-base font-medium text-white">
            {project.title}
          </h5>
          <p className="mt-1 text-sm font-medium text-accent">
            {project.impact}
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-white/70">
            {projectDetails[project.title] || project.description}
          </p>
        </div>
        <ul className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="px-2 py-1 text-[9px] uppercase tracking-[0.12em] border rounded-full border-white/15 text-white/60"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

const RecentWork = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const feature = featuredWork[activeFeature];

  const openChapter = (groupId) => {
    const details = document.getElementById(groupId);
    if (!details) return;
    details.open = true;
    details.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col gap-y-10">
      <section>
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-white">
            Featured work<span className="text-accent">.</span>
          </h3>
          <p className="text-sm">
            Three projects that show the outcomes I optimize for.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-2">
            {featuredWork.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveFeature(i)}
                aria-pressed={activeFeature === i}
                className={`group flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-300 ${
                  activeFeature === i
                    ? "border-accent/40 bg-accent/[0.06]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <span
                  className={`text-[10px] font-semibold ${
                    activeFeature === i ? "text-accent" : "text-white/60"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block">
                  <span className="block text-[9px] uppercase tracking-[0.18em] text-accent">
                    {item.meta}
                  </span>
                  <span className="block mt-1 text-sm font-medium text-white">
                    {item.title}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative overflow-hidden p-6 border rounded-xl border-accent/20 bg-accent/[0.04]"
          >
            <span className="text-[10px] uppercase tracking-[0.18em] text-accent">
              {feature.meta}
            </span>
            <h4 className="mt-2 text-xl font-semibold text-white">
              {feature.title}
            </h4>
            <p className="mt-2 text-sm font-medium text-accent/90">
              {feature.outcome}
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              {feature.description}
            </p>
            <ul className="flex flex-wrap gap-2 mt-4">
              {feature.tags.map((tag) => (
                <li
                  key={tag}
                  className="px-2 py-1 text-[10px] uppercase tracking-[0.12em] border rounded-full border-white/10 text-white/50"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => openChapter(feature.groupId)}
              className="inline-flex items-center mt-5 text-sm transition-all duration-300 gap-x-2 text-accent hover:gap-x-3"
            >
              Explore this chapter
              <BsArrowRight aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </section>

      <section className="flex flex-col gap-y-4">
        <div>
          <h3 className="text-xl font-semibold text-white">
            Explore the work<span className="text-accent">.</span>
          </h3>
          <p className="text-sm">Expand a chapter to see the projects.</p>
        </div>

        {experienceGroups.map((group) => (
          <details
            key={group.id}
            id={group.id}
            open={group.open}
            className="overflow-hidden transition-colors border rounded-xl scroll-mt-28 group border-white/10 bg-white/[0.02] open:border-accent/20 open:bg-white/[0.04]"
          >
            <summary className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 p-5 transition-colors cursor-pointer list-none hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden">
              <span className="col-start-1 row-start-1 text-[10px] uppercase tracking-[0.18em] text-accent/80">
                {group.eyebrow}
              </span>
              <h4 className="col-start-1 row-start-2 text-lg font-semibold text-white">
                {group.title}
              </h4>
              <span className="col-start-1 row-start-3 text-sm text-white/60">
                {group.summary}
              </span>
              <span className="flex items-center self-center row-span-3 col-start-2 row-start-1 gap-x-4">
                <span className="hidden text-xs text-accent sm:block">
                  {group.metric}
                </span>
                <HiChevronDown
                  aria-hidden="true"
                  className="text-xl transition-transform duration-300 text-accent group-open:rotate-180"
                />
              </span>
            </summary>

            <div className="p-5 border-t border-white/10">
              <div className="grid gap-4 md:grid-cols-2">
                {group.projects.map((project) => (
                  <ProjectCard key={project.title} project={project} />
                ))}
              </div>

              {group.href ? (
                <a
                  href={group.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-5 text-sm transition-all duration-300 gap-x-2 text-accent hover:gap-x-3"
                >
                  {group.hrefLabel}
                  <BsArrowRight aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </details>
        ))}
      </section>
    </div>
  );
};

export default RecentWork;
