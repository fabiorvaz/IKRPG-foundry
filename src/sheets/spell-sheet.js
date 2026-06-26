/**
 * Classe da Ficha de Item para Magias (Spell Sheet).
 * Define a lógica de visualização e manipulação do formulário da ficha de item de magia.
 */
export class IKRPGSpellSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ikrpg", "sheet", "item", "spell"],
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
    return "systems/ikrpg/templates/items/spell-sheet.hbs";
  }

  /** @override */
  getData(options) {
    const context = super.getData(options);
    
    // Facilitador para acessar os dados do schema diretamente no template
    context.system = this.item.system;

    return context;
  }
}
