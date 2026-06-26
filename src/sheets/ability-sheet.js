/**
 * Classe da Ficha de Item para Habilidades (Ability Sheet).
 * Define a lógica de visualização e manipulação do formulário da ficha de item de habilidade.
 */
export class IKRPGAbilitySheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ikrpg", "sheet", "item", "ability"],
      width: 550,
      height: 450,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "properties"
      }]
    });
  }

  /** @override */
  get template() {
    return "systems/ikrpg/templates/items/ability-sheet.hbs";
  }

  /** @override */
  getData(options) {
    const context = super.getData(options);
    
    // Facilitador para acessar os dados do schema diretamente no template
    context.system = this.item.system;

    // Obter os tipos de habilidade e suas traduções correspondentes
    context.abilityTypes = {
      archetype: game.i18n.localize("IKRPG.Ability.TypeArchetype") || "Habilidade de Arquétipo",
      career: game.i18n.localize("IKRPG.Ability.TypeCareer") || "Habilidade de Carreira",
      general: game.i18n.localize("IKRPG.Ability.TypeGeneral") || "Habilidade Geral",
      other: game.i18n.localize("IKRPG.Ability.TypeOther") || "Outra"
    };

    return context;
  }
}
