import type { CoreCapabilitiesContent } from "@/types";

/**
 * Homepage "Core Capabilities" content; layout follows the Google Stitch homepage design.
 * Tags only list technologies and practices backed by the resume in `public/documents/`.
 */
export const coreCapabilitiesContent: CoreCapabilitiesContent = {
  eyebrow: "02 / Core Capabilities",
  title: "What I Bring to the Table.",
  intro:
    "Technology depth, architecture and engineering leadership, applied together to complex enterprise initiatives.",
  items: [
    {
      id: "architecture",
      title: "Enterprise Architecture & System Design",
      icon: "architecture",
      description:
        "Designing distributed, event-driven systems with Domain-Driven Design, clear service boundaries and secure API contracts, and owning the architecture decisions and trade-offs behind scalable, resilient platforms.",
      tags: ["Microservices", "Event-Driven", "DDD", "System Design"],
    },
    {
      id: "modernization",
      title: "Enterprise Modernization",
      icon: "modernization",
      description:
        "Modernizing legacy enterprise applications through migration strategies, coding standards and governance frameworks, from Java 8 to 17 upgrades to Spring Boot migration and automated remediation.",
      tags: ["Java 8 → 17", "Spring Boot Migration", "Governance", "Remediation"],
    },
    {
      id: "backend-platform",
      title: "Backend & Platform Engineering",
      icon: "backend",
      description:
        "Building secure backend services and REST APIs with Java and Spring, asynchronous messaging, and resilience patterns such as retries, idempotency, circuit breakers and dead-letter queues.",
      tags: ["Java 17/21", "Spring Boot", "Apache Kafka", "PostgreSQL"],
    },
    {
      id: "ai-engineering",
      title: "AI & Intelligent Engineering",
      icon: "ai",
      description:
        "Applying LLMs to engineering work: multi-agent workflows with LangGraph, RAG pipelines over enterprise knowledge, and Model Context Protocol integrations that bring AI into developer tooling.",
      tags: ["LangChain", "LangGraph", "RAG", "MCP"],
    },
    {
      id: "cloud-devops",
      title: "Cloud & DevOps Engineering",
      icon: "cloud",
      description:
        "Delivering cloud-native, containerized services on AWS, GCP, Kubernetes and OpenShift, with automated CI/CD pipelines and production monitoring for faster incident resolution.",
      tags: ["AWS", "GCP", "Kubernetes", "CI/CD"],
    },
    {
      id: "engineering-leadership",
      title: "Engineering Leadership",
      icon: "leadership",
      description:
        "Leading and mentoring engineering teams, running architecture and code reviews, and setting the standards and technical strategy that connect engineering execution to delivery.",
      tags: ["Team Leadership", "Architecture Reviews", "Mentoring", "Tech Strategy"],
    },
  ],
};
