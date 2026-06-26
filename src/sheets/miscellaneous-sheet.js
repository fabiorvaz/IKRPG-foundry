/**
 * Sheet class for Miscellaneous items.
 * Manages view options, templates, and data context for rendering the sheet.
 */
export class IKRPGMiscellaneousSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ikrpg", "sheet", "item", "miscellaneous"],
      width: 550,
      height: 460,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "properties"
      }]
    });
  }

  /** @override */
  get template() {
    return "systems/ikrpg/templates/items/miscellaneous-sheet.hbs";
  }

  /** @override */
  getData(options) {
    const context = super.getData(options);
    
    // Provide direct reference to system fields for easier template access
    context.system = this.item.system;

    // Prepare localized choices for miscellaneous types
    context.itemTypes = {
      "general": game.i18n.localize("IKRPG.Miscellaneous.TypeGeneral") || "Geral",
      "tool": game.i18n.localize("IKRPG.Miscellaneous.TypeTool") || "Ferramenta",
      "valuable": game.i18n.localize("IKRPG.Miscellaneous.TypeValuable") || "Objeto de Valor",
      "container": game.i18n.localize("IKRPG.Miscellaneous.TypeContainer") || "Recipiente",
      "other": game.i18n.localize("IKRPG.Miscellaneous.TypeOther") || "Outro"
    };

    return context;
  }
}
