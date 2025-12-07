import { GovernanceCore } from "./GovernanceCore";
import { SecurityCore } from "./SecurityCore";
import { NeuralCore } from "./NeuralCore";
import { EvolutionEngine } from "./EvolutionEngine";
import { BusinessEngine } from "./BusinessEngine";
import { FinanceEngine } from "./FinanceEngine";
import { NLEngine } from "./NLEngine";

export class NorahOrchestrator {
  public governance: GovernanceCore;
  public security: SecurityCore;
  public neural: NeuralCore;
  public evolution: EvolutionEngine;
  public business: BusinessEngine;
  public finance: FinanceEngine;
  public nle: NLEngine;

  constructor() {
    this.governance = new GovernanceCore();
    this.security = new SecurityCore();
    this.neural = new NeuralCore();
    this.evolution = new EvolutionEngine();
    this.business = new BusinessEngine();
    this.finance = new FinanceEngine();
    this.nle = new NLEngine();
    console.log("[NorahOrchestrator initialized]");
  }

  public async start(): Promise<void> {
    this.governance.initialize();
    this.security.initialize();
    this.neural.initialize();
    this.evolution.initialize();
    this.business.initialize();
    this.finance.initialize();
    this.nle.initialize();
    console.log("[NorahOrchestrator fully operational]");
  }

  public async executeFounderCommand(command: string): Promise<unknown> {
    const normalized = command.trim().toUpperCase();

    switch (true) {
      case normalized === "ANALISAR MERCADO":
        return this.business.scanMarket();
      case normalized === "CRIAR NEGOCIO":
        return this.business.identifyOpportunities();
      case normalized === "RENDERIZAR BLUEPRINT":
        return this.business.generateBusinessBlueprint("founder");
      case normalized === "OTIMIZAR SISTEMA": {
        const fixes = await this.evolution.suggestFixes();
        this.evolution.applyFixes(fixes);
        return fixes;
      }
      case normalized === "DIAGNOSTICO COMPLETO": {
        const analysis = await this.evolution.analyzeSystem();
        const insight = await this.neural.summarize(analysis);
        return { analysis, insight };
      }
      case normalized.startsWith("REINICIAR CORE "):
        return this.restartCore(normalized.replace("REINICIAR CORE ", ""));
      default:
        throw new Error(`Comando fundador não reconhecido: ${command}`);
    }
  }

  private restartCore(name: string): string {
    switch (name) {
      case "GOVERNANCE":
        this.governance.initialize();
        break;
      case "SECURITY":
        this.security.initialize();
        break;
      case "NEURAL":
        this.neural.initialize();
        break;
      case "EVOLUTION":
        this.evolution.initialize();
        break;
      case "BUSINESS":
        this.business.initialize();
        break;
      case "FINANCE":
        this.finance.initialize();
        break;
      case "NLE":
        this.nle.initialize();
        break;
      default:
        throw new Error(`Core desconhecido: ${name}`);
    }
    return `[${name} core restarted]`;
  }
}
