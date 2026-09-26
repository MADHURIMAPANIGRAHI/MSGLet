import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const codeExample = `// Send a message using our REST API
const response = await fetch('https://api.MSGLet.io/v1/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '+1234567890',
    message: 'Hello from MSGLet!',
    channel: 'sms'
  })
});

const data = await response.json();
console.log('Message ID:', data.messageId);`;

const CodeBlock = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="glass-card overflow-hidden border-primary/20 hover:border-primary/40 transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border bg-card/80">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-sm text-muted-foreground font-mono">send-message.js</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        
        {/* Code */}
        <div className="p-6 overflow-x-auto">
          <pre className="text-sm font-mono leading-relaxed">
            <code className="text-foreground">
              {codeExample.split('\n').map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.03, duration: 0.4 }}
                  className="whitespace-pre"
                >
                  <span className="select-none text-muted-foreground/50 mr-4 inline-block w-5 text-right">
                    {i + 1}
                  </span>
                  {highlightLine(line)}
                </motion.div>
              ))}
            </code>
          </pre>
        </div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 rounded-2xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

const highlightLine = (line) => {
  // Simple syntax highlighting
  return line
    .replace(/(\/\/.*)/g, '<span class="text-muted-foreground">$1</span>')
    .replace(/('.*?'|".*?")/g, '<span class="text-green-400">$1</span>')
    .replace(/\b(const|await|fetch)\b/g, '<span class="text-primary">$1</span>')
    .replace(/\b(method|headers|body)\b:/g, '<span class="text-secondary">$1</span>:')
    .split(/(<span.*?<\/span>)/)
    .map((part, i) => {
      if (part.startsWith('<span')) {
        const match = part.match(/class="(.*?)">(.*?)<\/span>/);
        if (match) {
          return <span key={i} className={match[1]}>{match[2]}</span>;
        }
      }
      return part;
    });
};

export const DeveloperSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial opacity-20" />
      
      <div className="container px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for <span className="text-gradient-cyan">Developers</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Clean, intuitive APIs with comprehensive documentation. Integrate messaging 
              in minutes with our SDKs for every major language.
            </p>
            
            <div className="space-y-4">
              {[
                "RESTful API with OpenAPI 3.0 spec",
                "SDKs for Node.js, Python, Go, Ruby",
                "Webhook support for real-time events",
                "Comprehensive error handling",
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <CodeBlock />
        </div>
      </div>
    </section>
  );
};
