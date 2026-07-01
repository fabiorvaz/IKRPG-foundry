/**
 * Classe da Ficha de Item para Habilidades (Ability Sheet) usando ApplicationV2.
 * Define a lógica de visualização e manipulação do formulário da ficha de item de habilidade.
 */
export class IKRPGAbilitySheet extends foundry.applications.sheets.ItemSheetV2 {
  /** @override */
  static DEFAULT_OPTIONS = {
    actions: {},
    classes: ["ikrpg", "sheet", "item", "ability"],
    position: {
      width: 550,
      height: 450
    },
    form: {
      submitOnChange: true,
      closeOnSubmit: false
    }
  };

  /** @override */
  static PARTS = {
    form: {
      template: "systems/ikrpg/templates/items/ability-sheet.hbs"
    }
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    // Facilitador para acessar os dados do schema diretamente no template
    context.system = this.document.system;

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
