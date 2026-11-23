import type { CaseStudiesContent } from "@/types";

/**
 * Homepage "Impact & Case Studies" content; layout follows the Google Stitch homepage design.
 * Every fact and result comes from the resume in `public/documents/`: do not add metrics,
 * volumes or outcomes that are not stated there.
 */
export const caseStudiesContent: CaseStudiesContent = {
  eyebrow: "03 / Impact & Case Studies",
  title: "Selected Work & Engineering Impact.",
  intro:
    "Complex engineering problems solved through architecture, modernization and engineering leadership.",
  items: [
    {
      id: "java-modernization-platform",
      category: "AI Engineering",
      title: "AI-Powered Java Modernization Platform",
      impact: "Automated Modernization Workflows",
      summary:
        "Architected an AI-powered platform using LLMs, LangGraph and a multi-agent architecture to automate code discovery, dependency analysis, code transformation, validation, testing and migration reporting. RAG pipelines over migration playbooks, coding standards and API documentation provide context-aware recommendations, and MCP integrations connect Git repositories, build pipelines and developer tools.",
      technologies: ["LLMs", "LangGraph", "Multi-Agent", "RAG", "MCP"],
      domain: "Enterprise Banking",
    },
    {
      id: "global-disbursement-platform",
      category: "Financial Systems",
      title: "HSBC Global Disbursement Platform",
      impact: "≈3× Bulk Payment Throughput",
      summary:
        "Architected Spring Boot microservices for payment validation, beneficiary management, reconciliation, notification and transaction orchestration using Domain-Driven Design, with Kafka-based asynchronous communication and retries, idempotency, circuit breakers and dead-letter queues. Resolved a critical HTTP 413 production issue by redesigning synchronous request processing into an asynchronous batch-processing architecture.",
      technologies: ["Spring Boot", "Apache Kafka", "DDD", "Spring Security"],
      domain: "Payments & Disbursements",
    },
    {
      id: "java-17-modernization",
      category: "Modernization",
      title: "Enterprise Java 8 to Java 17 Modernization",
      impact: "≈40% Migration Effort Reduction",
      summary:
        "Led the modernization of legacy enterprise banking applications from Java 8 to Java 17, defining migration strategies, coding standards and governance frameworks, and building reusable AI-driven workflows for dependency upgrades, deprecated API replacement, Spring Boot migration and automated remediation while maintaining production stability and compliance.",
      technologies: ["Java 17", "Spring Boot", "Migration Governance", "AI-Assisted Engineering"],
      domain: "Enterprise Banking",
    },
    {
      id: "engineering-transformation",
      category: "Engineering Leadership",
      title: "Enterprise Engineering Transformation",
      impact: "15% Delivery Efficiency Gain",
      summary:
        "Managing and mentoring a team of 38 engineers across enterprise architecture, AI engineering and cloud-native delivery: conducting architecture reviews, guiding technical strategy, and partnering with enterprise architects to establish modernization roadmaps, architecture standards and AI adoption strategies across multiple enterprise applications.",
      technologies: ["Team Leadership", "Architecture Governance", "Mentoring", "AI Adoption"],
      domain: "Engineering Organization",
    },
  ],
};
