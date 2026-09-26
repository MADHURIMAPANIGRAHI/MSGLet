import { motion } from "framer-motion";
import { Lock, ShieldCheck, Gauge, Server } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All messages encrypted in transit and at rest using AES-256.",
  },
  {
    icon: ShieldCheck,
    title: "OAuth 2.0 & JWT",
    description: "Industry-standard authentication with secure token management.",
  },
  {
    icon: Gauge,
    title: "Rate Limiting",
    description: "Intelligent throttling to protect against abuse and DDoS.",
  },
  {
    icon: Server,
    title: "SOC 2 Compliant",
    description: "Enterprise-grade security audited by third parties.",
  },
];

export const SecuritySection = () => {
  return (
    <section className="py-32 relative">
      <div className="container px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Security & <span className="text-gradient-purple">Reliability</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade security built into every layer
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-card border border-glass-border flex items-center justify-center mx-auto mb-4"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 0 30px hsl(var(--secondary) / 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-8 h-8 text-secondary" />
                </motion.div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};