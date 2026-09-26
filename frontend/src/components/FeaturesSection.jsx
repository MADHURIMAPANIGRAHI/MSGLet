import { motion ,useMotionValue,
  useMotionTemplate,} from "framer-motion";
import { Key, MessageSquare, Bell, Shield, BarChart3, Boxes } from "lucide-react";

const features = [
  {
    icon: Key,
    title: "API Key Generation",
    description: "Create and verify API keys with role-based access control and automatic rotation.",
  },
  {
    icon: MessageSquare,
    title: "Message Sending & Receiving",
    description: "Send and receive messages through multiple channels with delivery confirmation.",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description: "Push notifications and webhooks with guaranteed delivery and retry logic.",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "Enterprise-grade login and registration with MFA and SSO support.",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description: "Comprehensive tracking and analytics dashboard for all API interactions.",
  },
  {
    icon: Boxes,
    title: "Microservice Architecture",
    description: "Decoupled services that scale independently for maximum reliability.",
  },
];

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-200);
    mouseY.set(-200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="
          glass-card p-8 h-full relative overflow-hidden
          transition-all duration-300
          hover:border-primary/30
          group-hover:shadow-[0_0_40px_hsl(var(--primary)/0.15)]
        "
      >
        {/* CURSOR FOLLOW SHINE */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                260px circle at ${mouseX}px ${mouseY}px,
                hsl(var(--primary) / 0.18),
                transparent 60%
              )
            `,
          }}
        />

        <motion.div
          className="
            w-14 h-14 rounded-xl bg-primary/10
            flex items-center justify-center mb-6
            transition-all duration-300
            group-hover:bg-primary/20
            group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]
          "
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-7 h-7 text-primary" />
        </motion.div>

        <h3 className="text-xl font-semibold mb-3 text-foreground">
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};


export const FeaturesSection = () => {
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
            Everything You Need to{" "}
            <span className="text-gradient-purple">Build Fast</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete suite of APIs designed for modern messaging applications
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
